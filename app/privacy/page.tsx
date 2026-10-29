import type { Metadata } from "next";
import type { ReactNode } from "react";
import { brand } from "@/data/brand";
import { privacyPolicyInfo } from "@/data/privacy";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 도란 DORAN",
  description: "도란 DORAN 상담 신청 시 수집하는 정보와 사이트 이용 통계·광고 성과 측정 도구(쿠키) 사용에 대한 안내입니다.",
  alternates: { canonical: "/privacy" },
};

// 이 페이지의 모든 문구는 현재 코드에 실제로 구현된 범위만 설명한다 — 기능이 바뀌면 함께 갱신한다.
// - 상담폼 전송 항목: components/ConsultationSection.tsx(payload) + lib/attribution.ts
// - 저장: scripts/google-apps-script/consultation.gs(스프레드시트 저장, 선택적 알림 메일)
// - GA4: components/GoogleAnalytics.tsx(gtag config 기본 page_view만, 커스텀 이벤트 없음)
// - 네이버: lib/naverWcs.ts(inflow 쿠키, PV, 상담 저장 성공 시 trans 전환 — 입력값은 보내지 않음)
// 처리주체/보유기간/문의처/시행일은 확정 전이라 data/privacy.ts가 비어 있으면 그리지 않는다.

const EXTERNAL_LINK_CLASS = "font-medium text-brand underline underline-offset-2 hover:text-brand-dark";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-ink/10 pt-8">
      <h2 className="text-[19px] font-bold leading-snug text-ink md:text-[21px]">{title}</h2>
      <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink-soft">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5 marker:text-ink-faint">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${EXTERNAL_LINK_CLASS} break-words`}>
      {children}
    </a>
  );
}

export default function PrivacyPage() {
  const { processor, retentionPeriod, contact, effectiveDate } = privacyPolicyInfo;
  const operatorRows = [
    processor && { label: "개인정보 처리주체", value: processor },
    retentionPeriod && { label: "보유 기간", value: retentionPeriod },
    contact && { label: "문의처", value: contact },
    effectiveDate && { label: "시행일", value: effectiveDate },
  ].filter((row): row is { label: string; value: string } => Boolean(row));

  return (
    <section className="section-pad">
      <div className="section-shell max-w-3xl">
        <p className="eyebrow">Privacy</p>
        <h1 className="text-balance mt-4 text-[28px] font-extrabold leading-tight text-ink md:text-[34px]">
          개인정보처리방침
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-ink-soft md:text-[16px]">
          {brand.brandLabel}(이하 &lsquo;도란&rsquo;)은 상담 신청 과정에서 받은 정보와 사이트를 이용하는
          과정에서 생성되는 정보를 아래와 같이 처리합니다. 이 안내는 현재 사이트에 실제로 적용된 기능을
          기준으로 작성되었습니다.
        </p>

        <div className="mt-8 rounded-xl2 bg-surface-soft p-6 md:p-7">
          <p className="text-[14px] font-semibold text-ink">한눈에 보기</p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[14.5px] leading-relaxed text-ink-soft marker:text-ink-faint">
            <li>상담 신청서에 입력한 정보는 상담 회신과 수업 매칭을 위해서만 사용합니다.</li>
            <li>사이트 이용 통계를 위해 Google 애널리틱스를, 네이버 광고 성과 확인을 위해 네이버 전환 추적을 사용할 수 있습니다.</li>
            <li>상담 신청서에 입력한 이름·연락처 등은 이 분석 도구들로 보내지 않습니다.</li>
            <li>쿠키는 브라우저 설정에서 언제든 차단하거나 삭제할 수 있습니다.</li>
          </ul>
        </div>

        <div className="mt-10 space-y-10">
          <Section title="1. 상담 신청 시 수집하는 정보">
            <p>상담 신청서를 제출할 때 아래 정보를 받습니다.</p>
            <Bullets
              items={[
                "직접 입력하는 정보: 이름, 연락처, 나이, 주소(상세주소·우편번호 포함), 관심 언어, 학습 목적(선택), 현재 수준(선택), 문의 내용, 개인정보 수집·이용 동의 여부",
                "제출 시 함께 전송되는 정보: 신청한 페이지 주소, 처음 방문한 페이지, 이전에 보던 사이트 주소(referrer), 광고 링크에 포함된 유입 정보(UTM), 처음 방문 주소에 네이버 유입 파라미터(NaPm)가 있었는지 여부, 위 정보를 바탕으로 구분한 유입 분류, 브라우저 정보(user agent)",
              ]}
            />
          </Section>

          <Section title="2. 이용 목적">
            <Bullets
              items={[
                "상담 신청에 대한 회신 및 연락",
                "학습 목표에 맞는 수업 매칭, 무료 체험 수업 안내 및 학습 관리",
                "상담 신청이 어떤 페이지나 광고를 통해 들어왔는지 확인(제출 시 함께 전송되는 정보)",
              ]}
            />
          </Section>

          <Section title="3. 저장 및 관리">
            <p>
              상담 신청 내용은 Google Apps Script를 통해 도란이 관리하는 Google 스프레드시트에 저장되며,
              신규 접수 사실이 담당자에게 이메일로 알림될 수 있습니다.
            </p>
            <p>
              개인정보 수집·이용에 동의하지 않으실 수 있으며, 동의하지 않으시면 상담 신청이 제한될 수
              있습니다.
            </p>
          </Section>

          <Section title="4. 쿠키 및 유사 기술">
            <p>
              쿠키는 웹사이트가 이용자의 브라우저에 저장하는 작은 텍스트 파일입니다. 도란은 아래 목적으로
              쿠키와 브라우저 저장소를 사용할 수 있습니다.
            </p>
            <Bullets
              items={[
                "방문 통계: Google 애널리틱스 쿠키(_ga 등)",
                "광고 성과 측정: 네이버 광고를 통해 방문한 경우 광고 유입 정보를 담은 쿠키",
                "유입 경로 확인: 처음 방문한 페이지와 유입 정보(UTM·referrer·NaPm 존재 여부)를 브라우저 탭의 세션 저장소(sessionStorage)에 보관하며, 상담 신청서를 제출할 때만 함께 전송됩니다. 탭을 닫으면 삭제됩니다.",
              ]}
            />
            <p>
              브라우저 설정에서 쿠키 저장을 거부하거나 저장된 쿠키를 삭제할 수 있습니다. 쿠키를 차단해도
              상담 신청은 이용할 수 있습니다.
            </p>
          </Section>

          <Section title="5. Google 애널리틱스">
            <p>
              도란은 사이트 이용 현황을 파악하고 서비스를 개선하기 위해 Google LLC가 제공하는 Google
              애널리틱스를 사용합니다.
            </p>
            <Bullets
              items={[
                "수집될 수 있는 정보: 방문한 페이지, 방문 일시, 유입 경로, 기기·브라우저 정보, 대략적인 지역 등 사이트 이용 기록",
                "상담 신청서에 입력한 이름·연락처 등의 내용은 Google 애널리틱스로 전송하지 않습니다.",
              ]}
            />
            <p>
              브라우저의 쿠키 설정이나{" "}
              <ExternalLink href="https://tools.google.com/dlpage/gaoptout">
                Google 애널리틱스 차단 브라우저 부가기능
              </ExternalLink>
              으로 수집을 제한할 수 있습니다. 자세한 내용은{" "}
              <ExternalLink href="https://policies.google.com/privacy">Google 개인정보처리방침</ExternalLink>을
              참고해주세요.
            </p>
          </Section>

          <Section title="6. 네이버 광고 전환 추적">
            <p>
              도란은 네이버 검색광고의 성과를 확인하기 위해 네이버 주식회사가 제공하는 전환 추적
              스크립트를 사용할 수 있습니다.
            </p>
            <Bullets
              items={[
                "네이버 광고를 통해 방문한 경우 광고 유입 정보를 쿠키에 저장합니다.",
                "페이지 방문 기록과, 상담 신청이 정상 접수되었을 때 ‘상담 신청’ 전환이 발생했다는 사실을 네이버에 전송합니다.",
                "상담 신청서에 입력한 이름·연락처 등의 내용은 네이버로 전송하지 않습니다.",
              ]}
            />
            <p>
              브라우저의 쿠키 설정으로 저장을 제한할 수 있습니다. 자세한 내용은{" "}
              <ExternalLink href="https://policy.naver.com/policy/privacy.html">네이버 개인정보처리방침</ExternalLink>을
              참고해주세요.
            </p>
          </Section>

          <Section title="7. 주소 검색 서비스">
            <p>
              상담 신청서의 &lsquo;주소 검색&rsquo; 버튼을 누를 때에만 카카오 우편번호 서비스를 불러오며, 주소
              검색은 해당 서비스 화면에서 이루어집니다.
            </p>
          </Section>

          {operatorRows.length > 0 && (
            <Section title="8. 운영 정보">
              <dl className="space-y-2">
                {operatorRows.map((row) => (
                  <div key={row.label} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                    <dt className="shrink-0 font-semibold text-ink sm:w-36">{row.label}</dt>
                    <dd className="break-words">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </Section>
          )}

          <p className="border-t border-ink/10 pt-8 text-[13.5px] leading-relaxed text-ink-faint">
            사이트 기능이 바뀌어 처리하는 정보가 달라지면 이 안내도 함께 갱신합니다.
          </p>
        </div>
      </div>
    </section>
  );
}
