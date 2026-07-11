import { useState } from 'react'
import { motion } from 'motion/react'
import { Radar, Plus, X, ExternalLink, Zap } from 'lucide-react'
import { FLIGHT_LINKS, FLIGHT_TARGET, fmtKRW } from '../data/trip'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useLiveFare } from '../lib/live'

interface PricePoint {
  d: string // ISO date
  p: number // 인당 왕복, 원
}

const fmtDate = (iso: string) => {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

/** Logged-price trend line with the target price as a dashed reference. */
function TrendChart({ logs }: { logs: PricePoint[] }) {
  const W = 320
  const H = 110
  const PX = 14
  const PY = 16
  const values = logs.map((l) => l.p)
  const lo = Math.min(FLIGHT_TARGET, ...values)
  const hi = Math.max(FLIGHT_TARGET, ...values)
  const span = Math.max(hi - lo, 50_000)
  const min = lo - span * 0.12
  const max = hi + span * 0.12
  const x = (i: number) => (logs.length === 1 ? W / 2 : PX + (i * (W - 2 * PX)) / (logs.length - 1))
  const y = (v: number) => PY + (1 - (v - min) / (max - min)) * (H - 2 * PY)
  const pts = logs.map((l, i) => `${x(i)},${y(l.p)}`).join(' ')
  const ty = y(FLIGHT_TARGET)
  const last = logs[logs.length - 1]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 w-full" role="img" aria-label="기록한 항공권 가격 추세와 목표가">
      {/* target reference */}
      <line x1={PX} x2={W - PX} y1={ty} y2={ty} stroke="var(--color-mute)" strokeWidth="1" strokeDasharray="4 4" opacity="0.7" />
      <text x={PX} y={ty - 5} textAnchor="start" fontSize="9" fontWeight={700} fill="var(--color-mute)">
        목표 {Math.round(FLIGHT_TARGET / 10_000)}만
      </text>

      {logs.length >= 2 && (
        <motion.polyline
          points={pts}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      )}
      {logs.map((l, i) => (
        <circle key={l.d + i} cx={x(i)} cy={y(l.p)} r={i === logs.length - 1 ? 4 : 2.5} fill="var(--color-accent)" stroke="var(--color-card)" strokeWidth="1.5" />
      ))}
      {last && (
        <text x={x(logs.length - 1)} y={y(last.p) - 8} textAnchor={logs.length === 1 ? 'middle' : 'end'} fontSize="10" fontWeight={800} fill="var(--color-ink)">
          {Math.round(last.p / 10_000)}만
        </text>
      )}
    </svg>
  )
}

/** Flight deal radar: one-tap live searches + a personal price log. */
export default function PriceWatch() {
  const [logs, setLogs] = useLocalStorage<PricePoint[]>('flight-price-log-v1', [])
  const [draft, setDraft] = useState('')
  const liveFare = useLiveFare()

  const add = () => {
    const p = Number(draft.replaceAll(',', ''))
    if (!p || p <= 0) return
    setLogs((prev) => [...prev, { d: new Date().toISOString(), p }].slice(-12))
    setDraft('')
  }
  const removeAt = (i: number) => setLogs((prev) => prev.filter((_, idx) => idx !== i))

  const last = logs[logs.length - 1]
  const diff = last ? last.p - FLIGHT_TARGET : null

  return (
    <section className="rounded-3xl bg-card p-5 shadow-card">
      <div className="flex items-center gap-2">
        <Radar size={16} className="text-accent" />
        <h2 className="text-[15px] font-bold">항공권 특가 레이더</h2>
      </div>
      <p className="mt-1 text-[11px] leading-relaxed text-mute">
        2/4 출발 · 2/7 귀국 · 성인 2명이 미리 입력된 실시간 검색이에요. 본 최저가(인당 왕복)를 기록해두면 추세를 그려드려요.
      </p>

      {/* one-tap live searches */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {FLIGHT_LINKS.map((l) => (
          <a
            key={l.name}
            href={l.url}
            target="_blank"
            rel="noreferrer"
            className="press inline-flex min-h-[34px] items-center gap-1 rounded-full bg-fill px-3 text-[11px] font-bold text-sub"
          >
            {l.name} <ExternalLink size={10} className="text-mute" />
          </a>
        ))}
      </div>

      {/* live quote (Amadeus serverless — 키 설정 시 활성화) */}
      {liveFare && (
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-accent-soft px-3.5 py-2.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-accent">
            <Zap size={12} /> 자동 조회 최저가 · 인당 {fmtKRW(liveFare.perPerson)}
          </span>
          <button
            onClick={() =>
              setLogs((prev) => [...prev, { d: liveFare.fetchedAt, p: liveFare.perPerson }].slice(-12))
            }
            className="press min-h-[30px] rounded-full bg-accent px-2.5 text-[10px] font-bold text-white"
          >
            기록에 추가
          </button>
        </div>
      )}

      {/* status */}
      {last && (
        <div
          className={`mt-4 rounded-2xl px-3.5 py-2.5 text-xs font-bold ${
            diff !== null && diff <= 0 ? 'bg-accent-soft text-accent' : 'bg-fill text-sub'
          }`}
        >
          {diff !== null && diff <= 0
            ? `🎯 목표가 도달! 지금이 결제 타이밍이에요 (목표 대비 ${fmtKRW(-diff)} 저렴)`
            : `최근 기록 ${fmtKRW(last.p)} — 목표가까지 ${fmtKRW(diff!)} 남았어요`}
        </div>
      )}

      {/* trend */}
      {logs.length > 0 && <TrendChart logs={logs} />}

      {/* log input */}
      <div className="mt-3 flex items-center gap-2">
        <label className="flex flex-1 items-center gap-1 rounded-2xl bg-fill px-3.5 py-2.5">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={draft}
            placeholder="오늘 본 최저가 (인당 왕복)"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            className="w-full bg-transparent text-sm font-bold tabular-nums outline-none placeholder:font-medium placeholder:text-mute"
          />
          <span className="text-xs font-medium text-sub">원</span>
        </label>
        <button
          onClick={add}
          className="press flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-2xl bg-accent text-white"
          aria-label="가격 기록 추가"
        >
          <Plus size={18} strokeWidth={2.6} />
        </button>
      </div>

      {logs.length > 0 && (
        <ul className="mt-2.5 space-y-1">
          {[...logs].reverse().slice(0, 4).map((l, revIdx) => {
            const i = logs.length - 1 - revIdx
            return (
              <li key={l.d + i} className="flex items-center justify-between rounded-xl px-1.5 py-1 text-xs">
                <span className="font-medium text-mute">{fmtDate(l.d)}</span>
                <span className="flex items-center gap-2">
                  <span className="font-bold tabular-nums">{fmtKRW(l.p)}</span>
                  <button onClick={() => removeAt(i)} aria-label="기록 삭제" className="press p-1 text-mute">
                    <X size={12} />
                  </button>
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
