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
    sourceUrl: "https://unsplash.com/photos/U3Ptj3jafX8",
    photographer: "Waldemar Brandt",
    photographerUrl: "https://unsplash.com/@waldemarbrandt67w",
    attributionRequired: false,
    license: "Unsplash License",
    // 이전 사진(노트북을 함께 보는 두 사람)은 영어 학습이라는 맥락이 이미지에서
    // 바로 읽히지 않고 generic한 카페/코워킹 느낌이 강해 교체(2026-09-10) —
    // 영어 단어 뜻이 펼쳐진 사전과 영국 지도가 함께 보이는 사진으로, "영어"라는
    // 점과 학습 교재라는 점이 텍스트로 바로 확인된다. 1:1 서비스와 맞지 않는
    // 다인 그룹 이미지도 아니다.
    usage: "영어 페이지 Curriculum 영역 Supporting 비주얼 — 영어 사전과 영국 지도가 펼쳐진 모습",
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
    sourceUrl: "https://unsplash.com/photos/jfZfdQtcH6k",
    photographer: "Danis Lou",
    photographerUrl: "https://unsplash.com/@danislou",
    attributionRequired: false,
    license: "Unsplash License",
    // 이전 사진(사무실에서 코드 화면을 보는 인물)은 일본어와 전혀 무관한
    // 개발자 업무 장면으로 읽혀 교체(2026-09-10) — 도쿄의 실제 식당 앞,
    // 노렌과 메뉴판에 일본어 글씨가 그대로 보이는 사진으로 "실생활에서 통하는
    // 일본어"라는 배너 문구와 바로 연결된다.
    usage: "일본어 페이지 Curriculum 영역 Supporting 비주얼 — 도쿄 식당 앞 노렌과 메뉴판에 쓰인 일본어",
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
    sourceUrl: "https://unsplash.com/photos/two-women-sitting-beside-table-and-talking-LQ1t-8Ms5PY",
    photographer: "Christina @ wocintechchat.com",
    photographerUrl: "https://unsplash.com/@wocintechchat",
    attributionRequired: false,
    license: "Unsplash License",
    // 이전 사진(노트북 화상통화 + 배경 포스트잇 벽)은 회화보다 사무실 브레인스토밍
    // 느낌이 강해 교체(2026-09-09) — 창가 테이블에서 두 사람이 실제로 마주 보고
    // 대화하는 사진으로, 노트북 없이 1:1 소통 장면을 보여준다.
    usage: "영어 회화 상세페이지 중간 Visual Break — 창가 테이블에서 두 사람이 마주 앉아 대화하는 모습",
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
    sourceUrl: "https://unsplash.com/photos/pencil-on-multiple-choice-answer-sheet-cbEvoHbJnIE",
    photographer: "Nguyen Dang Hoang Nhu",
    photographerUrl: "https://unsplash.com/@nguyendhn",
    attributionRequired: false,
    license: "Unsplash License",
    // 이전 사진(빈 노트+펜·연필)은 "자격증 시험 대비"라는 페이지 목적이 이미지에서
    // 바로 읽히지 않아, TOEIC/TOEIC Bridge/JPT 등이 표기된 연필과 OMR 답안지
    // 사진으로 교체(2026-09-09).
    usage: "영어 자격증 상세페이지 중간 Visual Break — TOEIC·JPT 표기가 있는 연필과 OMR 답안지",
  },
  {
    id: "detail-english-school-hero",
    localPath: "/images/detail/english/school/hero.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/r2WhdAwJPxM",
    photographer: "sean Kong",
    photographerUrl: "https://unsplash.com/@seankkkkkkkkkkkkkk",
    attributionRequired: false,
    license: "Unsplash License",
    // 이전 사진은 "노트북 작업" 느낌이 강해 영어 내신(학교 시험) 맥락이 잘
    // 드러나지 않아, 교실에서 혼자 책을 보며 생각에 잠긴 학생 사진으로
    // 교체(2026-09-07) — 일본어 내신 페이지와 같은 촬영자의 다른 사진이지만
    // 파일 자체는 서로 다르다.
    usage: "영어 내신 상세페이지 Hero 비주얼 — 교실 책상에서 책을 펼쳐두고 생각에 잠긴 학생",
  },
  {
    id: "detail-english-school-mid",
    localPath: "/images/detail/english/school/mid.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/student-writing-at-classroom-desk--hgJu2ykh4E",
    photographer: "Jeswin Thomas",
    photographerUrl: "https://unsplash.com/@jeswinthomas",
    attributionRequired: false,
    license: "Unsplash License",
    // 이전 사진(노트·연필·안경 flatlay)은 "학교 내신 시험 대비"라는 맥락이
    // 드러나지 않아, 빈 교실 책상에서 혼자 시험지를 푸는 학생 사진으로
    // 교체(2026-09-09) — 노트북 없음, 그룹 수업 장면 아님.
    usage: "영어 내신 상세페이지 중간 Visual Break — 빈 교실 책상에서 혼자 필기하며 시험을 준비하는 학생",
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
    sourceUrl: "https://unsplash.com/photos/four-green-passports-Hid-yhommOg",
    photographer: "Jon Tyson",
    photographerUrl: "https://unsplash.com/@jontyson",
    attributionRequired: false,
    license: "Unsplash License",
    // 이전 사진(코드 에디터처럼 보이는 화면+손 클로즈업)은 유학·취업·비즈니스 목적이
    // 전혀 읽히지 않고 개발자 화면처럼 오인될 수 있어, 여권 여러 개가 쌓인 사진으로
    // 교체(2026-09-09) — 특정 직군 하나로 좁혀지지 않으면서 "해외로 나가는 준비"를
    // 보편적으로 전달한다.
    usage: "영어 기타 상세페이지 중간 Visual Break — 여권 여러 개가 겹쳐 놓인 모습(해외 유학·취업 준비)",
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
    sourceUrl: "https://unsplash.com/photos/Undd5MXipP0",
    photographer: "Antonio Prado",
    photographerUrl: "https://unsplash.com/@antonioprado",
    attributionRequired: false,
    license: "Unsplash License",
    // 이전 사진(노트북을 보는 인물, 일본과 무관한 실내)은 "회화" 페이지 목적이
    // 드러나지 않아 교체(2026-09-10) — 도쿄 이자카야 카운터에서 사람들이 실제로
    // 대화를 나누는 장면으로, 일본 현지 대화 맥락을 자연스럽게 전달한다.
    usage: "일본어 회화 상세페이지 중간 Visual Break — 도쿄 이자카야에서 사람들이 대화를 나누는 모습",
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
    sourceUrl: "https://unsplash.com/photos/UyVbyimlAgE",
    photographer: "Hiroshi Tsubono",
    photographerUrl: "https://unsplash.com/@hiro7jp",
    attributionRequired: false,
    license: "Unsplash License",
    // 이전 사진(펜·노트·안경 flatlay)은 일본어/시험 맥락이 전혀 드러나지 않아
    // 교체(2026-09-10) — 실제 일본어 문장이 인쇄된 책 페이지를 펼친 사진으로,
    // JLPT·JPT 등 읽기 학습 맥락을 자연스럽게 전달한다.
    usage: "일본어 자격증 상세페이지 중간 Visual Break — 일본어 문장이 쓰인 책 페이지를 펼친 모습",
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
    sourceUrl: "https://unsplash.com/photos/a-person-studying-at-a-desk-with-books-QR-XQbUVC1s",
    photographer: "Yanhao Fang",
    photographerUrl: "https://unsplash.com/@alamanga",
    attributionRequired: false,
    license: "Unsplash License",
    // 이전 사진(노트·펜 flatlay)은 "학교 내신/일본어 공부" 맥락이 없어 교체
    // (2026-09-09) — 일본 기후현 타카야마 도서관 창문 너머로 학생 한 명이
    // 혼자 필기하며 공부하는 모습. 일본 전통 목조 창틀이 자연스럽게 현지
    // 맥락을 전달하며, 노트북 없이 1인 학습 장면이다.
    usage: "일본어 내신 상세페이지 중간 Visual Break — 일본 도서관에서 혼자 필기하며 공부하는 학생",
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
    sourceUrl: "https://unsplash.com/photos/wUZjnOv7t0g",
    photographer: "Ryoji Iwata",
    photographerUrl: "https://unsplash.com/@ryoji__iwata",
    attributionRequired: false,
    license: "Unsplash License",
    // 이전 사진(캔들·칵테일북 등 감성 데스크 flatlay)은 일본 유학·취업·비즈니스
    // 목적과 무관하고 브랜드 톤과도 맞지 않아, 정장을 입은 남성이 혼자 횡단보도를
    // 건너는 사진으로 교체(2026-09-09) — 일본 특유의 도심 횡단보도 구도로 일본
    // 현지 취업·비즈니스 맥락을 자연스럽게 전달하며, 그룹 장면이 아닌 1인 구도.
    usage: "일본어 기타 상세페이지 중간 Visual Break — 정장을 입은 남성이 혼자 횡단보도를 건너는 모습(일본 현지 취업·비즈니스)",
  },

  // 중국어 ---------------------------------------------------------------
  {
    id: "detail-chinese-conversation-hero",
    localPath: "/images/detail/chinese/conversation/hero.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/746eIIJLw5E",
    photographer: "Rendy Novantino",
    photographerUrl: "https://unsplash.com/@novantino",
    attributionRequired: false,
    license: "Unsplash License",
    // 이전 사진(노트북 타이핑 손 클로즈업)은 "회화"라는 페이지 목적이 바로
    // 읽히지 않아, 중국풍 홍등이 있는 카페에서 실제로 대화를 나누는 두 사람
    // 사진으로 교체(2026-09-07) — 노트북/사무 이미지를 피하면서도 여행
    // 홍보컷처럼 과하지 않은, 회화가 실제로 쓰이는 상황을 보여준다.
    usage: "중국어 회화 상세페이지 Hero 비주얼 — 중국풍 카페에서 마주 앉아 대화를 나누는 두 사람",
  },
  {
    id: "detail-chinese-conversation-mid",
    localPath: "/images/detail/chinese/conversation/mid.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/two-men-sitting-at-a-table-talking-ZvzfXlZUwIc",
    photographer: "Alex Safareli",
    photographerUrl: "https://unsplash.com/@alexsafareli",
    attributionRequired: false,
    license: "Unsplash License",
    // 키보드 타이핑 손 클로즈업은 "회화(대화)" 페이지 목적과 정반대로 읽혀
    // (타이핑=업무, 대화 아님) 교체(2026-09-09) — 홍콩 골목 노포에서 두 사람이
    // 실제로 마주 앉아 대화하는 사진으로, 관광 홍보컷이 아닌 현지 생활 속
    // 대화 장면을 보여준다.
    usage: "중국어 회화 상세페이지 중간 Visual Break — 홍콩 골목 노포에서 두 사람이 마주 앉아 대화하는 모습",
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
    sourceUrl: "https://unsplash.com/photos/ct58n7B6WbI",
    photographer: "Cherry Lin",
    photographerUrl: "https://unsplash.com/@cherrybbybomb",
    attributionRequired: false,
    license: "Unsplash License",
    // 이전 사진(붓글씨 시 족자)은 완성된 예술 작품처럼 보여 "시험 준비"라는
    // 맥락이 드러나지 않아 교체(2026-09-10) — 원고지에 한자를 반복해서 연습해
    // 쓴 종이로, 실제 학습/연습 중인 모습을 더 직접적으로 보여준다.
    usage: "중국어 자격증 상세페이지 중간 Visual Break — 원고지에 한자를 반복해서 연습한 종이",
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
    sourceUrl: "https://unsplash.com/photos/-qvF0aMnhwU",
    photographer: "Maccy",
    photographerUrl: "https://unsplash.com/@jizhidexiaohailang",
    attributionRequired: false,
    license: "Unsplash License",
    // 이전 사진(안경·펜·노트북 flatlay)은 중국어/학생 맥락이 드러나지 않아
    // 교체(2026-09-10) — 줄 노트에 한자를 손으로 또박또박 눌러 쓴 실제 필기
    // 사진으로, 중국어 내신을 공부하는 학생의 노트 느낌을 직접적으로 전달한다.
    usage: "중국어 내신 상세페이지 중간 Visual Break — 줄 노트에 한자를 손으로 눌러 쓴 필기",
  },
  {
    id: "detail-chinese-other-hero",
    localPath: "/images/detail/chinese/other/hero.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/person-looking-up-to-the-flight-schedules-jbQvJx2EWnU",
    photographer: "Erik Odiin",
    photographerUrl: "https://unsplash.com/@odiin",
    attributionRequired: false,
    license: "Unsplash License",
    // 이전 사진(서류 서명 손 클로즈업)은 유학·취업·무역이라는 페이지 목적이
    // 바로 읽히지 않아, 출국 전 항공편 안내판을 확인하는 여행객 사진으로
    // 교체(2026-09-04). 배경에 다른 여행객이 흐릿하게 보이나 단체 수업/회의
    // 장면이 아닌 공항의 자연스러운 배경 인파.
    usage: "중국어 기타(유학·취업·무역) 상세페이지 Hero 비주얼 — 공항에서 항공편 안내판을 확인하는 여행객",
  },
  {
    id: "detail-chinese-other-mid",
    localPath: "/images/detail/chinese/other/mid.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/shipping-port-with-containers-and-cranes-sWOvgOOFk1g",
    photographer: "Timelab",
    photographerUrl: "https://unsplash.com/@timelabpro",
    attributionRequired: false,
    license: "Unsplash License",
    // 홍콩 컨테이너 항구 야경. 이전 사진(노트북 키보드 타이핑)은 무역·실무
    // 맥락이 약해, 무역/물류를 직관적으로 연상시키는 사진으로 교체(2026-09-04).
    usage: "중국어 기타 상세페이지 중간 Visual Break — 홍콩 컨테이너 항구의 야간 물류 현장",
  },

  // 매거진/후기 허브 페이지 Hero ------------------------------------------
  {
    id: "magazine-hero",
    localPath: "/images/magazine/hero.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/oHoBIbDj7lo",
    photographer: "Glen Carrie",
    photographerUrl: "https://unsplash.com/@glencarrie",
    attributionRequired: false,
    license: "Unsplash License",
    // 특정 언어를 대표하지 않으면서 "단어가 모여 언어가 된다"는 매거진 콘텐츠
    // 허브의 성격을 추상적으로 보여주는 이미지로 선정(2026-09-10).
    usage: "매거진 허브 페이지 Hero 비주얼 — 낱말이 적힌 마그넷 타일 더미",
  },
  {
    id: "reviews-hero",
    localPath: "/images/reviews/hero.jpg",
    source: "unsplash",
    sourceUrl: "https://unsplash.com/photos/tcyW6Im5Uug",
    photographer: "Marcos Paulo Prado",
    photographerUrl: "https://unsplash.com/@marcospradobr",
    attributionRequired: false,
    license: "Unsplash License",
    // 특정 수강생을 지칭하지 않는 손글씨 기록 이미지 — 실제 인물처럼 보이지
    // 않게 손과 노트 위주로 크롭된 사진을 선정(2026-09-10).
    usage: "수강후기 페이지 Hero 비주얼 — 노트에 손글씨로 기록하는 모습",
  },
];

export function getImageCredit(id: string): ImageCredit | null {
  return imageCredits.find((credit) => credit.id === id) ?? null;
}
