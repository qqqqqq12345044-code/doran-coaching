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
    sourceUrl: "https://unsplash.com/photos/smiling-woman-presenting-at-whiteboard-TXxiFuQLBKQ",
    photographer: "ThisisEngineering",
    photographerUrl: "https://unsplash.com/@thisisengineering",
    attributionRequired: false,
    license: "Unsplash License",
    // 이전 사진은 4명이 회의실에서 함께 화면을 보는 장면에 독일어 텍스트("Vertriebsstrategie")가
    // 크게 보여, 1:1 서비스 톤 및 언어 정체성과 맞지 않아 교체(2026-09-04).
    usage: "일본어 페이지 Curriculum 영역 Supporting 비주얼 — 화이트보드 앞에서 이야기하는 1인 비즈니스 장면",
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
    sourceUrl: "https://unsplash.com/photos/an-open-book-with-chinese-writing-on-it-YdRIRl7Ic4o",
    photographer: "Tianhao Zhang",
    photographerUrl: "https://unsplash.com/@julianmokzth",
    attributionRequired: false,
    license: "Unsplash License",
    // 이전 사진은 프랑스어 필기 노트가 전경에 크게 보여 중국어 맥락이 약했음.
    // 실제 한자가 인쇄된 고서 사진으로 교체(2026-09-04).
    usage: "중국어 페이지 Curriculum 영역 Supporting 비주얼 — 한자가 인쇄된 고서(古書)를 펼친 모습",
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
    sourceUrl: "https://unsplash.com/photos/man-using-laptop-computer-and-headphones-sc-B_2-Om7Q",
    photographer: "Samuel Bourke",
    photographerUrl: "https://unsplash.com/@sambourke",
    attributionRequired: false,
    license: "Unsplash License",
    // 이전 사진(Julio Lopez, IaCvRgokDBo)이 중국어 자격증 페이지와 동일하게
    // 중복 사용되고 있어 교체(2026-09-04).
    usage: "영어 자격증 상세페이지 Hero 비주얼 — 듀얼 모니터 앞에서 헤드폰을 쓰고 집중해서 학습하는 모습",
  },
  {
    id: "detail-english-certification-mid",
    localPath: "/images/detail/english/certification/mid.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/open-notebook-with-pen-and-pencils-on-desk-n9AaeihA9HI",
    photographer: "Clay Banks",
    photographerUrl: "https://unsplash.com/@claybanks",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "영어 자격증 상세페이지 중간 Visual Break — 빈 노트와 펜·연필이 놓인 책상",
  },
  {
    id: "detail-english-school-hero",
    localPath: "/images/detail/english/school/hero.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/man-typing-on-laptop-with-notebook-on-desk-4CAKsgjJuEM",
    photographer: "Vitaly Gariev",
    photographerUrl: "https://unsplash.com/@silverkblack",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "영어 내신 상세페이지 Hero 비주얼 — 노트를 옆에 두고 혼자 집중해서 노트북으로 공부하는 모습",
  },
  {
    id: "detail-english-school-mid",
    localPath: "/images/detail/english/school/mid.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/6GPBVYLapYQ",
    photographer: "Lauren Sauder",
    photographerUrl: "https://unsplash.com/@laurensauderstudio",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "영어 내신 상세페이지 중간 Visual Break — 노트·연필·안경이 놓인 깔끔한 책상",
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
    sourceUrl: "https://unsplash.com/photos/a-woman-wearing-glasses-works-on-a-laptop-gxpXLflKzao",
    photographer: "Aleksei Zhivilov",
    photographerUrl: "https://unsplash.com/@bb009x",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "일본어 회화 상세페이지 중간 Visual Break — 노트북으로 집중해서 학습하는 모습",
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
    sourceUrl: "https://unsplash.com/photos/a-person-writing-on-a-notebook-with-a-pen-ZDDF6LMvh2s",
    photographer: "Priscilla Du Preez",
    photographerUrl: "https://unsplash.com/@priscilladupreez",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "일본어 자격증 상세페이지 중간 Visual Break — 노트에 펜으로 필기하는 손",
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
    sourceUrl: "https://unsplash.com/photos/woman-working-on-a-laptop-in-a-modern-office-WrlIRaC9t-A",
    photographer: "Vitaly Gariev",
    photographerUrl: "https://unsplash.com/@silverkblack",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "일본어 기타(유학·취업·비즈니스) 상세페이지 Hero 비주얼 — 혼자 집중해서 노트북으로 업무·자료를 준비하는 모습",
  },
  {
    id: "detail-japanese-other-mid",
    localPath: "/images/detail/japanese/other/mid.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/a-modern-desk-setup-with-laptop-and-books-xjyHDnA93Pk",
    photographer: "LOGAN WEAVER",
    photographerUrl: "https://unsplash.com/@lgnwvr",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "일본어 기타 상세페이지 중간 Visual Break — 책·노트북·헤드폰이 놓인 미니멀한 워크스페이스",
  },

  // 중국어 ---------------------------------------------------------------
  {
    id: "detail-chinese-conversation-hero",
    localPath: "/images/detail/chinese/conversation/hero.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/woman-waving-hello-during-a-video-call-at-desk-s2uH89aClpE",
    photographer: "Vitaly Gariev",
    photographerUrl: "https://unsplash.com/@silverkblack",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "중국어 회화 상세페이지 Hero 비주얼 — 노트북 화상통화 중 인사하며 손 흔드는 모습",
  },
  {
    id: "detail-chinese-conversation-mid",
    localPath: "/images/detail/chinese/conversation/mid.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/man-wearing-headphones-works-on-laptop-at-desk-6OA05PwDzKw",
    photographer: "Vitaly Gariev",
    photographerUrl: "https://unsplash.com/@silverkblack",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "중국어 회화 상세페이지 중간 Visual Break — 헤드폰을 쓰고 노트북으로 학습하는 모습",
  },
  {
    id: "detail-chinese-certification-hero",
    localPath: "/images/detail/chinese/certification/hero.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/woman-wearing-headphones-works-at-desk-with-laptop-IaCvRgokDBo",
    photographer: "Julio Lopez",
    photographerUrl: "https://unsplash.com/@juliolopez",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "중국어 자격증(HSK 등) 상세페이지 Hero 비주얼 — 헤드폰을 쓰고 집중해서 학습하는 모습",
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
    sourceUrl: "https://unsplash.com/photos/a-young-girl-sitting-at-a-desk-PCJO0G686OE",
    photographer: "Keisha Kim",
    photographerUrl: "https://unsplash.com/@keishakim",
    attributionRequired: false,
    license: "Unsplash License",
    // 이전 사진은 성인 학습자 느낌이 강해, 교복 스타일 셔츠를 입은 학생이 혼자
    // 책을 보는 사진으로 교체(2026-09-04) — 한국 중·고등학생의 내신 대비 맥락에 더 가깝게.
    usage: "중국어 내신 상세페이지 Hero 비주얼 — 교복 차림의 학생이 혼자 책상에서 책을 보며 공부하는 모습",
  },
  {
    id: "detail-chinese-school-mid",
    localPath: "/images/detail/chinese/school/mid.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/open-notebook-with-pen-and-pencils-on-desk-n9AaeihA9HI",
    photographer: "Clay Banks",
    photographerUrl: "https://unsplash.com/@claybanks",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "중국어 내신 상세페이지 중간 Visual Break — 펼쳐진 빈 노트와 펜·연필이 놓인 책상",
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
    sourceUrl: "https://unsplash.com/photos/hands-typing-on-a-laptop-keyboard-at-a-desk-lMScFOdgRNg",
    photographer: "Vitaly Gariev",
    photographerUrl: "https://unsplash.com/@silverkblack",
    attributionRequired: false,
    license: "Unsplash License",
    usage: "중국어 기타 상세페이지 중간 Visual Break — 노트북 키보드로 실무를 준비하는 모습",
  },
];

export function getImageCredit(id: string): ImageCredit | null {
  return imageCredits.find((credit) => credit.id === id) ?? null;
}
