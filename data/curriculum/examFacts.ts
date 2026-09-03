import type { CurriculumLanguage } from "./powerCurriculum";

// 자격증 시험 "공식 정보" 전용 Fact Layer.
//
// - 여기 담긴 값은 학습 콘텐츠(courseDetails.ts)와 무관하게, 시험 자체에 대한
//   사실 정보(평가 영역/공식 점수·등급 체계/시험 특징)만 다룬다.
// - 모든 값은 2026-09-03 기준으로 사용자가 검증한 VERIFIED FACTS를 그대로 옮긴
//   것이며, 임의의 점수 대응표나 등급 환산표를 추가하지 않는다.
// - courseDetails.ts의 CourseRoadmap(도란 학습단계: 입문/초급/중급/고급 등)과
//   이 파일의 공식 등급은 서로 다른 개념이다. 화면에서도 "OFFICIAL SCALE"과
//   "DORAN LEARNING ROADMAP"으로 시각적으로 분리해 보여준다.
// - roadmapMode: "stages"는 CertificationExplorer가 RoadmapTimeline(순차 단계)으로,
//   "tracks"는 ExamTrackGrid(병렬 트랙 카드)로 렌더링하라는 지시다. 현재 BCT만
//   "tracks"를 사용한다(BCT(A)/BCT(B)/BCT Speaking은 순서를 강제하는 단계가 아니다).

export interface ExamVariant {
  label: string;
  scope: string;
}

export interface ExamFact {
  /** courseDetails.ts의 CourseRoadmap.examId와 일치해야 한다. */
  id: string;
  name: string;
  language: CurriculumLanguage;
  /** 한 줄: 이 시험이 무엇을 평가하는지. */
  summary: string;
  assessmentAreas: string[];
  /** 문항 수/시험 시간/구성 방식 등 간단한 시험 특징(선택). */
  structureNote?: string;
  /** 공식 점수/등급 체계를 한 줄로 압축한 표기(예: "N5 → N4 → N3 → N2 → N1"). */
  officialScale: string;
  /** Duolingo의 CEFR 참고 구간처럼 "공식 참고정보"이되 별도로 구분해 보여줘야 하는 값(선택). */
  cefrReference?: string;
  /** IELTS의 Academic/General, BCT의 A/B/Speaking처럼 시험 안에 유형이 갈리는 경우(선택). */
  variants?: ExamVariant[];
  /** 공식 시험과 도란 학습단계를 혼동하지 않도록 하는 주의 문구(선택이지만 대부분 필요). */
  cautionNote?: string;
  /** 이 정보를 검증한 기준일. */
  verifiedAsOf: string;
  roadmapMode: "stages" | "tracks";
}

export const examFacts: ExamFact[] = [
  {
    id: "toeic",
    name: "TOEIC Listening & Reading",
    language: "english",
    summary: "영어 Listening과 Reading 능력을 평가하는 시험입니다.",
    assessmentAreas: ["Listening", "Reading"],
    structureNote: "Listening 100문항 · Reading 100문항 · 총 200문항",
    officialScale: "Listening 5~495점 · Reading 5~495점 · 총점 10~990점",
    cautionNote:
      "TOEIC 자체에는 입문/초급/중급/고급 같은 공식 등급이 없습니다. 아래 로드맵의 단계명은 도란 학습 편의를 위한 구분입니다.",
    verifiedAsOf: "2026-09-03",
    roadmapMode: "stages",
  },
  {
    id: "opic",
    name: "OPIc (Oral Proficiency Interview-computer)",
    language: "english",
    summary: "Background Survey를 바탕으로 개인 맞춤 문항에 답하는 영어 말하기 평가 시험입니다.",
    assessmentAreas: ["Speaking"],
    structureNote: "Background Survey 기반 개인 맞춤 문항 12~15개 · 시험시간 40분",
    officialScale: "NL → NM → NH → IL → IM1 → IM2 → IM3 → IH → AL",
    cautionNote: "공식 등급(NL~AL)과 도란 학습단계(입문~고급)는 서로 다른 기준입니다.",
    verifiedAsOf: "2026-09-03",
    roadmapMode: "stages",
  },
  {
    id: "ielts",
    name: "IELTS",
    language: "english",
    summary: "Listening, Reading, Writing, Speaking 4개 영역의 영어 능력을 평가하는 시험입니다.",
    assessmentAreas: ["Listening", "Reading", "Writing", "Speaking"],
    structureNote: "Academic / General Training 중 선택 응시",
    officialScale: "Band 1 ~ Band 9 (whole/half band)",
    variants: [
      { label: "Academic", scope: "진학 목적 · Reading/Writing이 학술 지문 중심" },
      { label: "General Training", scope: "이주·취업 목적 · Reading/Writing이 실생활 지문 중심" },
    ],
    cautionNote:
      "Listening·Speaking은 두 유형에서 동일하며 Reading·Writing만 유형별로 다릅니다. 공식 Band와 도란 학습단계를 1:1로 대응시키지 않습니다.",
    verifiedAsOf: "2026-09-03",
    roadmapMode: "stages",
  },
  {
    id: "duolingo",
    name: "Duolingo English Test",
    language: "english",
    summary: "Computer Adaptive(컴퓨터 적응형) 방식으로 Reading, Writing, Listening, Speaking을 종합 평가하는 영어 시험입니다.",
    assessmentAreas: ["Reading", "Writing", "Listening", "Speaking"],
    structureNote: "Computer Adaptive 방식 · 전체 및 영역별 subscore 제공",
    officialScale: "10~160점 (5점 단위)",
    cefrReference: "B1 60~95 · B2 100~125 · C1 130~150 · C2 155~160",
    cautionNote: "CEFR 대응은 공식 참고 정보이며, 도란 학습단계와 자동으로 동일시하지 않습니다.",
    verifiedAsOf: "2026-09-03",
    roadmapMode: "stages",
  },
  {
    id: "jlpt",
    name: "JLPT (일본어능력시험)",
    language: "japanese",
    summary: "일본어 문자·어휘·문법, 독해, 청해 능력을 평가하는 공인 일본어 시험입니다.",
    assessmentAreas: ["문자·어휘·문법", "독해", "청해"],
    officialScale: "N5 → N4 → N3 → N2 → N1",
    cautionNote: "JLPT는 Speaking과 Writing 능력을 직접 평가하지 않습니다.",
    verifiedAsOf: "2026-09-03",
    roadmapMode: "stages",
  },
  {
    id: "jpt",
    name: "JPT (Japanese Proficiency Test)",
    language: "japanese",
    summary: "청해와 독해를 중심으로 실용적인 일본어 능력을 점수로 평가하는 시험입니다.",
    assessmentAreas: ["청해", "독해"],
    structureNote: "청해 100문항 · 독해 100문항 · 총 200문항 · 별도의 합격 급수 없음",
    officialScale: "총점 10~990점 (315 / 460 / 610 / 740 / 880점을 기준으로 한 참고 구간 존재)",
    cautionNote: "JPT는 별도의 합격 급수가 없는 점수제 시험이며, 다른 시험의 급수와 단순 비교하지 않습니다.",
    verifiedAsOf: "2026-09-03",
    roadmapMode: "stages",
  },
  {
    id: "hsk",
    name: "HSK",
    language: "chinese",
    summary: "중국어 어휘와 독해·듣기 이해력을 평가하는 공인 중국어 시험입니다.",
    assessmentAreas: ["어휘", "독해", "청해"],
    officialScale: "1급 → 2급 → 3급 → 4급 → 5급 → 6급 · 고급 7~9급",
    cautionNote:
      "HSK 시험 체계는 현재 개편·시범 운영이 진행 중이며(2026-09-03 기준, 7~9급 체계는 시범 시행 단계), 공식 시행 기준에 맞춰 안내합니다.",
    verifiedAsOf: "2026-09-03",
    roadmapMode: "stages",
  },
  {
    id: "hskk",
    name: "HSKK",
    language: "chinese",
    summary: "중국어 말하기 능력을 평가하는 공인 말하기 시험입니다.",
    assessmentAreas: ["말하기"],
    structureNote: "등급별로 듣고 따라 말하기 · 듣고 답하기 · 질문에 답하기 · 그림 보고 말하기 · 낭독 등으로 구성",
    officialScale: "초급 → 중급 → 고급",
    cautionNote: "HSK(읽기·듣기 중심)와는 별도의 말하기 시험입니다.",
    verifiedAsOf: "2026-09-03",
    roadmapMode: "stages",
  },
  {
    id: "tsc",
    name: "TSC (Test of Spoken Chinese)",
    language: "chinese",
    summary: "중국어 말하기 수행 능력을 종합적으로 평가하는 시험입니다.",
    assessmentAreas: ["문법", "어휘", "발음", "유창성", "전체 말하기 수행"],
    structureNote: "총 7개 Part · 26문항(자기소개 → 그림 보고 답하기 → 대화 완성 → 화제 설명 → 의견 제시 → 상황 대응 → 스토리 구성)",
    officialScale: "Level 1 ~ Level 10",
    cautionNote: "Level 구간을 임의로 입문/초급 등으로 묶어 표시하지 않습니다.",
    verifiedAsOf: "2026-09-03",
    roadmapMode: "stages",
  },
  {
    id: "bct",
    name: "BCT (Business Chinese Test)",
    language: "chinese",
    summary: "비즈니스 상황에서 필요한 중국어 능력을 평가하는 시험입니다.",
    assessmentAreas: ["Listening", "Reading", "Writing"],
    officialScale: "BCT(A)/BCT(B) 각 총점 300점 · BCT Speaking은 별도 평가",
    variants: [
      { label: "BCT(A)", scope: "초급 학습자 중심 · 일상 및 기본 비즈니스 상황 · Listening/Reading/Writing · 총점 300" },
      { label: "BCT(B)", scope: "중·고급 학습자 중심 · 복잡한 비즈니스 상황 · Listening/Reading/Writing · 총점 300" },
      { label: "BCT Speaking", scope: "별도 말하기 시험 · 비즈니스 상황의 중국어 구술 능력 평가" },
    ],
    cautionNote: "BCT(A) → BCT(B) → BCT Speaking을 반드시 순서대로 응시해야 하는 것은 아닙니다.",
    verifiedAsOf: "2026-09-03",
    roadmapMode: "tracks",
  },
];

export function getExamFact(examId: string): ExamFact | null {
  return examFacts.find((fact) => fact.id === examId) ?? null;
}
