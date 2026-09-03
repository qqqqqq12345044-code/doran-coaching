export type LanguageSlug = "english" | "japanese" | "chinese";

export interface CurriculumLevel {
  code: string;
  description: string;
}

export interface LanguageMeta {
  slug: LanguageSlug;
  href: string;
  nameKo: string;
  nameNative: string;
  nativeFontClass: string;
  colorVar: "english" | "japanese" | "chinese";
  description: string;
  tags: string[];
  cardCta: string;
  hero: {
    lines: string[];
    subtitle: string;
    nativeWord: string;
    nativeWordFontClass: string;
    secondaryCtaLabel: string;
  };
  levels: CurriculumLevel[];
  finalCta: {
    lines: string[];
    subtitle: string;
  };
}

export const languages: LanguageMeta[] = [
  {
    slug: "english",
    href: "/english",
    nameKo: "영어",
    nameNative: "ENGLISH",
    nativeFontClass: "font-sans",
    colorVar: "english",
    description: "기초부터 회화, 내신, 시험까지\n목표에 맞춰 배우는 1:1 영어 코칭",
    tags: ["회화", "내신", "시험", "비즈니스"],
    cardCta: "영어 과외 알아보기",
    hero: {
      lines: ["영어를 배우는 것에서", "영어로 말하는 것까지."],
      subtitle: "기초부터 회화, 내신, 시험까지\n내 수준과 목표에 맞춘 1:1 영어 과외",
      nativeWord: "Speak",
      nativeWordFontClass: "font-sans",
      secondaryCtaLabel: "영어 과정 보기",
    },
    levels: [
      { code: "STARTER", description: "왕초보 / 기초" },
      { code: "BASIC", description: "기초 문법 / 기본 회화" },
      { code: "INTERMEDIATE", description: "자유 회화 / 시험" },
      { code: "ADVANCED", description: "비즈니스 / 고급 표현" },
    ],
    finalCta: {
      lines: ["영어,", "혼자 고민하지 마세요."],
      subtitle: "내 수준과 목표에 맞는 영어 공부를\nDORAN에서 시작해보세요.",
    },
  },
  {
    slug: "japanese",
    href: "/japanese",
    nameKo: "일본어",
    nameNative: "日本語",
    nativeFontClass: "font-serif-jp",
    colorVar: "japanese",
    description: "왕초보부터 JLPT, 회화까지\n나에게 맞는 일본어 코칭",
    tags: ["왕초보", "회화", "JLPT", "유학/워홀"],
    cardCta: "일본어 과외 알아보기",
    hero: {
      lines: ["일본어,", "좋아하는 것에서 시작해", "실력까지 이어지도록."],
      subtitle: "히라가나부터 회화와 JLPT까지\n목표에 맞춰 배우는 1:1 일본어 과외",
      nativeWord: "話してみよう",
      nativeWordFontClass: "font-serif-jp",
      secondaryCtaLabel: "일본어 과정 보기",
    },
    levels: [
      { code: "입문", description: "히라가나 / 가타카나 / 인사" },
      { code: "초급", description: "기초 문형 / 일상 회화" },
      { code: "중급", description: "JLPT N3~N2 / 자유 회화" },
      { code: "고급", description: "JLPT N1 / 비즈니스 / 고급 회화" },
    ],
    finalCta: {
      lines: ["처음 배우는 일본어도", "한마디부터 시작하면 됩니다."],
      subtitle: "내 속도에 맞는 일본어를\nDORAN에서 시작해보세요.",
    },
  },
  {
    slug: "chinese",
    href: "/chinese",
    nameKo: "중국어",
    nameNative: "中文",
    nativeFontClass: "font-serif-sc",
    colorVar: "chinese",
    description: "병음과 성조부터 HSK까지\n차근차근 배우는 중국어 코칭",
    tags: ["기초", "회화", "HSK", "비즈니스"],
    cardCta: "중국어 과외 알아보기",
    hero: {
      lines: ["성조부터 HSK까지,", "중국어도 1:1로."],
      subtitle: "병음과 성조부터 회화, HSK까지\n기초부터 배우는 1:1 중국어 과외",
      nativeWord: "一起学中文",
      nativeWordFontClass: "font-serif-sc",
      secondaryCtaLabel: "중국어 과정 보기",
    },
    levels: [
      { code: "입문", description: "병음 / 성조" },
      { code: "초급", description: "기초 문장 / 생활 회화" },
      { code: "중급", description: "HSK / 자유 회화" },
      { code: "고급", description: "HSK 5~6급 / 비즈니스" },
    ],
    finalCta: {
      lines: ["중국어의 첫 발음부터", "목표까지."],
      subtitle: "내 수준에 맞는 중국어 수업을\nDORAN에서 시작해보세요.",
    },
  },
];

export function getLanguageBySlug(slug: LanguageSlug): LanguageMeta {
  const found = languages.find((lang) => lang.slug === slug);
  if (!found) {
    throw new Error(`Unknown language slug: ${slug}`);
  }
  return found;
}
