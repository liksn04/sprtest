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

const pad = (n: number) => String(n).padStart(2, '0')

/** Big D-day figure + live clock, styled for the gradient hero. */
export default function Countdown() {
  const target = new Date(TRIP.departAt).getTime()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const t = diffParts(target, now)

  if (t.over) {
    return <p className="text-2xl font-extrabold text-white">여행이 시작됐어요! ❄️</p>
  }

  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <p className="text-xs font-semibold text-white/70">출발까지</p>
        <p className="mt-0.5 text-[44px] font-extrabold leading-none tracking-tight text-white">
          D-{t.days}
        </p>
      </div>
      <div className="rounded-2xl bg-white/16 px-3.5 py-2.5 backdrop-blur-sm">
        <p className="text-lg font-bold tabular-nums leading-none text-white">
          {pad(t.hours)}:{pad(t.mins)}:{pad(t.secs)}
        </p>
        <p className="mt-1 text-center text-[10px] font-medium text-white/70">시간 · 분 · 초</p>
      </div>
    </div>
  )
}
