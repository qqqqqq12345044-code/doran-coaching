// Hero 배경에 아주 옅게 깔리는 추상 도형. 텍스트 영역과 겹치지 않는 가장자리에만
// 배치하고, 매우 느리게 floating한다. 가독성을 해치지 않도록 opacity를 낮게 유지한다.
export default function HeroBackgroundBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-english/10 blur-3xl animate-float-slow" />
      <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-brand/10 blur-3xl animate-float-slow-delayed" />
      <span className="absolute right-[18%] top-[22%] hidden h-2.5 w-2.5 rounded-full bg-english/30 animate-float lg:block" />
      <span className="absolute right-[28%] top-[62%] hidden h-1.5 w-1.5 rounded-full bg-brand/30 animate-float-delayed lg:block" />
    </div>
  );
}
