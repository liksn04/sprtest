import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRightLeft, ChevronDown, ReceiptText } from 'lucide-react'
import CountUp from './CountUp'
import { BUDGET, DEFAULT_JPY_RATE, TRIP, fmtKRW } from '../data/trip'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { stagger, rise } from '../lib/motion'

function barColor(ratio: number) {
  if (ratio > 1) return 'var(--color-over)'
  if (ratio > 0.9) return 'var(--color-warn)'
  return 'var(--color-accent)'
}

function Bar({ ratio }: { ratio: number }) {
  const pct = Math.min(ratio, 1) * 100
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-fill">
      <motion.div
        className="h-full rounded-full"
        style={{ background: barColor(ratio) }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 130, damping: 22 }}
      />
    </div>
  )
}

/** Donut gauge: overall budget usage with a count-up % in the center. */
function Gauge({ ratio }: { ratio: number }) {
  const R = 52
  const C = 2 * Math.PI * R
  const clamped = Math.min(ratio, 1)
  return (
    <div className="relative h-[132px] w-[132px] shrink-0">
      <svg viewBox="0 0 132 132" className="h-full w-full -rotate-90">
        <circle cx="66" cy="66" r={R} fill="none" stroke="var(--color-fill)" strokeWidth="12" />
        <motion.circle
          cx="66"
          cy="66"
          r={R}
          fill="none"
          stroke={barColor(ratio)}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C * (1 - clamped) }}
          transition={{ type: 'spring', stiffness: 60, damping: 18 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-2xl font-extrabold tabular-nums leading-none">
          <CountUp value={Math.round(ratio * 100)} format={(n) => String(Math.round(n))} />
          <span className="text-sm font-bold">%</span>
        </p>
        <p className="mt-1 text-[10px] font-medium text-mute">사용</p>
      </div>
    </div>
  )
}

export default function BudgetTab() {
  const [spent, setSpent] = useLocalStorage<Record<string, number>>('budget-spent-v1', {})
  const [jpy, setJpy] = useLocalStorage<number>('jpy-amount-v1', 1000)
  const [rate, setRate] = useLocalStorage<number>('jpy-rate-v1', DEFAULT_JPY_RATE)
  const [open, setOpen] = useState<Record<string, boolean>>({})

  const totalPlanned = TRIP.totalBudget
  const totalSpent = BUDGET.reduce((sum, c) => sum + (spent[c.id] ?? 0), 0)
  const totalRatio = totalSpent / totalPlanned
  const remain = totalPlanned - totalSpent

  const setCategory = (id: string, raw: string) => {
    const n = Math.max(0, Number(raw.replaceAll(',', '')) || 0)
    setSpent((prev) => ({ ...prev, [id]: n }))
  }

  const toggleOpen = (id: string) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <motion.div className="space-y-4 pt-8" variants={stagger} initial="hidden" animate="show">
      <motion.header variants={rise} className="px-1">
        <h1 className="text-[22px] font-extrabold tracking-tight">예산</h1>
        <p className="mt-1 text-sm text-sub">지출을 입력하면 자동 저장돼요 · 원 단위, 2인 합계</p>
      </motion.header>

      {/* total gauge */}
      <motion.section variants={rise} className="rounded-[28px] bg-card p-6 shadow-card">
        <div className="flex items-center gap-5">
          <Gauge ratio={totalRatio} />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-mute">지금까지 쓴 돈</p>
            <p className="mt-1 text-[26px] font-extrabold tabular-nums leading-tight tracking-tight">
              <CountUp value={totalSpent} format={(n) => Math.round(n).toLocaleString('ko-KR')} />
              <span className="text-base font-bold">원</span>
            </p>
            <p className={`mt-2 text-xs font-bold tabular-nums ${remain >= 0 ? 'text-accent' : 'text-over'}`}>
              {remain >= 0 ? `${fmtKRW(remain)} 남음` : `${fmtKRW(-remain)} 초과`}
            </p>
            <p className="mt-0.5 text-[11px] tabular-nums text-mute">
              예산 {fmtKRW(totalPlanned)} · 인당 {fmtKRW(totalPlanned / 2)}
            </p>
          </div>
        </div>
      </motion.section>

      {/* per-category */}
      <motion.section variants={rise} className="space-y-2.5">
        {BUDGET.map((c) => {
          const s = spent[c.id] ?? 0
          const ratio = s / c.planned
          const isOpen = !!open[c.id]
          return (
            <div key={c.id} className="rounded-3xl bg-card p-4 shadow-card">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-bold">{c.label}</p>
                  <p className="mt-0.5 truncate text-[11px] text-mute">{c.note}</p>
                </div>
                <label className="flex shrink-0 items-center gap-1 rounded-2xl bg-fill px-3 py-2">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={s === 0 ? '' : s}
                    placeholder="0"
                    onChange={(e) => setCategory(c.id, e.target.value)}
                    className="w-24 bg-transparent text-right text-sm font-bold tabular-nums text-ink outline-none placeholder:text-mute"
                  />
                  <span className="text-xs font-medium text-sub">원</span>
                </label>
              </div>
              <div className="mt-3.5 flex items-center gap-2.5">
                <div className="flex-1">
                  <Bar ratio={ratio} />
                </div>
                <span
                  className={`w-24 text-right text-[11px] tabular-nums ${ratio > 1 ? 'font-bold text-over' : 'text-mute'}`}
                >
                  {ratio > 1 ? `+${fmtKRW(s - c.planned)}` : `/ ${fmtKRW(c.planned)}`}
                </span>
              </div>

              {/* estimate breakdown */}
              <button
                onClick={() => toggleOpen(c.id)}
                aria-expanded={isOpen}
                className="press mt-3 flex min-h-[36px] w-full items-center justify-between rounded-xl bg-fill px-3"
              >
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sub">
                  <ReceiptText size={12} /> 산정 내역 {c.lines.length}건
                </span>
                <ChevronDown
                  size={14}
                  className={`text-mute transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.3, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <ul className="mt-1 divide-y divide-line px-1">
                      {c.lines.map((line) => (
                        <li key={line.label} className="flex items-start justify-between gap-3 py-2.5">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold leading-snug">{line.label}</p>
                            {line.note && <p className="mt-0.5 text-[10px] leading-snug text-mute">{line.note}</p>}
                          </div>
                          <p className="shrink-0 text-xs font-bold tabular-nums">{fmtKRW(line.amount)}</p>
                        </li>
                      ))}
                      <li className="flex items-center justify-between py-2.5">
                        <p className="text-xs font-bold text-sub">계획 합계</p>
                        <p className="text-xs font-extrabold tabular-nums text-accent">{fmtKRW(c.planned)}</p>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </motion.section>

      {/* converter */}
      <motion.section variants={rise} className="rounded-3xl bg-card p-5 shadow-card">
        <div className="flex items-center gap-2">
          <ArrowRightLeft size={16} className="text-accent" />
          <h2 className="text-[15px] font-bold">엔화 계산기</h2>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <label className="flex flex-1 items-center gap-1.5 rounded-2xl bg-fill px-3.5 py-3">
            <span className="text-sm font-bold text-sub">¥</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={jpy === 0 ? '' : jpy}
              placeholder="0"
              onChange={(e) => setJpy(Math.max(0, Number(e.target.value) || 0))}
              className="w-full bg-transparent text-base font-bold tabular-nums outline-none placeholder:text-mute"
            />
          </label>
          <span className="font-medium text-mute">=</span>
          <p className="flex-1 rounded-2xl bg-accent-soft px-3.5 py-3 text-right text-base font-extrabold tabular-nums text-accent">
            {fmtKRW(jpy * rate)}
          </p>
        </div>
        <label className="mt-3 flex items-center justify-between text-xs text-sub">
          <span>적용 환율 (원/¥) — 수정 가능</span>
          <input
            type="number"
            inputMode="decimal"
            step={0.1}
            min={0}
            value={rate}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
            className="w-16 rounded-xl bg-fill px-2 py-1.5 text-right font-bold tabular-nums text-ink outline-none"
          />
        </label>
      </motion.section>
    </motion.div>
  )
}
