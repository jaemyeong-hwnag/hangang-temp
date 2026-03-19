# 기술 아키텍처 (Technical Architecture)

> 한강온도 (hangang-temp)

---

## 1. 기술 스택 결정

### 원칙: 서버 비용 0원, 유지보수 최소화

| 구분 | 선택 | 대안 | 결정 이유 |
|------|------|------|---------|
| Frontend | React 18 + Vite | Next.js, Astro | SSR 불필요, 빌드 속도 |
| Styling | Tailwind CSS v4 | styled-components | 번들 최소화, 유틸리티 |
| State | Zustand | Redux, Jotai | 최소 보일러플레이트 |
| Chart | Chart.js + react-chartjs-2 | Recharts | 경량, 커스터마이징 |
| PWA | vite-plugin-pwa | 수동 SW | Workbox 자동화 |
| 배포 | Vercel | GitHub Pages | Edge Function 지원 |
| 언어 | TypeScript | JavaScript | 타입 안전성 |

---

## 2. 시스템 아키텍처

```
┌─────────────────────────────────────────────────────┐
│                    Browser (PWA)                    │
│                                                     │
│  React App (Vite)                                   │
│  ┌────────────┐  ┌────────────┐  ┌───────────────┐  │
│  │useHangangTemp│  │ useKospi  │  │ useWeather    │  │
│  └─────┬──────┘  └─────┬──────┘  └──────┬────────┘  │
│        │               │                │           │
└────────┼───────────────┼────────────────┼───────────┘
         │               │                │
         ▼               ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 물정보포털   │  │ Vercel Edge  │  │ 기상청 API   │
│ 공공 API     │  │ Function     │  │ (공공데이터) │
│ (CORS 허용)  │  │ /api/kospi   │  │ (CORS 허용)  │
└──────────────┘  └──────┬───────┘  └──────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ Yahoo Finance│
                  │ ^KS11        │
                  └──────────────┘

Service Worker (vite-plugin-pwa)
├── Cache: 정적 자산 (cache-first)
├── Cache: API 응답 (stale-while-revalidate)
└── Push: Web Push API (VAPID)

LocalStorage
└── 7일 히스토리 데이터 누적
```

---

## 3. 디렉토리 구조

```
hangang-temp/
├── api/                          # Vercel Edge Functions
│   └── kospi.ts                  # KOSPI CORS 프록시
├── public/
│   ├── index.html
│   ├── manifest.json             # PWA 매니페스트
│   └── icons/                    # PWA 아이콘 세트
├── src/
│   ├── components/
│   │   ├── DangerBanner.tsx      # 위험도 판정 배너
│   │   ├── MetricCard.tsx        # 수온/코스피 카드
│   │   ├── RamenIndex.tsx        # 라면 지수 카드
│   │   ├── WeeklyChart.tsx       # 7일 차트
│   │   ├── AdUnit.tsx            # AdSense 래퍼
│   │   └── ShareButton.tsx       # Web Share API
│   ├── hooks/
│   │   ├── useHangangTemp.ts     # 수온 데이터 fetch
│   │   ├── useKospi.ts           # 코스피 데이터 fetch
│   │   └── useWeather.ts         # 날씨 데이터 fetch
│   ├── store/
│   │   └── useAppStore.ts        # Zustand 전역 상태
│   ├── utils/
│   │   ├── riskCalculator.ts     # 위험도/라면지수 계산
│   │   └── historyStorage.ts     # 로컬스토리지 히스토리
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Chart.tsx
│   │   ├── Notifications.tsx
│   │   └── Settings.tsx
│   ├── sw/
│   │   └── pushHandler.ts        # Service Worker 푸시 핸들러
│   └── App.tsx
├── docs/
├── .env.example                  # VAPID 키 등 환경변수 예시
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. 데이터 플로우

### 4.1 수온 데이터
```
useHangangTemp
  → fetch 물정보포털 API (직접, CORS 허용)
  → 파싱: 한강대교 측정소 수온값
  → Zustand store 업데이트
  → 갱신: 60분 인터벌 (SWR 패턴)
```

### 4.2 코스피 데이터
```
useKospi
  → fetch /api/kospi (Vercel Edge Function)
  → Edge Function → Yahoo Finance ^KS11
  → 파싱: 현재가, 전일 대비 변동률
  → Zustand store 업데이트
  → 갱신: 15분 인터벌 (장 중)
```

### 4.3 위험도 계산
```
riskCalculator.ts
  input: { temperature: number, kospiChangeRate: number }

  수온 점수: max(0, (20 - temp) * 2.5)     // 0~50
  코스피 점수: max(0, min(50, rate * -10))  // 0~50
  라면 지수: 수온점수 + 코스피점수          // 0~100

  위험도 판정: 조건 매트릭스 (requirements.md 2.1 참조)

  output: { level: 'safe'|'normal'|'caution'|'danger', ramenCount: 0|1|2|3, score: number }
```

---

## 5. PWA 설정

### 5.1 manifest.json
```json
{
  "name": "한강온도",
  "short_name": "한강온도",
  "description": "수온이 낮을수록, 주가가 낮을수록",
  "theme_color": "#ef4444",
  "background_color": "#0f172a",
  "display": "standalone",
  "start_url": "/?source=pwa",
  "icons": [
    { "src": "/icons/192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### 5.2 Service Worker 전략
- 정적 자산: `cache-first` (Workbox 자동)
- API 응답: `stale-while-revalidate`, 최대 1시간
- 오프라인: 캐시 데이터 반환 + 오프라인 배너 표시

---

## 6. Vercel Edge Function (KOSPI 프록시)

```typescript
// api/kospi.ts
export const config = { runtime: 'edge' };

export default async function handler() {
  const url = 'https://query1.finance.yahoo.com/v8/finance/chart/%5EKS11?interval=1d&range=7d';
  const res = await fetch(url);
  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 's-maxage=900', // 15분 캐시
      'Access-Control-Allow-Origin': '*',
    },
  });
}
```

---

## 7. 환경변수

```bash
# .env.example
VITE_WATER_API_KEY=           # 물정보포털 API 키
VITE_WEATHER_API_KEY=         # 기상청 API 키
VITE_ADSENSE_CLIENT=          # ca-pub-XXXXXXXXXXXXXXXX
VITE_ADSENSE_SLOT_A=          # 판정 결과 하단 슬롯
VITE_ADSENSE_SLOT_B=          # 인터스티셜 슬롯
VITE_ADSENSE_SLOT_C=          # 앵커 배너 슬롯
VAPID_PUBLIC_KEY=              # 웹 푸시 공개키
VAPID_PRIVATE_KEY=             # 웹 푸시 비밀키 (서버 전용)
```

---

## 8. 배포 파이프라인

```
git push → GitHub
  → Vercel CI 자동 빌드
    → pnpm build (Vite)
    → TypeScript 타입 체크
    → 정적 파일 CDN 배포
    → Edge Function 배포
  → Preview URL 생성 (PR 단위)
  → main 브랜치 → Production
```
