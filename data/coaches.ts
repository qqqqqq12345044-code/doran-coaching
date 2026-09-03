import type { LanguageSlug } from "./languages";

// NOTE: 아래 코치 정보는 실제 인물 데이터가 아닌 더미(Dummy) 데이터입니다.
// 추후 실제 코치 프로필 API 또는 CMS 데이터로 교체될 예정입니다.
export interface Coach {
  id: string;
  language: LanguageSlug;
  role: string;
  specialties: string[];
  bio: string;
}

export const coaches: Coach[] = [
  {
    id: "coach-en-01",
    language: "english",
    role: "영어 전문 코치",
    specialties: ["내신", "회화"],
    bio: "학생의 눈높이에서 문법과 회화를 함께 잡아주는 코칭을 진행합니다.",
  },
  {
    id: "coach-en-02",
    language: "english",
    role: "영어 전문 코치",
    specialties: ["비즈니스", "OPIc"],
    bio: "실무와 시험, 두 마리 토끼를 함께 준비할 수 있도록 돕습니다.",
  },
  {
    id: "coach-en-03",
    language: "english",
    role: "영어 전문 코치",
    specialties: ["왕초보", "TOEIC"],
    bio: "기초부터 차근차근, 부담 없이 시작할 수 있도록 안내합니다.",
  },
  {
    id: "coach-jp-01",
    language: "japanese",
    role: "일본어 전문 코치",
    specialties: ["JLPT", "회화"],
    bio: "왕초보도 부담 없이 시작할 수 있는 단계별 커리큘럼을 설계합니다.",
  },
  {
    id: "coach-jp-02",
    language: "japanese",
    role: "일본어 전문 코치",
    specialties: ["유학", "워킹홀리데이"],
    bio: "현지 생활에 필요한 실용 회화 위주로 수업을 이끌어갑니다.",
  },
  {
    id: "coach-jp-03",
    language: "japanese",
    role: "일본어 전문 코치",
    specialties: ["JLPT N1", "비즈니스"],
    bio: "고급 표현과 비즈니스 회화까지 세심하게 지도합니다.",
  },
  {
    id: "coach-cn-01",
    language: "chinese",
    role: "중국어 전문 코치",
    specialties: ["HSK", "회화"],
    bio: "정확한 발음과 성조 교정을 바탕으로 실전 회화까지 이끌어줍니다.",
  },
  {
    id: "coach-cn-02",
    language: "chinese",
    role: "중국어 전문 코치",
    specialties: ["비즈니스", "HSK 5~6급"],
    bio: "업무 상황에 바로 쓸 수 있는 실무 표현을 함께 준비합니다.",
  },
  {
    id: "coach-cn-03",
    language: "chinese",
    role: "중국어 전문 코치",
    specialties: ["왕초보", "병음/성조"],
    bio: "병음과 성조부터 하나씩, 발음의 기초를 탄탄히 잡아줍니다.",
  },
];

export function getCoachesByLanguage(language: LanguageSlug): Coach[] {
  return coaches.filter((coach) => coach.language === language);
}
