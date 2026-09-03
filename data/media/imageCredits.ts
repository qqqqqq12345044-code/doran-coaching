// 실제 사용 중인 Stock 이미지 출처 추적용 Source of Truth.
//
// - 전부 Unsplash License(무료, 저작자 표시 의무 없음) 이미지만 사용했다.
// - photographer/sourceUrl은 화면에 크게 노출하지 않아도 되지만, 라이선스
//   재확인이나 교체가 필요할 때를 위해 내부적으로 추적 가능해야 한다.
// - Stock 사진 속 인물은 실제 도란 수강생/강사/후기 작성자가 아니다.
//   coaches.ts/reviews.ts 등 실제 인물 정보와 절대 연결하지 않는다.

export interface ImageCredit {
  id: string;
  /** public/ 기준 상대 경로 */
  localPath: string;
  source: "unsplash";
  sourceUrl: string;
  photographer: string;
  photographerUrl: string;
  /** Unsplash License는 저작자 표시 의무가 없다(false). */
  attributionRequired: boolean;
  license: "Unsplash License";
  /** 이 이미지가 어떤 목적으로 쓰이는지(문서화용). */
  usage: string;
}

export const imageCredits: ImageCredit[] = [
  {
    id: "english-hero",
    localPath: "/images/language/english-hero.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/two-women-talking-at-an-outdoor-cafe-table-9ZNNeEUM7Q4",
    photographer: "Vitaly Gariev",
    photographerUrl: "https://unsplash.com/@silverkblack",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "영어 페이지 Hero 비주얼 — 밝은 카페에서 자연스럽게 대화하는 모습",
  },
  {
    id: "english-online-learning",
    localPath: "/images/language/english-online-learning.jpg",
    source: "unsplash",
    sourceUrl:
      "https://unsplash.com/photos/two-women-studying-together-at-a-table-with-laptop-2FDdgn0-W_o",
    photographer: "Chidera Faustina Okeke",
    photographerUrl: "https://unsplash.com/@thefourthwxll",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "영어 페이지 Curriculum 영역 Supporting 비주얼 — 노트북을 활용한 학습",
  },
  {
    id: "japanese-hero",
    localPath: "/images/language/japanese-hero.jpg",
    source: "unsplash",
    sourceUrl:
      "https://unsplash.com/photos/a-couple-of-people-that-are-walking-down-a-street-1kFeoOZmj9E",
    photographer: "mos design",
    photographerUrl: "https://unsplash.com/@mosdesign",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "일본어 페이지 Hero 비주얼 — 일본(아키하바라, 도쿄) 거리의 일상",
  },
  {
    id: "japanese-business",
    localPath: "/images/language/japanese-business.jpg",
    source: "unsplash",
    sourceUrl:
      "https://unsplash.com/photos/woman-presenting-to-colleagues-in-a-modern-office-meeting-Y7TJOcAtnpw",
    photographer: "Vitaly Gariev",
    photographerUrl: "https://unsplash.com/@silverkblack",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "일본어 페이지 Curriculum 영역 Supporting 비주얼 — 비즈니스 상황 커뮤니케이션",
  },
  {
    id: "chinese-hero",
    localPath: "/images/language/chinese-hero.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/an-open-book-with-chinese-writing-on-it-Q22bI2xEY78",
    photographer: "Karen Zhao",
    photographerUrl: "https://unsplash.com/@karenzhaocn",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "중국어 페이지 Hero 비주얼 — 중국어 서예/문자 학습",
  },
  {
    id: "chinese-study",
    localPath: "/images/language/chinese-study.jpg",
    source: "unsplash",
    sourceUrl:
      "https://unsplash.com/photos/desk-with-open-book-laptop-and-study-materials-HNjWq8WPyoY",
    photographer: "Yen Vu",
    photographerUrl: "https://unsplash.com/@yenvu2410",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "중국어 페이지 Curriculum 영역 Supporting 비주얼 — 교재/노트를 활용한 학습",
  },
];

export function getImageCredit(id: string): ImageCredit | null {
  return imageCredits.find((credit) => credit.id === id) ?? null;
}
