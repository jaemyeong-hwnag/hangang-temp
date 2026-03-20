export const config = { runtime: 'edge' }

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  // In production: store subscription in KV/DB
  // For MVP: just acknowledge
  const body = await req.json()
  console.log('Push subscription received:', JSON.stringify(body).slice(0, 100))

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
