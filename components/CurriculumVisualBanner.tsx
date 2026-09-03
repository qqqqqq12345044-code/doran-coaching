import Image from "next/image";

interface CurriculumVisualBannerProps {
  imageSrc: string;
  imageAlt: string;
  eyebrow: string;
  copy: string;
}

// "Wide Visual Break" — CourseSection(Quick Overview)과 CurriculumExplorer
// (상세 로드맵) 사이에서 페이지 분위기를 전환하는 Section Background.
// 정보 카드처럼 보이지 않도록 section-shell(max-width) 밖으로 사진을 꽉 채우고,
// radius/shadow 없이 뷰포트 폭 그대로 사용한다. 텍스트만 다른 Section과 동일한
// max-width 컨테이너 안에서 정렬한다.
export default function CurriculumVisualBanner({ imageSrc, imageAlt, eyebrow, copy }: CurriculumVisualBannerProps) {
  return (
    <section className="relative h-[240px] w-full overflow-hidden md:h-[360px] lg:h-[400px]">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        loading="lazy"
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/25 to-transparent" />

      <div className="section-shell relative flex h-full flex-col items-start justify-end pb-8 sm:pb-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/80">{eyebrow}</p>
        <p className="text-pretty mt-2 max-w-md text-[19px] font-semibold leading-snug text-white sm:text-[23px]">
          {copy}
        </p>
      </div>
    </section>
  );
}
