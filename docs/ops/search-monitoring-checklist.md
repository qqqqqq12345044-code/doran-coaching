# 검색엔진 관찰 체크리스트

운영 단계(개발 완료 후)에 정기적으로 확인할 항목. 결과를 코드가 아니라 이 표에
날짜/수치로만 기록한다 — 문서 자체를 계속 늘리지 않는다.

## 2주 차

- [ ] GSC(Search Console): sitemap 4개 shard 처리 상태(Success 여부)
- [ ] GSC: 대표 URL 몇 개(홈/언어3/detail 1~2/local leaf 1~2) URL 검사 도구로 "색인 생성됨" 확인
- [ ] GSC: RSS 제출한 매거진 글이 discovered로 잡히는지
- [ ] Naver 서치어드바이저: sitemap 수집 상태

## 4주 차

- [ ] GSC 실적 리포트: impressions/clicks 총량 추이(급락 여부만 확인)
- [ ] GSC 쿼리 리포트: 어떤 검색어로 노출되는지 상위 10~20개
- [ ] Local landing 페이지 몇 개가 "크롤됨-색인 생성되지 않음"으로 남아있는지 비율
- [ ] 색인 제외 사유(Coverage) 상위 유형 확인

## 8주 차

- [ ] Keyword Cluster(15개)별 impression/click 비교 — 특정 keyword가 0에 가까우면 원인 검토
- [ ] `/local` 지역 허브 전략(sido/sigungu를 sitemap에 정식 편입할지) 재평가
- [ ] Magazine과 Local leaf 콘텐츠 간 자기잠식(cannibalization) 여부 — 같은 쿼리로 둘 다 노출되는지
- [ ] Naver: 검색 유입 추이 확인(자체 대시보드 기준)

## Bing (선택, 아직 미등록)

- [ ] Bing Webmaster Tools 사이트 등록: `https://dorancoaching.com`
- [ ] sitemap 제출: `https://dorancoaching.com/sitemap.xml`
- [ ] (선택) IndexNow 도입 여부 재검토 — 현재는 whitelist가 이미 97,905개 전부
      공개된 안정 상태라 우선순위 낮음, 새 keyword/지역 대량 추가 시점에 재검토
