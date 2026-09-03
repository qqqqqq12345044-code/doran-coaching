// 행정표준코드관리시스템(KIKcd) 형식의 행정동/법정동/매핑 Excel 원본을
// data/regions/generated/*.json 으로 정제하는 재실행 가능한 스크립트.
//
// 사용법:
//   npm run build:regions
//
// 원본 Excel 3개(admin_dong_*, legal_dong_*, dong_mapping_*)를
// data/regions/source 에 교체한 뒤 다시 실행하면 결과가 재생성된다.

import fs from 'node:fs';
import path from 'node:path';
import XLSX from 'xlsx';

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, 'data', 'regions', 'source');
const OUTPUT_DIR = path.join(ROOT, 'data', 'regions', 'generated');

// ---------------------------------------------------------------------------
// 파일 로딩 유틸
// ---------------------------------------------------------------------------

/** prefix로 시작하는 source 파일을 찾는다. 여러 개면 파일명 기준 가장 최신을 사용한다.
 *  ".xlsx" 및 ".xlsx.xlsx"(중복 확장자) 모두 허용한다. */
function findSourceFile(prefix) {
  const files = fs
    .readdirSync(SOURCE_DIR)
    .filter((f) => f.startsWith(prefix) && f.toLowerCase().endsWith('.xlsx'))
    .sort();
  if (files.length === 0) {
    throw new Error(`[build-regions] "${prefix}*.xlsx" 파일을 ${SOURCE_DIR} 에서 찾을 수 없습니다.`);
  }
  return path.join(SOURCE_DIR, files[files.length - 1]);
}

function loadSheet(filePath) {
  const wb = XLSX.readFile(filePath, { raw: true });
  const sheetName = wb.SheetNames[0];
  // defval: null -> 빈 셀도 키가 존재하도록 강제 (누락 컬럼 접근 시 undefined 방지)
  return XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { defval: null, raw: true });
}

/** 코드/이름 등 텍스트 값을 문자열로 강제 보존한다. 코드값은 절대 숫자로 변환하지 않는다. */
function toText(value) {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s === '' ? null : s;
}

/** 10자리 행정표준코드를 문자열로 보존한다(앞자리 0 유지, 숫자 변환 금지). */
function toCode(value) {
  const s = toText(value);
  if (s === null) return null;
  // 혹시 원본이 숫자 타입으로 저장되어 앞자리 0이 소실된 경우를 대비한 방어적 패딩
  return /^\d+$/.test(s) ? s.padStart(10, '0') : s;
}

/** "YYYYMMDD" 문자열을 "YYYY-MM-DD"로 표기한다. 형식이 다르면 원본 값을 그대로 둔다. */
function formatDate(value) {
  const s = toText(value);
  if (s === null) return null;
  if (/^\d{8}$/.test(s)) {
    return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
  }
  return s;
}

function isCancelled(row) {
  return toText(row['말소일자']) !== null;
}

// ---------------------------------------------------------------------------
// 1. 원본 로드
// ---------------------------------------------------------------------------

const adminPath = findSourceFile('admin_dong_');
const legalPath = findSourceFile('legal_dong_');
const mappingPath = findSourceFile('dong_mapping_');

const adminRaw = loadSheet(adminPath);
const legalRaw = loadSheet(legalPath);
const mappingRaw = loadSheet(mappingPath);

// ---------------------------------------------------------------------------
// 2. 말소 지역 제외 (원본은 수정하지 않고, 유효 데이터만 별도로 필터링)
// ---------------------------------------------------------------------------

const adminActive = adminRaw.filter((r) => !isCancelled(r));
const legalActive = legalRaw.filter((r) => !isCancelled(r));
const mappingActive = mappingRaw.filter((r) => !isCancelled(r));

const adminCancelledCount = adminRaw.length - adminActive.length;
const legalCancelledCount = legalRaw.length - legalActive.length;
const mappingCancelledCount = mappingRaw.length - mappingActive.length;

// ---------------------------------------------------------------------------
// 3. Leaf(실제 주소 단위) 레벨 판별
//    - admin: 읍면동명이 있는 행만 실제 행정동(시도/시군구 요약 행 제외)
//    - legal: 읍면동명이 있고, 그 중에서도 하위에 "리" 자식 코드가 없는 행만
//             실제 리/동(주소 단위). 같은 읍/면 아래 "청운동"처럼 리가 없는
//             경우는 읍면동명 행 자체가 leaf, "담양읍"처럼 리가 있는 경우는
//             읍면동명 행은 요약 행이고 리(예: 담주리) 행이 leaf.
// ---------------------------------------------------------------------------

const adminLeaf = adminActive.filter((r) => toText(r['읍면동명']) !== null);

function computeLegalLeaf(rows) {
  const withEupmyeondong = rows.filter((r) => toText(r['읍면동명']) !== null);
  const codesByPrefix = new Map();
  for (const r of withEupmyeondong) {
    const code = toCode(r['법정동코드']);
    if (!code) continue;
    const prefix = code.slice(0, 8);
    if (!codesByPrefix.has(prefix)) codesByPrefix.set(prefix, []);
    codesByPrefix.get(prefix).push(code);
  }
  return withEupmyeondong.filter((r) => {
    if (toText(r['동리명']) !== null) return true; // 리 단위는 항상 leaf
    const code = toCode(r['법정동코드']);
    const siblings = codesByPrefix.get(code.slice(0, 8)) || [];
    const hasChild = siblings.some((c) => c !== code && c.slice(8) !== '00');
    return !hasChild; // 자식 리가 없으면 이 읍면동명 행 자체가 leaf
  });
}

const legalLeaf = computeLegalLeaf(legalActive);

const adminLeafCodes = new Set(adminLeaf.map((r) => toCode(r['행정동코드'])));
const legalLeafCodes = new Set(legalLeaf.map((r) => toCode(r['법정동코드'])));

// ---------------------------------------------------------------------------
// 4. administrative-dongs.json (행정동 기준 unique 데이터)
// ---------------------------------------------------------------------------

const administrativeDongs = adminLeaf.map((r) => ({
  sido: toText(r['시도명']),
  sigungu: toText(r['시군구명']),
  administrativeDong: toText(r['읍면동명']),
  administrativeCode: toCode(r['행정동코드']),
  createdAt: formatDate(r['생성일자']),
}));

// ---------------------------------------------------------------------------
// 5. legal-dongs.json (법정동 기준 unique 데이터, leaf만)
// ---------------------------------------------------------------------------

const legalDongs = legalLeaf.map((r) => ({
  sido: toText(r['시도명']),
  sigungu: toText(r['시군구명']),
  legalEupmyeondong: toText(r['읍면동명']),
  legalDong: toText(r['동리명']) ?? toText(r['읍면동명']),
  legalCode: toCode(r['법정동코드']),
  createdAt: formatDate(r['생성일자']),
}));

// ---------------------------------------------------------------------------
// 6. regions.json (행정동 ↔ 법정동 매핑 기준 Flat 데이터)
//    1:1 이 아닐 수 있으므로(하나의 행정동 -> 여러 법정동, 그 반대도 가능)
//    매핑 원본의 모든 leaf-leaf 조합을 그대로 유지한다.
// ---------------------------------------------------------------------------

const validMappingRows = mappingActive.filter((r) => {
  const adminCode = toCode(r['행정동코드']);
  const legalCode = toCode(r['법정동코드']);
  return adminCode && legalCode && adminLeafCodes.has(adminCode) && legalLeafCodes.has(legalCode);
});

const regions = validMappingRows.map((r) => ({
  sido: toText(r['시도명']),
  sigungu: toText(r['시군구명']),
  administrativeDong: toText(r['읍면동명']),
  administrativeCode: toCode(r['행정동코드']),
  legalDong: toText(r['동리명']),
  legalCode: toCode(r['법정동코드']),
  createdAt: formatDate(r['생성일자']),
}));

// ---------------------------------------------------------------------------
// 7. 검증
// ---------------------------------------------------------------------------

function findDuplicateRows(list, keyFn) {
  const seen = new Map();
  for (const item of list) {
    const key = keyFn(item);
    seen.set(key, (seen.get(key) || 0) + 1);
  }
  return [...seen.entries()].filter(([, count]) => count > 1);
}

function findCodeNameConflicts(list, codeKey, nameKey) {
  const byCode = new Map();
  for (const item of list) {
    const code = item[codeKey];
    if (!byCode.has(code)) byCode.set(code, new Set());
    byCode.get(code).add(item[nameKey]);
  }
  return [...byCode.entries()].filter(([, names]) => names.size > 1);
}

const validation = {
  duplicateAdminCodes: findDuplicateRows(administrativeDongs, (r) => r.administrativeCode),
  duplicateLegalCodes: findDuplicateRows(legalDongs, (r) => r.legalCode),
  adminCodeNameConflicts: findCodeNameConflicts(administrativeDongs, 'administrativeCode', 'administrativeDong'),
  legalCodeNameConflicts: findCodeNameConflicts(legalDongs, 'legalCode', 'legalDong'),
  emptyAdminNames: administrativeDongs.filter((r) => !r.administrativeDong),
  emptyLegalNames: legalDongs.filter((r) => !r.legalDong),
  emptyAdminCodes: administrativeDongs.filter((r) => !r.administrativeCode),
  emptyLegalCodes: legalDongs.filter((r) => !r.legalCode),
  unmappedAdminDongs: administrativeDongs.filter(
    (a) => !regions.some((r) => r.administrativeCode === a.administrativeCode)
  ),
  unmappedLegalDongs: legalDongs.filter((l) => !regions.some((r) => r.legalCode === l.legalCode)),
  // 매핑 파일이 법정동 원본에 없는 코드를 참조하는 경우 (예: 출장소 코드)
  mappingLegalCodesNotInLegalSource: [
    ...new Set(mappingActive.map((r) => toCode(r['법정동코드']))),
  ].filter((c) => c && !legalActive.some((r) => toCode(r['법정동코드']) === c)),
};

// ---------------------------------------------------------------------------
// 8. 시도별 통계
// ---------------------------------------------------------------------------

function countBySido(list, sidoField) {
  const counts = {};
  for (const item of list) {
    const sido = item[sidoField];
    counts[sido] = (counts[sido] || 0) + 1;
  }
  return counts;
}

const adminCountBySido = countBySido(administrativeDongs, 'sido');
const legalCountBySido = countBySido(legalDongs, 'sido');
const allSido = [...new Set([...Object.keys(adminCountBySido), ...Object.keys(legalCountBySido)])].sort();

// ---------------------------------------------------------------------------
// 9. 파일 출력
// ---------------------------------------------------------------------------

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function writeJson(fileName, data) {
  const filePath = path.join(OUTPUT_DIR, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  return filePath;
}

writeJson('administrative-dongs.json', administrativeDongs);
writeJson('legal-dongs.json', legalDongs);
writeJson('regions.json', regions);

// ---------------------------------------------------------------------------
// 10. 리포트 출력
// ---------------------------------------------------------------------------

console.log('='.repeat(70));
console.log('지역 데이터 정제 완료');
console.log('='.repeat(70));
console.log(`원본 admin_dong : ${adminRaw.length}행 (말소 ${adminCancelledCount}행 제외)`);
console.log(`원본 legal_dong : ${legalRaw.length}행 (말소 ${legalCancelledCount}행 제외)`);
console.log(`원본 dong_mapping: ${mappingRaw.length}행 (말소 ${mappingCancelledCount}행 제외)`);
console.log('');
console.log(`유효 행정동 수 (administrative-dongs.json): ${administrativeDongs.length}`);
console.log(`유효 법정동 수 (legal-dongs.json)         : ${legalDongs.length}`);
console.log(`행정동 ↔ 법정동 매핑 행 수 (regions.json)  : ${regions.length}`);
console.log('');
console.log('--- 시도별 통계 ---');
for (const sido of allSido) {
  console.log(`${sido}: 행정동 ${adminCountBySido[sido] || 0}, 법정동 ${legalCountBySido[sido] || 0}`);
}
console.log('');
console.log('--- 검증 결과 ---');
console.log(`완전 중복 행정동코드: ${validation.duplicateAdminCodes.length}`);
console.log(`완전 중복 법정동코드: ${validation.duplicateLegalCodes.length}`);
console.log(`동일 행정동코드 + 다른 행정동명: ${validation.adminCodeNameConflicts.length}`);
console.log(`동일 법정동코드 + 다른 법정동명: ${validation.legalCodeNameConflicts.length}`);
console.log(`빈 행정동명: ${validation.emptyAdminNames.length}`);
console.log(`빈 법정동명: ${validation.emptyLegalNames.length}`);
console.log(`빈 행정동코드: ${validation.emptyAdminCodes.length}`);
console.log(`빈 법정동코드: ${validation.emptyLegalCodes.length}`);
console.log(`매핑되지 않는 행정동: ${validation.unmappedAdminDongs.length}`);
console.log(`매핑되지 않는 법정동: ${validation.unmappedLegalDongs.length}`);
console.log(
  `매핑 파일이 참조하지만 법정동 원본에는 없는 코드(주로 출장소): ${validation.mappingLegalCodesNotInLegalSource.length}`
);
if (validation.unmappedAdminDongs.length > 0) {
  console.log('  매핑되지 않는 행정동 샘플:', validation.unmappedAdminDongs.slice(0, 5).map((r) => `${r.sido} ${r.sigungu} ${r.administrativeDong}`));
}

console.log('');
console.log('--- 샘플 데이터 ---');
const sampleSidoList = ['서울특별시', '부산광역시', '경기도', '세종특별자치시', '제주특별자치도'];
for (const sido of sampleSidoList) {
  const samples = regions.filter((r) => r.sido === sido).slice(0, 3);
  console.log(`\n[${sido}] (매핑 예시 ${samples.length}건)`);
  if (samples.length === 0) {
    console.log('  해당 지역 데이터 없음');
  } else {
    for (const s of samples) {
      console.log(`  ${s.sido} ${s.sigungu ?? ''} ${s.administrativeDong} -> ${s.legalDong} (${s.administrativeCode} / ${s.legalCode})`);
    }
  }
}

writeJson('_validation-report.json', {
  generatedAt: new Date().toISOString(),
  counts: {
    administrativeDongs: administrativeDongs.length,
    legalDongs: legalDongs.length,
    mappingRows: regions.length,
    cancelledAdmin: adminCancelledCount,
    cancelledLegal: legalCancelledCount,
    cancelledMapping: mappingCancelledCount,
  },
  adminCountBySido,
  legalCountBySido,
  duplicateAdminCodes: validation.duplicateAdminCodes,
  duplicateLegalCodes: validation.duplicateLegalCodes,
  adminCodeNameConflicts: validation.adminCodeNameConflicts,
  legalCodeNameConflicts: validation.legalCodeNameConflicts,
  emptyAdminNames: validation.emptyAdminNames,
  emptyLegalNames: validation.emptyLegalNames,
  unmappedAdminDongs: validation.unmappedAdminDongs,
  unmappedLegalDongs: validation.unmappedLegalDongs,
  mappingLegalCodesNotInLegalSource: validation.mappingLegalCodesNotInLegalSource,
});

console.log('\n생성 파일:');
console.log(`  ${path.relative(ROOT, path.join(OUTPUT_DIR, 'administrative-dongs.json'))}`);
console.log(`  ${path.relative(ROOT, path.join(OUTPUT_DIR, 'legal-dongs.json'))}`);
console.log(`  ${path.relative(ROOT, path.join(OUTPUT_DIR, 'regions.json'))}`);
console.log(`  ${path.relative(ROOT, path.join(OUTPUT_DIR, '_validation-report.json'))} (검증용, SEO 페이지에는 사용하지 않음)`);
