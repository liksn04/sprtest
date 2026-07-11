// Vercel serverless: PUS→CTS 2027-02-04 / 02-07 성인 2명 최저가 (Amadeus Self-Service API)
// 활성화: Vercel 프로젝트 환경변수에 AMADEUS_CLIENT_ID / AMADEUS_CLIENT_SECRET 설정
// (무료 키 발급: https://developers.amadeus.com — 기본은 test 환경, 운영 전환 시 AMADEUS_HOST=api.amadeus.com)

export default async function handler(req, res) {
  const id = process.env.AMADEUS_CLIENT_ID
  const secret = process.env.AMADEUS_CLIENT_SECRET
  if (!id || !secret) {
    res.status(501).json({ error: 'not_configured' })
    return
  }
  const host = process.env.AMADEUS_HOST || 'test.api.amadeus.com'

  try {
    const tokenRes = await fetch(`https://${host}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'client_credentials', client_id: id, client_secret: secret }),
    })
    if (!tokenRes.ok) throw new Error(`token ${tokenRes.status}`)
    const { access_token } = await tokenRes.json()

    const q = new URLSearchParams({
      originLocationCode: 'PUS',
      destinationLocationCode: 'CTS',
      departureDate: '2027-02-04',
      returnDate: '2027-02-07',
      adults: '2',
      currencyCode: 'KRW',
      max: '10',
    })
    const offersRes = await fetch(`https://${host}/v2/shopping/flight-offers?${q}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
    if (!offersRes.ok) throw new Error(`offers ${offersRes.status}`)
    const data = await offersRes.json()

    const prices = (data.data ?? []).map((o) => Number(o.price?.grandTotal)).filter((n) => n > 0)
    if (!prices.length) {
      res.status(404).json({ error: 'no_offers' })
      return
    }
    const total = Math.round(Math.min(...prices))
    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400')
    res.status(200).json({ total, perPerson: Math.round(total / 2), fetchedAt: new Date().toISOString() })
  } catch {
    res.status(502).json({ error: 'upstream' })
  }
}
