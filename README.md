# 한강온도 (hangang-temp)

> 수온이 낮을수록, 주가가 낮을수록

한강 수온과 코스피 지수를 연동해 오늘의 한강행 위험도를 보여주는 밈 대시보드 앱

---

## 빠른 시작

```bash
pnpm install
pnpm dev
```

## 기술 스택

| 구분 | 선택 | 이유 |
|------|------|------|
| Frontend | React 18 + Vite | CRA 대비 빌드 속도 10x |
| Styling | Tailwind CSS v4 | 유틸리티 퍼스트, 번들 최소화 |
| State | Zustand | 가벼움, 보일러플레이트 없음 |
| Chart | Chart.js + react-chartjs-2 | 경량, PWA 친화 |
| PWA | vite-plugin-pwa | Workbox 자동화 |
| 배포 | Vercel | Edge Function으로 CORS 프록시 가능 |
| 광고 | Google AdSense | 정적 삽입 |

## 데이터 소스

| 데이터 | 출처 | 방식 |
|--------|------|------|
| 한강 수온 | 한국수자원공사 물정보 포털 | 공공 API (CORS 허용) |
| 코스피 지수 | Vercel Edge Function 프록시 | Yahoo Finance fetch |
| 날씨 | 기상청 단기예보 API | 공공 API |

## 문서

- [요구사항 명세서](docs/requirements.md)
- [기획서](docs/planning.md)
- [기술 아키텍처](docs/architecture.md)
- [마일스톤 & 로드맵](docs/milestones.md)

## 레포 구조

```
hangang-temp/
├── api/                    # Vercel Edge Functions (CORS 프록시)
│   └── kospi.ts
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── DangerBanner.tsx
│   │   ├── MetricCard.tsx
│   │   ├── RamenIndex.tsx
│   │   ├── WeeklyChart.tsx
│   │   └── AdUnit.tsx
│   ├── hooks/
│   │   ├── useHangangTemp.ts
│   │   └── useKospi.ts
│   ├── store/
│   │   └── useAppStore.ts
│   ├── utils/
│   │   └── riskCalculator.ts
│   └── App.tsx
├── docs/
├── package.json
└── vite.config.ts
```
