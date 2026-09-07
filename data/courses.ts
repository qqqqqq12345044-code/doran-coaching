import type { LanguageSlug } from "./languages";

export interface Course {
  title: string;
}

// Used in the main page "목적이 다르면, 배우는 방법도 달라야 하니까" section.
export const purposeCourses: Course[] = [
  { title: "외국어 입문" },
  { title: "일상 회화" },
  { title: "학교 내신" },
  { title: "자격증/시험" },
  { title: "유학/워킹홀리데이" },
  { title: "비즈니스" },
];

export const coursesByLanguage: Record<LanguageSlug, Course[]> = {
  english: [
    { title: "기초 영어" },
    { title: "영어 회화" },
    { title: "학교 내신" },
    { title: "TOEIC" },
    { title: "OPIc" },
    { title: "시험 대비" },
    { title: "비즈니스 영어" },
    { title: "유학 / 여행 영어" },
  ],
  japanese: [
    { title: "왕초보 일본어" },
    { title: "히라가나 / 가타카나" },
    { title: "일본어 회화" },
    { title: "JLPT N5" },
    { title: "JLPT N4" },
    { title: "JLPT N3" },
    { title: "JLPT N2" },
    { title: "JLPT N1" },
    { title: "학교 내신" },
    { title: "유학 준비" },
    { title: "워킹홀리데이" },
  ],
  chinese: [
    { title: "병음" },
    { title: "성조" },
    { title: "중국어 기초" },
    { title: "중국어 회화" },
    { title: "HSK 1~3급" },
    { title: "HSK 4급" },
    { title: "HSK 5급" },
    { title: "HSK 6급" },
    { title: "학교 내신" },
    { title: "비즈니스 중국어" },
  ],
};
