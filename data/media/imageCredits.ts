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
    sourceUrl: "https://unsplash.com/photos/woman-using-black-laptop-computer-near-turned-on-flat-screen-computer-monitor-5ZnS3wK6sUg",
    photographer: "Mimi Thian",
    photographerUrl: "https://unsplash.com/@mimithian",
    attributionRequired: false,
    license: "Unsplash License",
    // 1차 교체(그룹+독일어 텍스트 제거)로도 서구권 외모가 뚜렷한 인물이
    // 남아있어, 동아시아 인물이 혼자 업무에 집중하는 사진으로 재교체(2026-09-04).
    usage: "일본어 페이지 Curriculum 영역 Supporting 비주얼 — 사무실에서 혼자 집중해서 업무를 처리하는 모습",
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
    sourceUrl: "https://unsplash.com/photos/macbook-on-womans-lap-i5cd_SlY8XY",
    photographer: "Mimi Thian",
    photographerUrl: "https://unsplash.com/@mimithian",
    attributionRequired: false,
    license: "Unsplash License",
    // 이전 사진은 서구권 외모가 뚜렷한 인물이라 일본어 페이지 정체성과 맞지
    // 않아 동아시아 인물 사진으로 교체(2026-09-04).
    usage: "일본어 회화 상세페이지 중간 Visual Break — 노트북으로 편안하게 학습하는 모습",
  },
  {
    id: "detail-japanese-certification-hero",
    localPath: "/images/detail/japanese/certification/hero.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/a-pair-of-headphones-on-a-desk-h0mhW7Wv-I0",
    photographer: "Amr Taha™",
    photographerUrl: "https://unsplash.com/@amr_taha",
    attributionRequired: false,
    license: "Unsplash License",
    // 이전 사진은 인종이 모호해 일본어 문맥을 분명히 하기 어려워, 인물 없이
    // 헤드폰·노트·키보드만 보이는 중립적인 학습 도구 사진으로 교체(2026-09-04).
    usage: "일본어 자격증(JLPT·JPT) 상세페이지 Hero 비주얼 — 헤드폰과 노트, 키보드가 놓인 학습 책상",
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
    sourceUrl: "https://unsplash.com/photos/woman-reading-book-sitting-on-chair-in-room-i5nMmbr8JYg",
    photographer: "sean Kong",
    photographerUrl: "https://unsplash.com/@seankkkkkkkkkkkkkk",
    attributionRequired: false,
    license: "Unsplash License",
    // 이전 사진은 서구권 외모의 성인 여성이라 일본어 내신 맥락과 맞지 않아,
    // 동아시아 학생이 빈 교실에서 혼자 책을 보는 사진으로 교체(2026-09-04).
    usage: "일본어 내신 상세페이지 Hero 비주얼 — 빈 교실에서 혼자 책을 보는 학생",
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
    sourceUrl: "https://unsplash.com/photos/young-man-typing-on-laptop-in-a-modern-office-KYlqBrKQ-i4",
    photographer: "Gorilla ROI Data Connector",
    photographerUrl: "https://unsplash.com/@gorillaroi",
    attributionRequired: false,
    license: "Unsplash License",
    // 이전 사진은 서구권 외모가 뚜렷한 인물이라 일본 유학·취업·비즈니스
    // 맥락과 맞지 않아, 동아시아 남성이 사무실에서 혼자 업무 중인 사진으로
    // 교체(2026-09-04). chinese/conversation/hero.jpg와 동일 인물이던 이전
    // 사진의 중복 문제도 함께 해소됨.
    usage: "일본어 기타(유학·취업·비즈니스) 상세페이지 Hero 비주얼 — 사무실에서 혼자 집중해서 노트북으로 업무를 처리하는 모습",
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
    sourceUrl: "https://unsplash.com/photos/hands-typing-on-a-laptop-computer-keyboard-AnB0zwEeuYU",
    photographer: "Vitaly Gariev",
    photographerUrl: "https://unsplash.com/@silverkblack",
    attributionRequired: false,
    license: "Unsplash License",
    // 이전 사진은 서구권 외모의 인물이 얼굴 중심으로 나와 교체(2026-09-04).
    // 얼굴 없이 손+노트북 클로즈업으로 인물 국적을 특정하지 않는 사진으로 대체.
    usage: "중국어 회화 상세페이지 Hero 비주얼 — 노트북으로 온라인 대화를 준비하는 손 클로즈업",
  },
  {
    id: "detail-chinese-conversation-mid",
    localPath: "/images/detail/chinese/conversation/mid.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/close-up-of-a-hand-typing-on-a-computer-keyboard-Qh1degtlisQ",
    photographer: "Alicia Christin Gerald",
    photographerUrl: "https://unsplash.com/@allysphotos",
    attributionRequired: false,
    license: "Unsplash License",
    // 이전 사진은 서구권 외모의 인물이 얼굴 중심으로 나와 교체(2026-09-04).
    usage: "중국어 회화 상세페이지 중간 Visual Break — 키보드를 치는 손 클로즈업",
  },
  {
    id: "detail-chinese-certification-hero",
    localPath: "/images/detail/chinese/certification/hero.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/a-desk-with-a-notebook-headphones-and-a-potted-plant-T7yUACjd3hU",
    photographer: "Kelly Sikkema",
    photographerUrl: "https://unsplash.com/@kellysikkema",
    attributionRequired: false,
    license: "Unsplash License",
    // 이전 사진(Julio Lopez)이 japanese-certification-hero와 인종/구도가 유사해 헷갈릴
    // 수 있어, 인물 없는 헤드폰+노트 flatlay로 교체(2026-09-04).
    usage: "중국어 자격증(HSK 등) 상세페이지 Hero 비주얼 — 헤드폰과 노트가 놓인 창가 책상",
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
    sourceUrl: "https://unsplash.com/photos/man-signing-a-document-with-a-pen-QI6NLgN5XnM",
    photographer: "Jakub Żerdzicki",
    photographerUrl: "https://unsplash.com/@jakubzerdzicki",
    attributionRequired: false,
    license: "Unsplash License",
    // 이전 사진은 금발의 서구권 외모 여성이 얼굴 중심으로 나와 교체(2026-09-04).
    // 얼굴 없이 서류에 서명하는 손 클로즈업으로 대체.
    usage: "중국어 기타(유학·취업·무역) 상세페이지 Hero 비주얼 — 서류에 서명하는 손 클로즈업",
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
