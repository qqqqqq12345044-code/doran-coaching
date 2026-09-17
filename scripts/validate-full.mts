// Route/Metadata/Data Engine/Architecture 변경 시 검증 — CLAUDE.md [검증]의
// "npx tsc --noEmit + npm run build" 기준에 기존 4개 validator를 더한 것.
// validate:local-seo는 97,905개 조합 전수 검사라 느리다 — 배포 전
// 체크포인트에서만 돌리고, 작은 수정마다 반복하지 않는다(CLAUDE.md [작업 효율]).
import { execSync } from "child_process";
import { writeCacheEntry } from "./lib/validation-cache.mts";

function run(label: string, cmd: string): boolean {
  try {
    execSync(cmd, { stdio: "inherit" });
    console.log(`${label}: PASS`);
    return true;
  } catch {
    console.log(`${label}: FAIL`);
    return false;
  }
}

const typecheck = run("Typecheck", "npx tsc --noEmit");
const build = run("Build", "npm run build");
const seo = run("SEO keywords", "npm run validate:seo");
const curriculum = run("Curriculum", "npm run validate:curriculum");
const detailContent = run("Detail content", "npm run validate:detail-content");
const localSeo = run("Local SEO (97,905)", "npm run validate:local-seo");

const pass = typecheck && build && seo && curriculum && detailContent && localSeo;
writeCacheEntry("full", pass, {
  typecheck: typecheck ? "PASS" : "FAIL",
  build: build ? "PASS" : "FAIL",
  seo: seo ? "PASS" : "FAIL",
  curriculum: curriculum ? "PASS" : "FAIL",
  detailContent: detailContent ? "PASS" : "FAIL",
  localSeo: localSeo ? "PASS" : "FAIL",
});

console.log(`\n종합: ${pass ? "PASS" : "FAIL"}`);
if (!pass) process.exit(1);
