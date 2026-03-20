export const config = { runtime: 'edge' }

export default async function handler() {
  const url = 'https://query1.finance.yahoo.com/v8/finance/chart/%5EKS11?interval=1d&range=8d'

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })
    const data = await res.json()

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=900, stale-while-revalidate=1800',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: 'fetch failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
