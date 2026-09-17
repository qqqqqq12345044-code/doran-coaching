// Fast pre-commit check for small UI/CSS/문구 수정 — CLAUDE.md [검증]의
// "작은 UI/CSS 수정: npx tsc --noEmit" 기준을 그대로 스크립트화한 것.
// Route/Metadata/Data Engine/Architecture 변경에는 validate:full을 쓴다.
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

const pass = typecheck;
writeCacheEntry("quick", pass, {
  typecheck: typecheck ? "PASS" : "FAIL",
});

console.log(`\n종합: ${pass ? "PASS" : "FAIL"}`);
if (!pass) process.exit(1);
