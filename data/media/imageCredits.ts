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

  // 12개 세부 과정 페이지(/english,/japanese,/chinese 의 conversation·
  // certification·school·other) 전용 Hero/중간 Visual Break 이미지.
  // 언어 하나당 이미지를 돌려쓰던 이전 방식과 달리, 카테고리별로 서로 다른
  // 이미지를 쓴다(components/detail/DetailPageLayout.tsx의 DETAIL_IMAGES 참고).

  // 영어 -----------------------------------------------------------------
  {
    id: "detail-english-conversation-hero",
    localPath: "/images/detail/english/conversation/hero.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/smiling-woman-works-on-her-laptop-eQryxYGXsu0",
    photographer: "Vitaly Gariev",
    photographerUrl: "https://unsplash.com/@silverkblack",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "영어 회화 상세페이지(/english/conversation) Hero 비주얼 — 노트북으로 화상통화하며 대화하는 모습",
  },
  {
    id: "detail-english-conversation-mid",
    localPath: "/images/detail/english/conversation/mid.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/young-woman-smiling-while-working-on-a-laptop-at-desk-UHfJI_lZoPo",
    photographer: "Vitaly Gariev",
    photographerUrl: "https://unsplash.com/@silverkblack",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "영어 회화 상세페이지 중간 Visual Break — 책상에서 노트북 화상통화로 대화하는 모습",
  },
  {
    id: "detail-english-certification-hero",
    localPath: "/images/detail/english/certification/hero.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/a-person-studying-at-a-desk-with-books-QR-XQbUVC1s",
    photographer: "Yanhao Fang",
    photographerUrl: "https://unsplash.com/@alamanga",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "영어 자격증 상세페이지 Hero 비주얼 — 책상에서 집중해서 공부하는 모습",
  },
  {
    id: "detail-english-certification-mid",
    localPath: "/images/detail/english/certification/mid.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/open-book-and-notebook-with-pen-and-ruler-z48gj4ZFbrc",
    photographer: "Kelly Sikkema",
    photographerUrl: "https://unsplash.com/@kellysikkema",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "영어 자격증 상세페이지 중간 Visual Break — 시험 준비 학습자료(책·노트·펜)",
  },
  {
    id: "detail-english-school-hero",
    localPath: "/images/detail/english/school/hero.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/teacher-instructing-students-in-a-classroom-setting-MWdcDtDTq9E",
    photographer: "Vitaly Gariev",
    photographerUrl: "https://unsplash.com/@silverkblack",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "영어 내신 상세페이지 Hero 비주얼 — 교실에서 학생들과 함께하는 학습 장면",
  },
  {
    id: "detail-english-school-mid",
    localPath: "/images/detail/english/school/mid.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/a-desk-with-papers-pens-and-a-highlighter-3Hcz2zvPqBI",
    photographer: "Yen Vu",
    photographerUrl: "https://unsplash.com/@yenvu2410",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "영어 내신 상세페이지 중간 Visual Break — 필기 자료가 놓인 책상",
  },
  {
    id: "detail-english-other-hero",
    localPath: "/images/detail/english/other/hero.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/two-professionals-shaking-hands-across-a-table-jEpZNyFSQwQ",
    photographer: "Vitaly Gariev",
    photographerUrl: "https://unsplash.com/@silverkblack",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "영어 기타(유학·취업) 상세페이지 Hero 비주얼 — 커리어 상담·면접을 연상시키는 악수 장면",
  },
  {
    id: "detail-english-other-mid",
    localPath: "/images/detail/english/other/mid.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/a-person-typing-on-a-laptop-on-a-desk-a1MHEv62kdo",
    photographer: "Jakub Żerdzicki",
    photographerUrl: "https://unsplash.com/@jakubzerdzicki",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "영어 기타 상세페이지 중간 Visual Break — 노트북으로 실무를 준비하는 모습",
  },

  // 일본어 ---------------------------------------------------------------
  {
    id: "detail-japanese-conversation-hero",
    localPath: "/images/detail/japanese/conversation/hero.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/2uuaV_fI4LU",
    photographer: "Jezael Melgoza",
    photographerUrl: "https://unsplash.com/@jezar",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "일본어 회화 상세페이지 Hero 비주얼 — 아키하바라풍 네온 거리 야경",
  },
  {
    id: "detail-japanese-conversation-mid",
    localPath: "/images/detail/japanese/conversation/mid.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/nSj0hdQUrW0",
    photographer: "Vitaly Gariev",
    photographerUrl: "https://unsplash.com/@silverkblack",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "일본어 회화 상세페이지 중간 Visual Break — 노트북 화상통화로 인사하는 모습",
  },
  {
    id: "detail-japanese-certification-hero",
    localPath: "/images/detail/japanese/certification/hero.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/Imz-pn2LMbg",
    photographer: "Julio Lopez",
    photographerUrl: "https://unsplash.com/@juliolopez",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "일본어 자격증(JLPT·JPT) 상세페이지 Hero 비주얼 — 헤드폰을 쓰고 집중해서 학습하는 모습",
  },
  {
    id: "detail-japanese-certification-mid",
    localPath: "/images/detail/japanese/certification/mid.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/O04ybN0h1C8",
    photographer: "Benoît Deschasaux",
    photographerUrl: "https://unsplash.com/@benowa",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "일본어 자격증 상세페이지 중간 Visual Break — 노트에 필기하는 손",
  },
  {
    id: "detail-japanese-school-hero",
    localPath: "/images/detail/japanese/school/hero.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/woman-working-at-a-desk-with-a-laptop-and-notebook-Ad2TAPEhliE",
    photographer: "Vitaly Gariev",
    photographerUrl: "https://unsplash.com/@silverkblack",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "일본어 내신 상세페이지 Hero 비주얼 — 책상에서 집중해서 필기하며 공부하는 모습",
  },
  {
    id: "detail-japanese-school-mid",
    localPath: "/images/detail/japanese/school/mid.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/hBdaqrr5Z3k",
    photographer: "Kelly Sikkema",
    photographerUrl: "https://unsplash.com/@kellysikkema",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "일본어 내신 상세페이지 중간 Visual Break — 펼쳐진 노트와 펜들이 놓인 책상",
  },
  {
    id: "detail-japanese-other-hero",
    localPath: "/images/detail/japanese/other/hero.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/FBnElwHyMkM",
    photographer: "Marcel Petzold",
    photographerUrl: "https://unsplash.com/@mpsc2021",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "일본어 기타(유학·취업·비즈니스) 상세페이지 Hero 비주얼 — 발표가 있는 비즈니스 미팅 장면",
  },
  {
    id: "detail-japanese-other-mid",
    localPath: "/images/detail/japanese/other/mid.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/_P2FUxxU2qE",
    photographer: "Amanda Bartel",
    photographerUrl: "https://unsplash.com/@amandaxbartel",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "일본어 기타 상세페이지 중간 Visual Break — 카메라·여권 등 유학/여행 준비 플랫레이",
  },

  // 중국어 ---------------------------------------------------------------
  {
    id: "detail-chinese-conversation-hero",
    localPath: "/images/detail/chinese/conversation/hero.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/nBiJoRbVHmA",
    photographer: "Akinyemi Gbadamosi",
    photographerUrl: "https://unsplash.com/@mhyk3y",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "중국어 회화 상세페이지 Hero 비주얼 — 헤드폰을 쓰고 통화하며 웃는 모습",
  },
  {
    id: "detail-chinese-conversation-mid",
    localPath: "/images/detail/chinese/conversation/mid.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/woman-waving-during-a-video-call-on-her-laptop-nSj0hdQUrW0",
    photographer: "Vitaly Gariev",
    photographerUrl: "https://unsplash.com/@silverkblack",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "중국어 회화 상세페이지 중간 Visual Break — 노트북 화상통화 중 손 흔드는 모습",
  },
  {
    id: "detail-chinese-certification-hero",
    localPath: "/images/detail/chinese/certification/hero.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/student-studying-at-a-desk-with-a-chalkboard-otASzgFlJ_c",
    photographer: "Vitaly Gariev",
    photographerUrl: "https://unsplash.com/@silverkblack",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "중국어 자격증(HSK 등) 상세페이지 Hero 비주얼 — 칠판 앞 책상에서 집중해서 공부하는 모습",
  },
  {
    id: "detail-chinese-certification-mid",
    localPath: "/images/detail/chinese/certification/mid.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/a-white-paper-with-chinese-writing-on-it-A34D7VNI9FQ",
    photographer: "Bernd Dittrich",
    photographerUrl: "https://unsplash.com/@hdbernd",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "중국어 자격증 상세페이지 중간 Visual Break — 중국어 글씨가 쓰인 종이",
  },
  {
    id: "detail-chinese-school-hero",
    localPath: "/images/detail/chinese/school/hero.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/a-person-writing-on-a-notebook-with-a-pen-QYDwXBYO1p4",
    photographer: "Seljan Salimova",
    photographerUrl: "https://unsplash.com/@seljansalim",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "중국어 내신 상세페이지 Hero 비주얼 — 노트에 펜으로 필기하는 모습",
  },
  {
    id: "detail-chinese-school-mid",
    localPath: "/images/detail/chinese/school/mid.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/a-desk-with-papers-pens-and-a-highlighter-3Hcz2zvPqBI",
    photographer: "Yen Vu",
    photographerUrl: "https://unsplash.com/@yenvu2410",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "중국어 내신 상세페이지 중간 Visual Break — 필기구와 형광펜이 놓인 책상",
  },
  {
    id: "detail-chinese-other-hero",
    localPath: "/images/detail/chinese/other/hero.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/two-women-shaking-hands-across-a-desk-9TF9pMrCFMo",
    photographer: "Vitaly Gariev",
    photographerUrl: "https://unsplash.com/@silverkblack",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "중국어 기타(유학·취업·무역) 상세페이지 Hero 비주얼 — 책상 너머로 악수하는 모습",
  },
  {
    id: "detail-chinese-other-mid",
    localPath: "/images/detail/chinese/other/mid.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/business-people-attending-a-presentation-in-a-modern-office-w4j16upQBqE",
    photographer: "Vitaly Gariev",
    photographerUrl: "https://unsplash.com/@silverkblack",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "중국어 기타 상세페이지 중간 Visual Break — 현대적 사무실에서 발표를 듣는 모습",
  },
];

export function getImageCredit(id: string): ImageCredit | null {
  return imageCredits.find((credit) => credit.id === id) ?? null;
}
