// 상담폼 연락처 검증 시나리오. 실행: npm run validate:consultation-phone (네트워크/Sheet 접근 없음)
// 1) lib/consultationPhone.ts 정규화·판정  2) Apps Script(consultation.gs) validate가 같은 결론인지(vm으로 실행)
import fs from "node:fs";
import vm from "node:vm";
import { CONSULTATION_PHONE_ERROR, isValidConsultationPhone, normalizeConsultationPhone } from "../lib/consultationPhone.ts";

const PASS_CASES = ["01012345678", "010-1234-5678", "010 1234 5678", " 010-1234-5678 "];
const FAIL_CASES: unknown[] = [
  "010",
  "010-123",
  "010123456",
  "0101234",
  "0101234567",
  "010123456789",
  "01112345678",
  "016-123-4567",
  "abc",
  "010abc12345678",
  "+82 10-1234-5678",
  "",
  "   ",
  null,
  undefined,
];

let failures = 0;
function check(label: string, ok: boolean) {
  if (!ok) {
    failures += 1;
    console.log(`FAIL ${label}`);
  }
}

for (const value of PASS_CASES) {
  check(`helper accept ${JSON.stringify(value)}`, normalizeConsultationPhone(value) === "01012345678");
}
for (const value of FAIL_CASES) {
  check(`helper reject ${JSON.stringify(value)}`, !isValidConsultationPhone(value) && normalizeConsultationPhone(value) === null);
}

// Apps Script는 전역 함수 선언 파일이라 vm에서 그대로 평가할 수 있다(SpreadsheetApp 등은 호출하지 않음).
const gsPath = new URL("./google-apps-script/consultation.gs", import.meta.url);
const sandbox: Record<string, unknown> = {};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(gsPath, "utf8"), sandbox);
const gsValidate = sandbox.validate as (data: Record<string, unknown>) => string | null;
const base = { name: "테스트", age: "25", address: "서울", privacyConsent: true };

for (const value of PASS_CASES) {
  check(`gs accept ${JSON.stringify(value)}`, gsValidate({ ...base, phone: value }) === null);
}
for (const value of FAIL_CASES) {
  const result = gsValidate({ ...base, phone: value });
  check(`gs reject ${JSON.stringify(value)}`, typeof result === "string" && result.length > 0);
}
check("gs 오류 문구 = helper 문구", gsValidate({ ...base, phone: "010" }) === CONSULTATION_PHONE_ERROR);
// 전화번호 외 기존 검증 순서가 바뀌지 않았는지(이름 누락이 먼저).
check("gs 이름 검증 우선", gsValidate({ ...base, name: "", phone: "010" }) === "이름을 입력해주세요.");

const total = (PASS_CASES.length + FAIL_CASES.length) * 2 + 2;
console.log(`consultation phone: ${total - failures}/${total} ${failures === 0 ? "PASS" : "FAIL"}`);
if (failures > 0) process.exit(1);
