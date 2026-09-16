import { Phone } from "lucide-react";
import { contact } from "@/data/contact";

// FloatingConsultationButton 바로 위에 쌓이는 보조 CTA. 기존 상담 버튼은
// 이동/수정하지 않고 그대로 두고, 이 버튼만 그 위 자리에 고정 배치한다.
// 상담 버튼(brand 배경 채움)보다 시각적으로 약하게 보이도록 흰 배경 +
// 테두리(btn-secondary와 같은 톤)를 쓴다. 모바일 44px 이상 터치 영역 확보를
// 위해 원형 56px(h-14 w-14)를 모바일/데스크톱 공통으로 유지한다.
export default function FloatingCallButton() {
  return (
    <a
      href={contact.phoneHref}
      aria-label={`전화로 상담 문의하기 (${contact.phoneDisplay})`}
      className="fixed bottom-[92px] right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-soft transition-transform duration-200 hover:scale-105 hover:border-brand/30 active:scale-95 md:bottom-[104px] md:right-8 md:h-auto md:w-auto md:gap-2 md:rounded-full md:px-6 md:py-4"
    >
      <Phone size={20} className="md:hidden" aria-hidden />
      <Phone size={17} className="hidden md:block" aria-hidden />
      <span className="hidden text-[15px] font-semibold md:inline">전화하기</span>
    </a>
  );
}
