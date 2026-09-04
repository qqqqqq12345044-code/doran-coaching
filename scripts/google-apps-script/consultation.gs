/**
 * DORAN 상담 신청 → Google Spreadsheet 저장용 Apps Script.
 *
 * 이 파일은 Vercel/Next.js에서 실행되는 코드가 아니다.
 * https://script.google.com 에서 새 프로젝트를 만들고, 이 내용 전체를
 * 복사해 편집기(Code.gs)에 붙여넣은 뒤 "배포 > 새 배포 > 웹 앱"으로
 * 배포해서 사용한다. 자세한 절차는 완료 보고의 "사용자가 해야 하는 설정"을
 * 참고한다.
 *
 * 흐름: DORAN Consultation Form → POST(JSON) → 이 Web App(doPost)
 *       → Spreadsheet appendRow → (선택) 알림 메일 → 성공/실패 JSON 응답
 */

// ============================================================
// CONFIG — 아래 3개 값만 실제 운영 정보로 바꿔서 사용한다.
// 절대 이 파일을 Git 저장소에 실제 값이 채워진 채로 커밋하지 않는다.
// ============================================================
const CONFIG = {
  // Google Sheet 주소창의 .../d/여기부분/edit 에 있는 ID.
  SPREADSHEET_ID: "",
  // 응답을 저장할 시트(탭) 이름. 존재하지 않으면 오류를 반환한다.
  SHEET_NAME: "상담신청",
  // 새 상담 접수 시 알림 메일을 받을 주소. 비워두면 메일 전송을 건너뛰고
  // Sheet 저장만 정상 동작한다.
  NOTIFICATION_EMAIL: "",
};

// 저장할 컬럼 순서. 첫 실행 시 시트가 비어 있으면 헤더 행을 만들어준다.
const HEADERS = [
  "접수일시",
  "이름",
  "연락처",
  "주소",
  "관심 언어",
  "문의 내용",
  "개인정보 동의 여부",
  "page URL",
  "user agent",
];

function doPost(e) {
  try {
    const data = parseRequest(e);

    // Honeypot: 프론트엔드(ConsultationSection.tsx)가 이미 봇으로 보이는
    // 제출을 걸러 정상적인 경우 이 필드는 항상 비어 있어야 한다. 혹시라도
    // 채워진 요청이 직접 들어오면 저장하지 않고 성공 응답만 돌려준다(봇에게
    // 실패 신호를 주지 않기 위함).
    if (data.company && String(data.company).trim() !== "") {
      return jsonResponse({ success: true });
    }

    const validationError = validate(data);
    if (validationError) {
      return jsonResponse({ success: false, error: validationError });
    }

    const sheet = getSheet();

    // 중복 제출 최소 방지: 바로 직전 행과 이름/연락처/문의내용이 완전히
    // 같으면(더블클릭 등으로 인한 중복 전송) 새 행을 추가하지 않는다.
    if (!isDuplicateOfLastRow(sheet, data)) {
      appendRow(sheet, data);
      maybeSendNotificationEmail(data);
    }

    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({ success: false, error: String(err && err.message ? err.message : err) });
  }
}

function parseRequest(e) {
  if (e && e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (err) {
      // JSON이 아니면 form-urlencoded로 온 것으로 보고 e.parameter를 사용한다.
    }
  }
  if (e && e.parameter) {
    const parsed = Object.assign({}, e.parameter);
    if (parsed.interest && typeof parsed.interest === "string") {
      parsed.interest = [parsed.interest];
    }
    return parsed;
  }
  return {};
}

function validate(data) {
  if (!data.name || !String(data.name).trim()) return "이름을 입력해주세요.";
  if (!data.phone || !String(data.phone).trim()) return "연락처를 입력해주세요.";
  if (!data.address || !String(data.address).trim()) return "주소를 입력해주세요.";
  if (data.privacyConsent !== true && data.privacyConsent !== "true" && data.privacyConsent !== "on") {
    return "개인정보 수집·이용에 동의해주세요.";
  }
  return null;
}

function getSheet() {
  if (!CONFIG.SPREADSHEET_ID) {
    throw new Error("CONFIG.SPREADSHEET_ID가 설정되지 않았습니다.");
  }
  const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    throw new Error('시트 "' + CONFIG.SHEET_NAME + '"를 찾을 수 없습니다.');
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }
  return sheet;
}

function toRow(data) {
  const interest = Array.isArray(data.interest) ? data.interest.join(", ") : data.interest || "";
  const consentLabel =
    data.privacyConsent === true || data.privacyConsent === "true" || data.privacyConsent === "on"
      ? "동의"
      : "미동의";

  return [
    new Date(),
    data.name || "",
    data.phone || "",
    data.address || "",
    interest,
    data.message || "",
    consentLabel,
    data.pageUrl || "",
    data.userAgent || "",
  ];
}

function appendRow(sheet, data) {
  sheet.appendRow(toRow(data));
}

function isDuplicateOfLastRow(sheet, data) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return false; // 헤더만 있거나 빈 시트

  const last = sheet.getRange(lastRow, 1, 1, HEADERS.length).getValues()[0];
  const [, lastName, lastPhone, , , lastMessage] = last;

  return (
    String(lastName) === String(data.name || "") &&
    String(lastPhone) === String(data.phone || "") &&
    String(lastMessage) === String(data.message || "")
  );
}

function maybeSendNotificationEmail(data) {
  if (!CONFIG.NOTIFICATION_EMAIL) return; // 알림 이메일 미설정 시 조용히 건너뜀

  try {
    const interest = Array.isArray(data.interest) ? data.interest.join(", ") : data.interest || "";
    const subject = "[DORAN] 새로운 상담 신청 - " + (data.name || "");
    const body = [
      "접수일시: " + new Date().toLocaleString("ko-KR"),
      "이름: " + (data.name || ""),
      "연락처: " + (data.phone || ""),
      "주소: " + (data.address || ""),
      "관심 언어: " + interest,
      "문의 내용: " + (data.message || ""),
    ].join("\n");

    MailApp.sendEmail(CONFIG.NOTIFICATION_EMAIL, subject, body);
  } catch (err) {
    // 메일 전송 실패가 Sheet 저장 성공 응답을 막지 않도록 조용히 무시한다.
  }
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
