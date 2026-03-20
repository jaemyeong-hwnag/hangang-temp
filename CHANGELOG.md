# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2026-03-20

### Added
- Test suite with Vitest (68 tests, 91.6% coverage)
- `riskCalculator` — 위험도 4단계 + 라면지수 계산 로직 완전 커버
- `historyStorage` — 30일 히스토리 저장/조회 완전 커버
- `stockSearch` — 종목 검색 완전 커버
- `watchlistStorage` — 관심 종목 CRUD 완전 커버
- `useAppStore` — Zustand store setter 전체 커버
- `useKospi` — fetch 성공/실패/폴백 케이스 커버
- `useHangangTemp` — API 키 없음/성공/실패/배열 파싱 케이스 커버
- `useStockPrice` — fetch 성공/실패 케이스 커버
- `usePushNotification` — 권한 요청/거부/예외 케이스 커버
- Coverage threshold: 80% (lines, functions, branches, statements)

### Changed
- `vite.config.ts` — Vitest 설정 추가 (environment: jsdom, coverage: v8)
- `package.json` — `test`, `test:watch`, `test:coverage` 스크립트 추가

## [0.1.0] - 2026-03-19

### Added
- MVP v0.1: 수온 + 코스피 대시보드 (DangerBanner, MetricCard, RamenIndex)
- v0.5: AdSense 컴포넌트, OG 태그, manifest.json, sitemap.xml, robots.txt
- v1.0: PWA (vite-plugin-pwa), Service Worker, 푸시 알림, 오프라인 배너
- v1.1: 종목별 위험도 (WatchlistPage, StockSearch, StockRiskCard), 쿠키 동의 배너, 홈화면 설치 유도
- v2.0: 동적 OG 이미지 생성 (Vercel Edge Function `/api/og`)
- Vercel Edge Functions: `/api/kospi`, `/api/stock`, `/api/og`, `/api/push-subscribe`
- CLAUDE.md — common-ai-skill 스킬 참조
- 프로젝트 문서: requirements.md, planning.md, architecture.md, milestones.md
