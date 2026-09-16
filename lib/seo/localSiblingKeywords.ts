import { getClustersByLanguage, type SeoKeywordCluster } from "../../data/seo/keywords.ts";
import { CORE_LOCAL_KEYWORDS } from "../../data/seo/publishBatches.ts";

// Local 리프 페이지("이 지역에서 더 둘러보기")가 같은 지역의 다른 keyword로
// 보내는 링크 2개를 고른다. 예전에는 getClustersByLanguage() 선언 순서에서
// 그대로 앞 2개만 자르는 방식(.slice(0, 2))이었는데, 그 결과 회화/과외는
// 서로 4곳에서 inbound를 받는 반면 시험(토익/오픽/JLPT/HSK/HSKK)과
// 워홀일본어는 어느 keyword에서도 링크를 받지 못했다(scripts/qa/
// sibling-link-audit.mts로 97,905 전수 조합에 항상 동일하게 적용되는 문제임을
// 확인 — 지역과 무관하게 keyword 조합만으로 결정되는 구조적 결함).
//
// 여기서는 CORE_LOCAL_KEYWORDS 15개를 intent 기준으로 두 그룹으로 나눈다.
//   - general: conversation/tutoring/online(언어당 3개, "온라인 1:1 코칭"이라는
//     같은 서비스를 가리켜 서로 과도하게 얽히기 쉬운 그룹)
//   - special: exam 또는 workingholiday(언어당 2개, 검색 intent가 뚜렷한 그룹)
// general끼리는 인접한 1곳으로만 순환 연결(양방향 상호 연결 지양)하고,
// 나머지 한 자리는 항상 special로 보낸다. special은 서로 교차 연결하고,
// 나머지 한 자리는 항상 conversation(가장 보편적인 진입 keyword)으로 보낸다.
// 결과적으로 15개 keyword 전부가 최소 1개 이상의 inbound를 받는다(재검증:
// scripts/qa/sibling-link-audit.mts).
const GENERAL_INTENTS = new Set(["conversation", "tutoring", "online"]);

export function getLocalSiblingKeywords(cluster: SeoKeywordCluster): string[] {
  const coreClusters = getClustersByLanguage(cluster.language).filter((c) =>
    CORE_LOCAL_KEYWORDS.includes(c.mainKeyword)
  );
  const general = coreClusters.filter((c) => GENERAL_INTENTS.has(c.intent));
  const special = coreClusters.filter((c) => !GENERAL_INTENTS.has(c.intent));

  const generalIndex = general.findIndex((c) => c.id === cluster.id);
  if (generalIndex >= 0) {
    const generalSibling = general.length > 1 ? general[(generalIndex + 1) % general.length] : undefined;
    const specialSibling = special.length > 0 ? special[generalIndex % special.length] : undefined;
    return [generalSibling, specialSibling].filter((c): c is SeoKeywordCluster => Boolean(c)).map((c) => c.mainKeyword);
  }

  const specialIndex = special.findIndex((c) => c.id === cluster.id);
  if (specialIndex >= 0) {
    const otherSpecial = special.length > 1 ? special[(specialIndex + 1) % special.length] : undefined;
    const anchorGeneral = general[0];
    return [otherSpecial, anchorGeneral].filter((c): c is SeoKeywordCluster => Boolean(c)).map((c) => c.mainKeyword);
  }

  // cluster가 CORE_LOCAL_KEYWORDS 밖이면(현재 발생하지 않음) 예전 방식으로
  // 안전하게 fallback — 새 조합이 생겨도 페이지가 깨지지 않도록.
  return coreClusters
    .map((c) => c.mainKeyword)
    .filter((keyword) => keyword !== cluster.mainKeyword)
    .slice(0, 2);
}
