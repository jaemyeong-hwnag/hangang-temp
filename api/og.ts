// @ts-ignore — @vercel/og types
import { ImageResponse } from '@vercel/og'

export const config = { runtime: 'edge' }

const LEVEL_COLORS: Record<string, string> = {
  safe: '#166534',
  normal: '#92400e',
  caution: '#9a3412',
  danger: '#7f1d1d',
}

const LEVEL_TEXT: Record<string, string> = {
  safe: '안전 🟢',
  normal: '보통 🟡',
  caution: '주의 🟠',
  danger: '위험 🔴',
}

const LEVEL_MSG: Record<string, string> = {
  safe: '오늘은 한강 패스',
  normal: '그럭저럭 버틸만함',
  caution: '라면이나 한 개 끓여두세요',
  danger: '이미 늦었을 수도',
}

export default function handler(req: Request) {
  const { searchParams } = new URL(req.url)
  const level = searchParams.get('level') ?? 'normal'
  const temp = searchParams.get('temp') ?? '--'
  const rate = searchParams.get('rate') ?? '--'
  const ramen = searchParams.get('ramen') ?? '0'

  const bg = LEVEL_COLORS[level] ?? LEVEL_COLORS['normal']
  const levelText = LEVEL_TEXT[level] ?? LEVEL_TEXT['normal']
  const msg = LEVEL_MSG[level] ?? LEVEL_MSG['normal']
  const ramenEmoji = '🍜'.repeat(Math.min(Number(ramen), 3)) || '없음'

  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0f172a',
          padding: '80px',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                width: '100%',
                backgroundColor: bg,
                borderRadius: '32px',
                padding: '60px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              },
              children: [
                {
                  type: 'p',
                  props: {
                    style: { fontSize: '28px', color: '#cbd5e1', margin: 0 },
                    children: '🌡️ 한강온도',
                  },
                },
                {
                  type: 'p',
                  props: {
                    style: { fontSize: '72px', fontWeight: 'bold', color: 'white', margin: 0 },
                    children: levelText,
                  },
                },
                {
                  type: 'p',
                  props: {
                    style: { fontSize: '40px', color: '#e2e8f0', margin: 0 },
                    children: msg,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', gap: '40px', marginTop: '16px' },
                    children: [
                      {
                        type: 'p',
                        props: {
                          style: { fontSize: '32px', color: '#93c5fd', margin: 0 },
                          children: `수온 ${temp}°C`,
                        },
                      },
                      {
                        type: 'p',
                        props: {
                          style: { fontSize: '32px', color: '#fca5a5', margin: 0 },
                          children: `코스피 ${rate}%`,
                        },
                      },
                      {
                        type: 'p',
                        props: {
                          style: { fontSize: '32px', color: '#fde68a', margin: 0 },
                          children: `라면 ${ramenEmoji}`,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
    }
  )
}
