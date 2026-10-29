/**
 * DORAN Lead/전화 클릭/통화 "비식별 이벤트" 저장용 Apps Script (lib/leads/store.ts createHttpLeadStore 프로토콜).
 *
 * 상담 신청 원본(consultation.gs, 이름/연락처/주소/문의 내용)과는 **별도의 새 Spreadsheet + 새 Apps Script
 * 프로젝트**로 배포한다. 같은 시트/같은 스크립트에 합치지 않는다(PII 저장소와 분석 이벤트 저장소 분리).
 * 이 저장소에는 이름·연락처·주소·상담 내용·transcript·발신번호가 들어오지 않는다(서버가 보내지 않음).
 *
 * 설정:
 *  1) 새 Google Spreadsheet 생성 → 확장 프로그램 > Apps Script → 이 파일 전체 붙여넣기
 *  2) 프로젝트 설정 > 스크립트 속성: LEAD_STORE_TOKEN = (24자 이상 랜덤 문자열, Vercel env와 같은 값)
 *  3) 배포 > 새 배포 > 웹 앱: 실행 사용자 "나", 액세스 "모든 사용자" → /exec URL을 Vercel env LEAD_STORE_URL로
 *  token은 코드/Git에 넣지 않는다(스크립트 속성에만).
 *
 * 요청: POST(text/plain) JSON { token, op, ... }   응답: JSON { ok: true, ... } | { ok: false }
 *  - append { kind: "click"|"call"|"lead", id, project, at, record }  (같은 kind+id는 한 번만 저장)
 *  - list   { kind, project?, since }  → { items: record[] }  (최근 MAX_SCAN행에서 at >= since)
 *  - claim  { key }  → { claimed: boolean }  (webhook 중복 제거, LockService로 원자적 처리)
 */

const KINDS = { click: "clicks", call: "calls", lead: "leads" };
const CLAIM_SHEET = "claims";
const HEADERS = ["id", "project", "at", "json", "savedAt"];
const MAX_SCAN = 5000;
const MAX_RECORD_CHARS = 20000;

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    const expected = PropertiesService.getScriptProperties().getProperty("LEAD_STORE_TOKEN");
    if (!expected || expected.length < 24 || body.token !== expected) return json_({ ok: false });

    switch (body.op) {
      case "append":
        return json_(append_(body));
      case "list":
        return json_(list_(body));
      case "claim":
        return json_(claim_(body));
      default:
        return json_({ ok: false });
    }
  } catch (err) {
    // 본문/토큰은 로그에 남기지 않는다.
    console.warn("lead-events error: " + (err && err.name));
    return json_({ ok: false });
  }
}

function sheet_(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
  }
  return sh;
}

function exists_(sh, id) {
  if (sh.getLastRow() < 2) return false;
  return sh.getRange(2, 1, sh.getLastRow() - 1, 1).createTextFinder(String(id)).matchEntireCell(true).findNext() !== null;
}

function append_(body) {
  const name = KINDS[body.kind];
  const record = JSON.stringify(body.record || {});
  if (!name || !body.id || record.length > MAX_RECORD_CHARS) return { ok: false };
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    const sh = sheet_(name, HEADERS);
    if (!exists_(sh, body.id)) {
      sh.appendRow([String(body.id), String(body.project || ""), String(body.at || ""), record, new Date().toISOString()]);
    }
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

function list_(body) {
  const name = KINDS[body.kind];
  if (!name) return { ok: false };
  const sh = sheet_(name, HEADERS);
  const last = sh.getLastRow();
  if (last < 2) return { ok: true, items: [] };
  const start = Math.max(2, last - MAX_SCAN + 1);
  const rows = sh.getRange(start, 1, last - start + 1, 4).getValues();
  // Sheets가 ISO 문자열을 날짜로 자동 변환할 수 있으므로 숫자(ms)로 비교한다.
  const since = body.since ? new Date(body.since).getTime() : 0;
  const items = [];
  for (const row of rows) {
    if (body.project && row[1] !== body.project) continue;
    if (since && !(new Date(row[2]).getTime() >= since)) continue;
    try {
      items.push(JSON.parse(row[3]));
    } catch (err) {
      // 깨진 행은 건너뛴다.
    }
  }
  return { ok: true, items: items };
}

function claim_(body) {
  if (!body.key || String(body.key).length > 200) return { ok: false };
  const lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    const sh = sheet_(CLAIM_SHEET, ["key", "claimedAt"]);
    if (exists_(sh, body.key)) return { ok: true, claimed: false };
    sh.appendRow([String(body.key), new Date().toISOString()]);
    return { ok: true, claimed: true };
  } finally {
    lock.releaseLock();
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
