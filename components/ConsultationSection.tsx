"use client";

import type { FormEvent } from "react";
import Reveal from "@/components/Reveal";
import { languages } from "@/data/languages";

// 관심 언어 체크박스는 data/languages.ts(Source of Truth)의 nameKo를 그대로
// 재사용한다. "아직 고민 중이에요"는 언어가 아니므로 별도로 추가한다.
const INTEREST_OPTIONS = [...languages.map((lang) => lang.nameKo), "아직 고민 중이에요"];

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
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // 현재 단계에서는 실제 상담 신청 기능(API 연동)을 구현하지 않는다.
    // "접수/전송 완료"처럼 실제 접수를 암시하는 문구를 쓰지 않는다(오인 방지).
    event.preventDefault();
    window.alert(
      "입력하신 내용을 확인했습니다. 이 화면은 프로토타입으로, 실제 상담 접수·전송은 이루어지지 않습니다."
    );
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
            className="rounded-xl3 bg-white p-7 shadow-soft md:p-9"
          >
            <div className="grid gap-5 sm:grid-cols-2">
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
                <p className="mt-1 text-[12.5px] text-ink-faint">도로명까지만 입력해주세요.</p>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  autoComplete="address-level3"
                  placeholder="서울특별시 마포구 월드컵북로"
                  className="mt-2 w-full rounded-xl border border-ink/12 bg-surface-soft px-4 py-3 text-[15px] text-ink placeholder:text-ink-faint transition-colors focus:border-brand"
                />
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

              {/* TODO(개인정보 정책 확정 전 실제 상담 접수 기능 오픈 금지):
                  수집 목적/수집 항목/보유·이용 기간/처리 주체(사업자명)/
                  개인정보처리방침 링크가 아직 확정되지 않았다. 확정 전까지는
                  아래 동의 문구에 정책 링크를 추가하지 않는다. 사용자 화면에는
                  "정책 확인 중" 같은 내부 상태 문구를 노출하지 않는다. */}
              <div className="sm:col-span-2">
                <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-relaxed text-ink-soft">
                  <input
                    type="checkbox"
                    name="privacyConsent"
                    required
                    className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
                  />
                  상담을 위한 개인정보 수집·이용에 동의합니다.
                </label>
              </div>
            </div>

            <button type="submit" className="btn-primary mt-6 w-full">
              상담 신청하기
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
