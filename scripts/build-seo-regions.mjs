// "SEO Region Master" 빌드 스크립트.
//
// data/regions/generated/administrative-dongs.json / legal-dongs.json / regions.json
// (scripts/build-regions.mjs 산출물)은 절대 건드리지 않는다. 이 스크립트는
// data/regions/source 의 원본 Excel(admin_dong_*, legal_dong_*)을 독립적으로
// 다시 읽어, SEO 페이지 운영 기준(읍/면/동만 포함, 리·출장소·요약행·말소 제외)에
// 맞춘 별도의 지역 마스터를 새로 만든다.
//
// 사용법:
//   npm run build:seo-regions
//
// 원본 Excel(admin_dong_*, legal_dong_*)을 data/regions/source 에 교체한 뒤
// 다시 실행하면 결과가 재생성된다.

import fs from 'node:fs';
import path from 'node:path';
import XLSX from 'xlsx';

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, 'data', 'regions', 'source');
const OUTPUT_DIR = path.join(ROOT, 'data', 'regions', 'generated');

// ---------------------------------------------------------------------------
// 파일 로딩 유틸 (scripts/build-regions.mjs 와 동일한 방식이지만, 그 스크립트를
// 수정하지 않기 위해 이 파일 안에 독립적으로 둔다)
// ---------------------------------------------------------------------------

function findSourceFile(prefix) {
  const files = fs
    .readdirSync(SOURCE_DIR)
    .filter((f) => f.startsWith(prefix) && f.toLowerCase().endsWith('.xlsx'))
    .sort();
  if (files.length === 0) {
    throw new Error(`[build-seo-regions] "${prefix}*.xlsx" 파일을 ${SOURCE_DIR} 에서 찾을 수 없습니다.`);
  }
  return path.join(SOURCE_DIR, files[files.length - 1]);
}

function loadSheet(filePath) {
  const wb = XLSX.readFile(filePath, { raw: true });
  const sheetName = wb.SheetNames[0];
  return XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { defval: null, raw: true });
}

function toText(value) {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s === '' ? null : s;
}

function toCode(value) {
  const s = toText(value);
  if (s === null) return null;
  return /^\d+$/.test(s) ? s.padStart(10, '0') : s;
}

function isCancelled(row) {
  return toText(row['말소일자']) !== null;
}

function isBranchOffice(name) {
  return name !== null && name.includes('출장소');
}

/** 원본 컬럼에 별도 구분 컬럼이 없으므로 suffix로 읍/면/동을 판별한다.
 *  판단 불가능한 경우(예: 서울 종로구 "종로1가" 류의 legacy 법정동)는 null. */
function inferRegionType(name) {
  if (name.endsWith('읍')) return '읍';
  if (name.endsWith('면')) return '면';
  if (name.endsWith('동')) return '동';
  return null;
}

// ---------------------------------------------------------------------------
// 1. 원본 로드 + 말소 제외
// ---------------------------------------------------------------------------

const adminPath = findSourceFile('admin_dong_');
const legalPath = findSourceFile('legal_dong_');

const adminRaw = loadSheet(adminPath);
const legalRaw = loadSheet(legalPath);

const adminActive = adminRaw.filter((r) => !isCancelled(r));
const legalActive = legalRaw.filter((r) => !isCancelled(r));
const adminCancelledCount = adminRaw.length - adminActive.length;
const legalCancelledCount = legalRaw.length - legalActive.length;

// ---------------------------------------------------------------------------
// 2. 읍/면/동 후보 추출
//    - admin: 읍면동명이 있고(=시도/시군구 요약행 아님) "출장소"가 아닌 행 전부.
//      admin_dong 원본에는 애초에 "리" 개념이 없다.
//    - legal: 읍면동명이 있고 "동리명"이 없는(=시도/시군구 요약행이 아니면서,
//      "리"/구 서울식 "-가" 세부 주소의 하위 행도 아닌) 행. 하위에 "리"가
//      존재하더라도 읍/면 자체 행은 유효한 SEO 지역으로 그대로 포함한다
//      (기존 build-regions.mjs의 leaf-only 방식과 다른 지점).
// ---------------------------------------------------------------------------

const adminCandidates = adminActive.filter((r) => {
  const name = toText(r['읍면동명']);
  return name !== null && !isBranchOffice(name);
});

const legalCandidates = legalActive.filter((r) => {
  const name = toText(r['읍면동명']);
  const dongri = toText(r['동리명']);
  return name !== null && dongri === null && !isBranchOffice(name);
});

const adminBranchExcludedCount = adminActive.filter(
  (r) => toText(r['읍면동명']) !== null && isBranchOffice(toText(r['읍면동명']))
).length;
const legalBranchExcludedCount = legalActive.filter(
  (r) => toText(r['읍면동명']) !== null && isBranchOffice(toText(r['읍면동명']))
).length;
const legalRiExcludedCount = legalActive.filter(
  (r) => toText(r['읍면동명']) !== null && toText(r['동리명']) !== null
).length;

// ---------------------------------------------------------------------------
// 3. 행정동 + 법정동 -> sido+sigungu+regionName 기준 병합
// ---------------------------------------------------------------------------

const regionMap = new Map(); // key -> region

function keyOf(sido, sigungu, regionName) {
  return JSON.stringify([sido, sigungu, regionName]);
}

function getOrCreate(sido, sigungu, regionName) {
  const key = keyOf(sido, sigungu, regionName);
  let region = regionMap.get(key);
  if (!region) {
    region = {
      sido,
      sigungu,
      regionName,
      regionType: null,
      sourceSet: new Set(),
      legalCodeSet: new Set(),
      administrativeCodeSet: new Set(),
    };
    regionMap.set(key, region);
  }
  return region;
}

const regionTypeConflicts = [];

for (const r of adminCandidates) {
  const sido = toText(r['시도명']);
  const sigungu = toText(r['시군구명']);
  const regionName = toText(r['읍면동명']);
  const code = toCode(r['행정동코드']);
  const region = getOrCreate(sido, sigungu, regionName);
  region.sourceSet.add('administrative');
  if (code) region.administrativeCodeSet.add(code);
  const inferred = inferRegionType(regionName);
  if (inferred) {
    if (region.regionType && region.regionType !== inferred) {
      regionTypeConflicts.push({ sido, sigungu, regionName, existing: region.regionType, incoming: inferred, from: 'administrative' });
    } else {
      region.regionType = inferred;
    }
  }
}

for (const r of legalCandidates) {
  const sido = toText(r['시도명']);
  const sigungu = toText(r['시군구명']);
  const regionName = toText(r['읍면동명']);
  const code = toCode(r['법정동코드']);
  const region = getOrCreate(sido, sigungu, regionName);
  region.sourceSet.add('legal');
  if (code) region.legalCodeSet.add(code);
  const inferred = inferRegionType(regionName);
  if (inferred) {
    if (region.regionType && region.regionType !== inferred) {
      regionTypeConflicts.push({ sido, sigungu, regionName, existing: region.regionType, incoming: inferred, from: 'legal' });
    } else {
      region.regionType = inferred;
    }
  }
  // regionType이 아직 없다면(=판단 불가) 그대로 null 유지. 임의 지정하지 않는다.
}

// ---------------------------------------------------------------------------
// 4. 최종 배열 구성
// ---------------------------------------------------------------------------

function buildId(sido, sigungu, regionName) {
  return [sido, sigungu, regionName].filter((v) => v !== null && v !== undefined && v !== '').join('/');
}

const seoRegions = [...regionMap.values()]
  .map((region) => {
    const sources = ['administrative', 'legal'].filter((s) => region.sourceSet.has(s));
    return {
      id: buildId(region.sido, region.sigungu, region.regionName),
      sido: region.sido,
      sigungu: region.sigungu,
      regionName: region.regionName,
      regionType: region.regionType,
      fullName: [region.sido, region.sigungu, region.regionName].filter(Boolean).join(' '),
      sources,
      legalCodes: [...region.legalCodeSet],
      administrativeCodes: [...region.administrativeCodeSet],
    };
  })
  .sort((a, b) => {
    return (
      a.sido.localeCompare(b.sido, 'ko') ||
      (a.sigungu ?? '').localeCompare(b.sigungu ?? '', 'ko') ||
      a.regionName.localeCompare(b.regionName, 'ko')
    );
  });

// ---------------------------------------------------------------------------
// 5. Validation
// ---------------------------------------------------------------------------

function findDuplicates(values) {
  const counts = new Map();
  for (const v of values) counts.set(v, (counts.get(v) || 0) + 1);
  return [...counts.entries()].filter(([, n]) => n > 1).map(([v]) => v);
}

const duplicateIds = findDuplicates(seoRegions.map((r) => r.id));
const emptySido = seoRegions.filter((r) => !r.sido);
const emptySigungu = seoRegions.filter((r) => !r.sigungu);
const emptyRegionName = seoRegions.filter((r) => !r.regionName);
const regionTypeUnknown = seoRegions.filter((r) => !r.regionType);
const stillHasRi = seoRegions.filter((r) => r.regionName.endsWith('리'));
const stillHasBranchOffice = seoRegions.filter((r) => r.regionName.includes('출장소'));
const invalidCodes = seoRegions.filter((r) =>
  [...r.legalCodes, ...r.administrativeCodes].some((c) => typeof c !== 'string' || !/^\d+$/.test(c))
);
const sourceMergeErrors = seoRegions.filter((r) => {
  const hasAdminSource = r.sources.includes('administrative');
  const hasLegalSource = r.sources.includes('legal');
  const hasAdminCode = r.administrativeCodes.length > 0;
  const hasLegalCode = r.legalCodes.length > 0;
  return hasAdminSource !== hasAdminCode || hasLegalSource !== hasLegalCode;
});
const multiCodeItems = seoRegions.filter((r) => r.legalCodes.length > 1 || r.administrativeCodes.length > 1);

const emptySigunguNonSejong = emptySigungu.filter((r) => r.sido !== '세종특별자치시');

const validationHasIssues =
  duplicateIds.length > 0 ||
  emptySido.length > 0 ||
  emptyRegionName.length > 0 ||
  stillHasRi.length > 0 ||
  stillHasBranchOffice.length > 0 ||
  invalidCodes.length > 0 ||
  sourceMergeErrors.length > 0 ||
  regionTypeConflicts.length > 0;
// regionTypeUnknown / emptySigungu(세종) / multiCodeItems 는 "오류"라기보다
// "사람이 확인해야 할 항목"이므로 hasIssues 판정에는 포함하지 않고 report에는 남긴다.

// ---------------------------------------------------------------------------
// 6. 통계
// ---------------------------------------------------------------------------

const countByType = { 읍: 0, 면: 0, 동: 0, unknown: 0 };
for (const r of seoRegions) {
  if (r.regionType === '읍') countByType['읍']++;
  else if (r.regionType === '면') countByType['면']++;
  else if (r.regionType === '동') countByType['동']++;
  else countByType.unknown++;
}

const adminOnlyCount = seoRegions.filter((r) => r.sources.length === 1 && r.sources[0] === 'administrative').length;
const legalOnlyCount = seoRegions.filter((r) => r.sources.length === 1 && r.sources[0] === 'legal').length;
const bothCount = seoRegions.filter((r) => r.sources.length === 2).length;

const countBySido = {};
for (const r of seoRegions) {
  countBySido[r.sido] = (countBySido[r.sido] || 0) + 1;
}

// ---------------------------------------------------------------------------
// 7. 파일 출력
// ---------------------------------------------------------------------------

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function writeJson(fileName, data) {
  const filePath = path.join(OUTPUT_DIR, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  return filePath;
}

writeJson('seo-regions.json', seoRegions);

writeJson('_seo-region-validation-report.json', {
  generatedAt: new Date().toISOString(),
  counts: {
    totalRegions: seoRegions.length,
    byType: countByType,
    adminOnly: adminOnlyCount,
    legalOnly: legalOnlyCount,
    both: bothCount,
    cancelledAdminExcluded: adminCancelledCount,
    cancelledLegalExcluded: legalCancelledCount,
    branchOfficeExcludedAdmin: adminBranchExcludedCount,
    branchOfficeExcludedLegal: legalBranchExcludedCount,
    riExcludedLegal: legalRiExcludedCount,
  },
  countBySido,
  issues: {
    duplicateIds,
    emptySido: emptySido.map((r) => r.id),
    emptySigungu: emptySigungu.map((r) => r.id),
    emptySigunguNonSejong: emptySigunguNonSejong.map((r) => r.id),
    emptyRegionName: emptyRegionName.map((r) => r.id),
    regionTypeUnknown: regionTypeUnknown.map((r) => ({ id: r.id, regionName: r.regionName })),
    regionTypeConflicts,
    stillHasRi: stillHasRi.map((r) => r.id),
    stillHasBranchOffice: stillHasBranchOffice.map((r) => r.id),
    invalidCodes: invalidCodes.map((r) => r.id),
    sourceMergeErrors: sourceMergeErrors.map((r) => r.id),
    multiCodeItems: multiCodeItems.map((r) => ({ id: r.id, legalCodes: r.legalCodes, administrativeCodes: r.administrativeCodes })),
  },
});

// ---------------------------------------------------------------------------
// 8. 리포트 출력
// ---------------------------------------------------------------------------

console.log('='.repeat(70));
console.log('SEO Region Master 빌드 완료');
console.log('='.repeat(70));
console.log(`전체 SEO Region 수: ${seoRegions.length}`);
console.log(`  읍: ${countByType['읍']}`);
console.log(`  면: ${countByType['면']}`);
console.log(`  동: ${countByType['동']}`);
console.log(`  판단 불가(regionType null): ${countByType.unknown}`);
console.log('');
console.log(`행정 데이터에서만 존재: ${adminOnlyCount}`);
console.log(`법정 데이터에서만 존재: ${legalOnlyCount}`);
console.log(`행정+법정 양쪽 존재: ${bothCount}`);
console.log('');
console.log('--- 시도별 개수 ---');
for (const [sido, count] of Object.entries(countBySido).sort()) {
  console.log(`${sido}: ${count}`);
}

console.log('\n--- 검증 결과 ---');
console.log(`id(=sido+sigungu+regionName) 완전 중복: ${duplicateIds.length}`);
console.log(`빈 sido: ${emptySido.length}`);
console.log(`빈 sigungu: ${emptySigungu.length} (세종 제외 이상치: ${emptySigunguNonSejong.length})`);
console.log(`빈 regionName: ${emptyRegionName.length}`);
console.log(`regionType 판단 불가(null): ${regionTypeUnknown.length}`);
console.log(`regionType 충돌(같은 지역명, 다른 접미사 판정): ${regionTypeConflicts.length}`);
console.log(`"리" 잔존: ${stillHasRi.length}`);
console.log(`"출장소" 잔존: ${stillHasBranchOffice.length}`);
console.log(`잘못된 코드 형식: ${invalidCodes.length}`);
console.log(`출처(sources)-코드 불일치: ${sourceMergeErrors.length}`);
console.log(`동일 지역명에 코드 2개 이상(참고용, 오류 아님): ${multiCodeItems.length}`);
console.log(`\n종합: ${validationHasIssues ? '이상 데이터 발견 (validation report 확인)' : '핵심 검증 항목 이상 없음'}`);
if (regionTypeUnknown.length > 0) {
  console.log(
    `  regionType 판단 불가 샘플:`,
    regionTypeUnknown.slice(0, 8).map((r) => r.regionName)
  );
}

console.log(`\n생성 파일:`);
console.log(`  ${path.relative(ROOT, path.join(OUTPUT_DIR, 'seo-regions.json'))}`);
console.log(`  ${path.relative(ROOT, path.join(OUTPUT_DIR, '_seo-region-validation-report.json'))}`);

if (validationHasIssues) {
  process.exitCode = 1;
}
