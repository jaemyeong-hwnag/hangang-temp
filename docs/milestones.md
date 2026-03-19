# 마일스톤 & 로드맵 (Milestones & Roadmap)

> 한강온도 (hangang-temp)
> 기준일: 2026-03-19

---

## 마일스톤 개요

```
MVP (v0.1)          v0.5              v1.0              v1.1              v2.0
    │                 │                 │                 │                 │
2026-03-28       2026-04-11        2026-04-25        2026-05-16        2026-06-27
    │                 │                 │                 │                 │
정적 대시보드     AdSense 삽입     PWA + 알림        종목별 위험도     소셜 카드 자동생성
```

---

## MVP — v0.1 (목표: 2026-03-28)

**목표:** 수온 + 코스피 대시보드 정적 웹 배포

### 태스크

- [ ] 프로젝트 세팅 (Vite + React + TypeScript + Tailwind)
- [ ] `useHangangTemp` 훅 구현 (물정보포털 API 연동)
- [ ] Vercel Edge Function `/api/kospi` 구현 (Yahoo Finance 프록시)
- [ ] `useKospi` 훅 구현
- [ ] `riskCalculator.ts` 위험도/라면지수 계산 로직
- [ ] `DangerBanner` 컴포넌트 (4단계 컬러 배너)
- [ ] `MetricCard` 컴포넌트 (수온/코스피 카드)
- [ ] `RamenIndex` 컴포넌트 (라면 지수 프로그레스 바)
- [ ] 기본 레이아웃 + 하단 네비게이션
- [ ] `ShareButton` 컴포넌트 (Web Share API)
- [ ] Vercel 배포 + 도메인 연결
- [ ] README 업데이트

**완료 기준:**
- 실제 수온/코스피 데이터 노출
- 위험도 판정 정상 작동
- 모바일에서 공유 가능
- Vercel 프로덕션 URL 접근 가능

---

## v0.5 — AdSense & SEO (목표: 2026-04-11)

**목표:** 수익화 기반 마련 + AdSense 심사 신청

### 태스크

- [ ] `AdUnit.tsx` 컴포넌트 구현
- [ ] 광고 위치 A 삽입 (판정 결과 하단)
- [ ] 광고 위치 C 삽입 (앵커 배너)
- [ ] 광고 위치 B 인터스티셜 (위험 단계 트리거)
- [ ] OG 메타태그 설정 (og:title, og:description, og:image)
- [ ] `manifest.json` + PWA 아이콘 세트
- [ ] Google AdSense 신청
- [ ] Google Analytics 4 설치
- [ ] Lighthouse 성능 최적화 (점수 ≥ 85)
- [ ] `sitemap.xml` 생성

**완료 기준:**
- AdSense 심사 신청 완료
- Lighthouse Performance ≥ 85
- OG 카드 SNS 미리보기 정상

---

## v1.0 — PWA + 푸시 알림 (목표: 2026-04-25)

**목표:** 재방문 유도 시스템 완성

### 태스크

- [ ] `vite-plugin-pwa` 설정 (Workbox)
- [ ] Service Worker 캐싱 전략 구현
- [ ] Web Push API 연동 (VAPID 키 생성)
- [ ] Vercel Edge Function → 푸시 발송 로직
- [ ] 알림 트리거: 코스피 -3% 감지
- [ ] 알림 트리거: 수온 10°C 이하
- [ ] 모닝 브리핑 스케줄 알림 (오전 9시)
- [ ] 알림 설정 화면 (`Notifications.tsx`, `Settings.tsx`)
- [ ] `WeeklyChart.tsx` 7일 이중 축 차트
- [ ] `historyStorage.ts` 로컬스토리지 누적 저장
- [ ] 오프라인 모드 + 오프라인 배너
- [ ] AdSense 승인 후 슬롯 ID 적용

**완료 기준:**
- PWA 설치 가능 (홈 화면 추가)
- 푸시 알림 정상 발송
- 오프라인 시 캐시 데이터 표시

---

## v1.1 — 종목별 위험도 (목표: 2026-05-16)

**목표:** 개인화 기능 추가

### 태스크

- [ ] 종목 검색 컴포넌트
- [ ] 개별 종목 한강행 위험도 계산
- [ ] 관심 종목 저장 (로컬스토리지)
- [ ] 종목별 위험도 카드
- [ ] GDPR/개인정보 동의 배너 (AdSense 쿠키)
- [ ] PWA 홈 화면 설치 유도 UI

---

## v2.0 — 소셜 카드 자동생성 (목표: 2026-06-27)

**목표:** 바이럴 엔진 완성

### 태스크

- [ ] Vercel Edge Function → OG 이미지 동적 렌더링 (`@vercel/og`)
- [ ] `og:image` URL에 수온/코스피/위험도 파라미터 포함
- [ ] 공유 카드 디자인 (1200x630, 다크 테마)
- [ ] 위험도별 공유 카드 템플릿 4종
- [ ] 앱 스토어 PWA 제출 (선택)

---

## 위험 요소 (Risks)

| 위험 | 가능성 | 영향도 | 대응 |
|------|--------|--------|------|
| 물정보포털 API CORS 차단 | 중 | 높음 | Edge Function 프록시로 전환 |
| Yahoo Finance API 차단 | 중 | 높음 | 대체: KRX 공공데이터 API |
| AdSense 심사 거절 | 중 | 중간 | 콘텐츠 보강, 재신청 |
| 바이럴 미발생 | 중 | 중간 | 커뮤니티(주식갤, 코인판) 직접 공유 |

---

## 버전 히스토리

| 버전 | 날짜 | 주요 변경 |
|------|------|---------|
| v0.1 | 2026-03-28 | MVP 릴리스 |
| v0.5 | 2026-04-11 | AdSense + SEO |
| v1.0 | 2026-04-25 | PWA + 푸시 알림 |
| v1.1 | 2026-05-16 | 종목별 위험도 |
| v2.0 | 2026-06-27 | 소셜 카드 자동생성 |
