import { useEffect, useState } from 'react'
import { TRIP } from '../data/trip'

function diffParts(target: number, now: number) {
  const ms = Math.max(0, target - now)
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor(ms / 3_600_000) % 24,
    mins: Math.floor(ms / 60_000) % 60,
    secs: Math.floor(ms / 1000) % 60,
    over: target - now <= 0,
  }
}

export default function Countdown() {
  const target = new Date(TRIP.departAt).getTime()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const t = diffParts(target, now)

  if (t.over) {
    return (
      <div className="text-center">
        <p className="text-2xl font-bold text-ice">여행이 시작됐어요! ❄️</p>
      </div>
    )
  }

  const cells = [
    { v: t.days, label: '일' },
    { v: t.hours, label: '시간' },
    { v: t.mins, label: '분' },
    { v: t.secs, label: '초' },
  ]

  return (
    <div>
      <p className="mb-2 text-center text-xs font-medium tracking-widest text-sub">출발까지</p>
      <div className="flex items-stretch justify-center gap-2">
        {cells.map((c) => (
          <div
            key={c.label}
            className="flex min-w-[68px] flex-col items-center rounded-2xl border border-white/10 bg-white/5 px-2 py-3 backdrop-blur-sm"
          >
            <span className="text-2xl font-bold tabular-nums text-ink">{c.v}</span>
            <span className="mt-0.5 text-[11px] text-sub">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
