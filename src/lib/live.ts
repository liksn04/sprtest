import { useEffect, useState } from 'react'

/* 실시간 데이터: 삿포로 날씨(Open-Meteo) + 환율(open.er-api.com). 둘 다 키 불필요·CORS 허용. */

const SAPPORO = { lat: 43.0618, lon: 141.3545 }
export const TRIP_DATES = ['2027-02-04', '2027-02-05', '2027-02-06', '2027-02-07']

function cached<T>(key: string, ttlMs: number): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const { at, data } = JSON.parse(raw)
    return Date.now() - at < ttlMs ? (data as T) : null
  } catch {
    return null
  }
}

function store(key: string, data: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify({ at: Date.now(), data }))
  } catch {
    // ignore
  }
}

export function weatherEmoji(code: number): string {
  if (code === 0) return '☀️'
  if (code <= 2) return '⛅'
  if (code === 3) return '☁️'
  if (code <= 48) return '🌫️'
  if (code <= 67) return '🌧️'
  if (code <= 77) return '🌨️'
  if (code <= 82) return '🌦️'
  if (code <= 86) return '🌨️'
  return '⛈️'
}

export interface CurrentWeather {
  temp: number
  feels: number
  code: number
  snowfall: number
}

export interface DayForecast {
  date: string
  lo: number
  hi: number
  code: number
}

interface WeatherData {
  current: CurrentWeather
  daily: DayForecast[]
}

/** Live Sapporo weather; `tripDaily` is filled once the trip dates enter the 16-day forecast window. */
export function useSapporoWeather() {
  const [data, setData] = useState<WeatherData | null>(() => cached<WeatherData>('weather-cache-v1', 60 * 60 * 1000))

  useEffect(() => {
    if (data) return
    const q = new URLSearchParams({
      latitude: String(SAPPORO.lat),
      longitude: String(SAPPORO.lon),
      current: 'temperature_2m,apparent_temperature,weather_code,snowfall',
      daily: 'temperature_2m_min,temperature_2m_max,weather_code',
      timezone: 'Asia/Tokyo',
      forecast_days: '16',
    })
    fetch(`https://api.open-meteo.com/v1/forecast?${q}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j) => {
        const next: WeatherData = {
          current: {
            temp: Math.round(j.current.temperature_2m),
            feels: Math.round(j.current.apparent_temperature),
            code: j.current.weather_code,
            snowfall: j.current.snowfall,
          },
          daily: (j.daily.time as string[]).map((date, i) => ({
            date,
            lo: Math.round(j.daily.temperature_2m_min[i]),
            hi: Math.round(j.daily.temperature_2m_max[i]),
            code: j.daily.weather_code[i],
          })),
        }
        store('weather-cache-v1', next)
        setData(next)
      })
      .catch(() => {
        // 오프라인/차단 — 평년값 폴백 유지
      })
  }, [data])

  const tripDaily = data ? TRIP_DATES.map((d) => data.daily.find((f) => f.date === d)).filter(Boolean) as DayForecast[] : []
  return { current: data?.current ?? null, tripDaily: tripDaily.length === TRIP_DATES.length ? tripDaily : null }
}

interface FxData {
  rate: number // 원/¥
  date: string
}

/** Live JPY→KRW rate, cached for 12h. */
export function useJpyRate() {
  const [fx, setFx] = useState<FxData | null>(() => cached<FxData>('fx-cache-v1', 12 * 60 * 60 * 1000))

  useEffect(() => {
    if (fx) return
    fetch('https://open.er-api.com/v6/latest/JPY')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j) => {
        const rate = Number(j?.rates?.KRW)
        if (!rate || rate < 5 || rate > 20) return // sanity band
        const next: FxData = { rate: Math.round(rate * 100) / 100, date: j.time_last_update_utc?.slice(5, 16) ?? '' }
        store('fx-cache-v1', next)
        setFx(next)
      })
      .catch(() => {
        // 오프라인 — 기본 환율 유지
      })
  }, [fx])

  return fx
}

export interface LiveFare {
  perPerson: number
  total: number
  fetchedAt: string
}

/** Auto flight quote from our serverless endpoint; null until configured (Amadeus keys) or on failure. */
export function useLiveFare() {
  const [fare, setFare] = useState<LiveFare | null>(() => cached<LiveFare>('fare-cache-v1', 6 * 60 * 60 * 1000))

  useEffect(() => {
    if (fare) return
    fetch('/api/flight-price')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j: LiveFare) => {
        if (!j?.perPerson) return
        store('fare-cache-v1', j)
        setFare(j)
      })
      .catch(() => {
        // 엔드포인트 미구성(키 없음)·아티팩트 환경 — 조용히 숨김
      })
  }, [fare])

  return fare
}
