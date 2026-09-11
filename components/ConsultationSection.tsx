"use client";

import { useRef, useState, type FormEvent } from "react";
import { CheckCircle2, AlertCircle, Search } from "lucide-react";
import Reveal from "@/components/Reveal";
import { languages } from "@/data/languages";

// 관심 언어 체크박스는 data/languages.ts(Source of Truth)의 nameKo를 그대로
// 재사용한다. "아직 고민 중이에요"는 언어가 아니므로 별도로 추가한다.
const INTEREST_OPTIONS = [...languages.map((lang) => lang.nameKo), "아직 고민 중이에요"];

type SubmitStatus = "idle" | "submitting" | "success" | "error";

// 카카오(구 다음) 우편번호 서비스. 공식 가이드(postcode.map.kakao.com/guide) 기준
// API 키 없이 무료로(상업적 사용 포함, 사용량 제한 없음) embed 가능한 방식만 사용한다.
// 임의의 키를 만들거나 하드코딩하지 않는다.
const KAKAO_POSTCODE_SRC = "//t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

interface KakaoPostcodeData {
  zonecode: string;
  address: string;
  roadAddress: string;
  jibunAddress: string;
}

interface KakaoPostcodeInstance {
  open: () => void;
}

declare global {
  interface Window {
    kakao?: {
      Postcode: new (options: { oncomplete: (data: KakaoPostcodeData) => void }) => KakaoPostcodeInstance;
    };
  }
}

let kakaoPostcodeLoadPromise: Promise<void> | null = null;

// 상담폼이 97,905개 Local SEO 페이지를 포함해 사이트 전반에 노출되므로, 우편번호
// 스크립트는 모든 방문자에게 미리 로드하지 않고 "주소 검색" 버튼을 실제로 클릭한
// 시점에만 지연 로드한다(이미 로드됐다면 재사용).
function loadKakaoPostcode(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.kakao?.Postcode) return Promise.resolve();
  if (kakaoPostcodeLoadPromise) return kakaoPostcodeLoadPromise;

  kakaoPostcodeLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = KAKAO_POSTCODE_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      kakaoPostcodeLoadPromise = null;
      reject(new Error("카카오 우편번호 스크립트를 불러오지 못했습니다."));
    };
    document.head.appendChild(script);
  });

  return kakaoPostcodeLoadPromise;
}

interface ConsultationSectionProps {
  title?: string[];
  subtitle?: string;
  /** 지정한 언어의 관심 언어 체크박스를 기본 선택 상태로 보여준다. (예: 언어별/지역 랜딩페이지) */
  defaultInterest?: string[];
}

export default function ConsultationSection({
  title = ["어떤 외국어를", "어떻게 시작해야 할지 고민된다면"],
  subtitle = "먼저 상담을 통해 나에게 맞는 학습 방법을 찾아보세요.",
  defaultInterest,
}: ConsultationSectionProps) {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [addressSearchError, setAddressSearchError] = useState(false);
  const baseAddressRef = useRef<HTMLInputElement>(null);
  const zonecodeRef = useRef<HTMLInputElement>(null);
  const addressDetailRef = useRef<HTMLInputElement>(null);

  async function handleAddressSearch() {
    setAddressSearchError(false);
    try {
      await loadKakaoPostcode();
      new window.kakao!.Postcode({
        oncomplete: (data) => {
          if (baseAddressRef.current) {
            baseAddressRef.current.value = data.roadAddress || data.address || data.jibunAddress;
          }
          if (zonecodeRef.current) {
            zonecodeRef.current.value = data.zonecode ?? "";
          }
          addressDetailRef.current?.focus();
        },
      }).open();
    } catch {
      setAddressSearchError(true);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    // Honeypot: 사람 눈에는 보이지 않는 필드. 값이 채워져 있으면 봇으로 간주해
    // 실제 전송 없이 성공한 것처럼만 화면을 마무리한다(봇에게 실패를 알리지 않음).
    if (String(formData.get("company") ?? "").trim() !== "") {
      form.reset();
      setStatus("success");
      return;
    }

    const endpoint = process.env.NEXT_PUBLIC_CONSULTATION_ENDPOINT;
    if (!endpoint) {
      // 운영 endpoint가 아직 설정되지 않은 상태. 사용자에게는 실패로만 안내하고,
      // 원인은 콘솔에만 남겨 UI에 내부 설정 상태를 노출하지 않는다.
      // eslint-disable-next-line no-console
      console.error("NEXT_PUBLIC_CONSULTATION_ENDPOINT가 설정되지 않았습니다.");
      setStatus("error");
      return;
    }

    const payload = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      address: String(formData.get("address") ?? ""),
      addressDetail: String(formData.get("addressDetail") ?? ""),
      zonecode: String(formData.get("zonecode") ?? ""),
      interest: formData.getAll("interest").map(String),
      message: String(formData.get("message") ?? ""),
      privacyConsent: formData.get("privacyConsent") === "on",
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
      userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "",
    };

    setStatus("submitting");

    try {
      // Google Apps Script Web App으로 전송. Content-Type을 text/plain으로 두는
      // 이유: application/json으로 보내면 브라우저가 먼저 OPTIONS preflight를
      // 보내는데 Apps Script Web App은 이를 처리하지 않아 요청이 막힌다.
      // text/plain은 "simple request"라 preflight 없이 바로 전송되고, Apps
      // Script 쪽(doPost)에서는 e.postData.contents를 JSON.parse해서 그대로
      // 읽는다. no-cors는 쓰지 않는다 — 그러면 응답을 읽을 수 없어 성공/실패를
      // 구분하지 못한다(41/39 항목).
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as { success?: boolean } | null;

      if (response.ok && result?.success) {
        form.reset();
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="consultation"
      className="section-pad scroll-mt-20 bg-gradient-to-br from-brand to-brand-dark"
    >
      <div className="section-shell grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <Reveal className="text-white">
          <h2 className="text-[28px] font-bold leading-snug md:text-[36px]">
            {title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/80 md:text-[16px]">
            {subtitle}
          </p>
        </Reveal>

        <Reveal delay={120}>
          <form
            onSubmit={handleSubmit}
            className="relative rounded-xl3 bg-white p-7 shadow-soft md:p-9"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Honeypot: 시각적으로 숨기되 display:none만으로 숨기지 않는다(일부
                  봇은 이를 감지해 우회) — 화면 밖(left:-9999px)으로 이동시키는
                  방식은 유지한다. 다만 이 오프스크린 기법은 스크린리더에는 여전히
                  노출돼, 가상 커서로 탐색하는 사용자가 실수로 "회사명"을 채우면
                  Apps Script가 성공 응답만 주고 실제로는 저장하지 않아 상담 신청이
                  조용히 유실되는 문제가 있었다(2026-09 발견). aria-hidden을 추가해
                  스크린리더에서 완전히 제외한다 — 이미 오프스크린 배치 자체가
                  탐지 가능한 신호라 aria-hidden 추가로 봇 탐지 위험이 실질적으로
                  늘지 않는다. */}
              <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="company">회사명</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="name" className="text-[14px] font-medium text-ink">
                  이름
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="이름을 입력해주세요."
                  className="mt-2 w-full rounded-xl border border-ink/12 bg-surface-soft px-4 py-3 text-[15px] text-ink placeholder:text-ink-faint transition-colors focus:border-brand"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="phone" className="text-[14px] font-medium text-ink">
                  연락처
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  placeholder="010-1234-5678"
                  className="mt-2 w-full rounded-xl border border-ink/12 bg-surface-soft px-4 py-3 text-[15px] text-ink placeholder:text-ink-faint transition-colors focus:border-brand"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address" className="text-[14px] font-medium text-ink">
                  주소
                </label>
                <p className="mt-1 text-[12.5px] text-ink-faint">주소 검색으로 기본주소를 입력해주세요.</p>
                <div className="mt-2 flex gap-2">
                  <input
                    ref={baseAddressRef}
                    id="address"
                    name="address"
                    type="text"
                    required
                    readOnly
                    autoComplete="address-level3"
                    placeholder="주소 검색을 눌러주세요"
                    className="w-full min-w-0 flex-1 rounded-xl border border-ink/12 bg-surface-soft px-4 py-3 text-[15px] text-ink placeholder:text-ink-faint transition-colors focus:border-brand"
                  />
                  <button
                    type="button"
                    onClick={handleAddressSearch}
                    className="flex shrink-0 items-center gap-1.5 rounded-xl border border-ink/12 bg-white px-4 py-3 text-[14px] font-medium text-ink transition-colors hover:border-brand hover:text-brand"
                  >
                    <Search size={15} aria-hidden />
                    주소 검색
                  </button>
                </div>
                <input
                  ref={addressDetailRef}
                  id="addressDetail"
                  name="addressDetail"
                  type="text"
                  autoComplete="address-line2"
                  aria-label="상세주소"
                  placeholder="상세주소 (동/호수, 건물명 등)"
                  className="mt-2 w-full rounded-xl border border-ink/12 bg-surface-soft px-4 py-3 text-[15px] text-ink placeholder:text-ink-faint transition-colors focus:border-brand"
                />
                <input ref={zonecodeRef} type="hidden" name="zonecode" />
                {addressSearchError && (
                  <p className="mt-2 text-[12.5px] text-red-600">
                    주소 검색을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
                  </p>
                )}
              </div>

              <fieldset className="sm:col-span-2">
                <legend className="text-[14px] font-medium text-ink">관심 언어</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((lang) => (
                    <label
                      key={lang}
                      className="flex cursor-pointer items-center gap-2 rounded-full border border-ink/12 bg-surface-soft px-4 py-2 text-[14px] text-ink transition-colors has-[:checked]:border-brand has-[:checked]:bg-brand-tint has-[:checked]:text-brand"
                    >
                      <input
                        type="checkbox"
                        name="interest"
                        value={lang}
                        defaultChecked={defaultInterest?.includes(lang)}
                        className="h-3.5 w-3.5 accent-brand"
                      />
                      {lang}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="sm:col-span-2">
                <label htmlFor="message" className="text-[14px] font-medium text-ink">
                  문의 내용
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="현재 수준, 학습 목표, 준비 중인 시험이나 궁금한 내용을 자유롭게 적어주세요."
                  className="mt-2 w-full resize-none rounded-xl border border-ink/12 bg-surface-soft px-4 py-3 text-[15px] text-ink placeholder:text-ink-faint transition-colors focus:border-brand"
                />
              </div>

              {/* TODO(개인정보 정책 확정 전 문구 확장 금지):
                  처리 주체(사업자명)/보유·이용 기간/개인정보처리방침 링크가
                  아직 확정되지 않았다. 확정 전까지는 아래 동의 문구에 정책
                  링크나 구체적인 보유기간을 추가하지 않는다. 수집 항목/목적은
                  실제 폼 필드(위 payload) 기준으로 명시했다 — 필드가 추가/삭제되면
                  이 문구도 함께 갱신한다. */}
              <div className="sm:col-span-2">
                <p className="text-[12.5px] leading-relaxed text-ink-faint">
                  이름·연락처·주소(상세주소 포함)·관심 언어·문의 내용을 상담 회신과 수업
                  매칭 목적으로만 수집합니다.
                </p>
                <label className="mt-2 flex cursor-pointer items-start gap-2.5 text-[13px] leading-relaxed text-ink-soft">
                  <input
                    type="checkbox"
                    name="privacyConsent"
                    required
                    className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
                  />
                  위 개인정보 수집·이용에 동의합니다. (필수)
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? "접수 중..." : "무료 상담 신청"}
            </button>

            {status === "success" && (
              <p className="mt-4 flex items-start gap-2 rounded-xl bg-brand-tint px-4 py-3 text-[13.5px] leading-relaxed text-brand-dark">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden />
                상담 신청이 접수되었습니다. 확인 후 연락드리겠습니다.
              </p>
            )}
            {status === "error" && (
              <p className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-[13.5px] leading-relaxed text-red-700">
                <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden />
                접수 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
