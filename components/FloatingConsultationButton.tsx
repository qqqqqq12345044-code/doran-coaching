"use client";

import { MessageCircle } from "lucide-react";

function scrollToConsultation() {
  const target = document.getElementById("consultation");
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  window.location.href = "/#consultation";
}

export default function FloatingConsultationButton() {
  return (
    <button
      type="button"
      onClick={scrollToConsultation}
      aria-label="무료 상담 신청하기"
      className="fixed bottom-6 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-soft transition-transform duration-200 hover:scale-105 md:bottom-8 md:right-8 md:h-auto md:w-auto md:gap-2 md:rounded-full md:px-6 md:py-4"
    >
      <MessageCircle size={22} className="md:hidden" aria-hidden />
      <MessageCircle size={18} className="hidden md:block" aria-hidden />
      <span className="hidden text-[15px] font-semibold md:inline">
        무료 상담
      </span>
    </button>
  );
}
