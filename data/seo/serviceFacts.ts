import { brand } from "../brand.ts";
import { languages } from "../languages.ts";

// 생성형 AI(GEO)와 콘텐츠 생성 엔진이 공통으로 참조하는 "사실 소스".
// 새로운 정보를 여기서 만들지 않고, 기존 data/brand.ts / data/languages.ts 를
// 그대로 재사용한다. 존재하지 않는 상품/조건(예: 오프라인 지점, 보장성 문구,
// 근거 없는 수치)은 이 파일에도, 이 파일을 사용하는 어떤 생성기에도 추가하지 않는다.
export const serviceFacts = {
  brandNameKo: brand.nameKo,
  brandNameEn: brand.nameEn,
  brandLabel: brand.brandLabel,

  /** 실제 지원 언어. data/languages.ts 순서를 그대로 따른다. */
  supportedLanguages: languages.map((lang) => lang.nameKo),

  /** 수업 형태 사실. 새 문구를 지어내지 않고 실제 서비스 조건만 나열한다. */
  classFormat: "1:1",
  deliveryMethod: "온라인 화상 수업",
  matchingMethod: "상담을 통해 학습 목표와 현재 수준을 확인한 뒤 맞는 강사를 매칭",

  /** 실제로 존재하는 학습 목적 축. data/seo/keywords.ts의 intent와 대응된다. */
  availableGoals: [
    "회화",
    "시험/자격증 대비",
    "비즈니스",
    "학교 내신",
    "유학/워킹홀리데이 준비",
  ],

  /** 오프라인 지점이 없는 화상 서비스라는 사실. 지역 표현 규칙(offline 오해 방지)의 근거. */
  hasPhysicalBranch: false,
} as const;

export type ServiceFacts = typeof serviceFacts;
