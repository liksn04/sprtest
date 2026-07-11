import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRightLeft, ChevronDown, ReceiptText, Sparkles, Plus, X, RefreshCw } from 'lucide-react'
import CountUp from './CountUp'
import PriceWatch from './PriceWatch'
import { BUDGET, DEFAULT_JPY_RATE, FLIGHT_SCENARIOS, TRIP, fmtKRW } from '../data/trip'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useJpyRate } from '../lib/live'
import { stagger, rise } from '../lib/motion'

interface Expense {
  id: string
  cat: string
  krw: number
  jpy?: number
  at: string
}

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

const fmtDate = (iso: string) => {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export default function BudgetTab() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses-v1', [])
  const [jpy, setJpy] = useLocalStorage<number>('jpy-amount-v1', 1000)
  const [rate, setRate] = useLocalStorage<number>('jpy-rate-v1', DEFAULT_JPY_RATE)
  const [rateManual, setRateManual] = useLocalStorage<boolean>('jpy-rate-manual-v1', false)
  const [scenarioId, setScenarioId] = useLocalStorage<string>('flight-scenario-v1', 'deal')
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const [addFor, setAddFor] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [draftCur, setDraftCur] = useState<'KRW' | 'JPY'>('KRW')

  const fx = useJpyRate()

  // 실시간 환율 자동 적용 (사용자가 직접 수정한 경우 제외)
  useEffect(() => {
    if (fx && !rateManual && fx.rate !== rate) setRate(fx.rate)
  }, [fx, rateManual]) // eslint-disable-line react-hooks/exhaustive-deps

  // 구버전(카테고리 합계 입력) 데이터를 건별 기록으로 이관
  const migrated = useRef(false)
  useEffect(() => {
    if (migrated.current) return
    migrated.current = true
    try {
      const raw = localStorage.getItem('budget-spent-v1')
      if (!raw) return
      const legacy = JSON.parse(raw) as Record<string, number>
      const entries = Object.entries(legacy)
        .filter(([, v]) => v > 0)
        .map(([cat, v]) => ({ id: `legacy-${cat}`, cat, krw: v, at: new Date().toISOString() }))
      if (entries.length) setExpenses((prev) => (prev.length ? prev : entries))
      localStorage.removeItem('budget-spent-v1')
    } catch {
      // ignore
    }
  }, [setExpenses])

  const scenario = FLIGHT_SCENARIOS.find((s) => s.id === scenarioId) ?? FLIGHT_SCENARIOS[0]
  const cats = BUDGET.map((c) =>
    c.id === 'flight' ? { ...c, planned: scenario.total, note: scenario.tagline, lines: scenario.lines } : c,
  )

  const spentBy = useMemo(() => {
    const m: Record<string, number> = {}
    for (const e of expenses) m[e.cat] = (m[e.cat] ?? 0) + e.krw
    return m
  }, [expenses])

  const totalPlanned = cats.reduce((sum, c) => sum + c.planned, 0)
  const baselineDelta = totalPlanned - TRIP.totalBudget
  const totalSpent = expenses.reduce((sum, e) => sum + e.krw, 0)
  const totalRatio = totalSpent / totalPlanned
  const remain = totalPlanned - totalSpent

  const addExpense = (cat: string) => {
    const n = Number(draft.replaceAll(',', ''))
    if (!n || n <= 0) return
    const krw = draftCur === 'JPY' ? Math.round(n * rate) : n
    setExpenses((prev) => [
      ...prev,
      { id: `${Date.now()}`, cat, krw, jpy: draftCur === 'JPY' ? n : undefined, at: new Date().toISOString() },
    ])
    setDraft('')
    setAddFor(null)
  }

  const toggleOpen = (id: string) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <motion.div className="space-y-4 pt-8" variants={stagger} initial="hidden" animate="show">
      <motion.header variants={rise} className="px-1">
        <h1 className="text-[22px] font-extrabold tracking-tight">예산</h1>
        <p className="mt-1 text-sm text-sub">지출은 건별로 기록돼요 · ¥ 입력 시 자동 환산</p>
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
            {baselineDelta !== 0 && (
              <p className={`mt-1 text-[11px] font-bold tabular-nums ${baselineDelta > 0 ? 'text-warn' : 'text-accent'}`}>
                기준 300만 대비 {baselineDelta > 0 ? '+' : '−'}
                {fmtKRW(Math.abs(baselineDelta))} · {scenario.label} 기준
              </p>
            )}
          </div>
        </div>
      </motion.section>

      {/* flight deal radar */}
      <motion.div variants={rise}>
        <PriceWatch />
      </motion.div>

      {/* per-category */}
      <motion.section variants={rise} className="space-y-2.5">
        {cats.map((c) => {
          const s = spentBy[c.id] ?? 0
          const catExpenses = expenses.filter((e) => e.cat === c.id)
          const ratio = s / c.planned
          const isOpen = !!open[c.id]
          const adding = addFor === c.id
          return (
            <div key={c.id} className="rounded-3xl bg-card p-4 shadow-card">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-bold">{c.label}</p>
                  <p className="mt-0.5 truncate text-[11px] text-mute">{c.note}</p>
                </div>
                <p className="shrink-0 text-right">
                  <span className="text-sm font-extrabold tabular-nums">{fmtKRW(s)}</span>
                  <span className="block text-[10px] tabular-nums text-mute">/ {fmtKRW(c.planned)}</span>
                </p>
              </div>

              {c.id === 'flight' && (
                <div className="mt-3.5 grid grid-cols-2 gap-1.5">
                  {FLIGHT_SCENARIOS.map((sc) => {
                    const active = sc.id === scenario.id
                    return (
                      <button
                        key={sc.id}
                        onClick={() => setScenarioId(sc.id)}
                        aria-pressed={active}
                        className={`press relative min-h-[54px] rounded-2xl px-2.5 py-2 text-left transition-colors ${
                          active ? 'bg-accent text-white' : 'bg-fill text-sub'
                        }`}
                      >
                        <span className="flex items-center gap-1 text-xs font-bold">
                          {sc.label}
                          {sc.recommended && <Sparkles size={11} className={active ? 'text-white/80' : 'text-warn'} />}
                        </span>
                        <span
                          className={`mt-0.5 block text-[11px] font-bold tabular-nums ${active ? 'text-white/85' : 'text-mute'}`}
                        >
                          인당 {Math.round(sc.perPerson / 10_000)}만 · 총 {Math.round(sc.total / 10_000)}만
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}

              <div className="mt-3.5">
                <Bar ratio={ratio} />
              </div>

              {/* actions */}
              <div className="mt-3 flex gap-1.5">
                <button
                  onClick={() => {
                    setAddFor(adding ? null : c.id)
                    setDraft('')
                  }}
                  className={`press flex min-h-[36px] flex-1 items-center justify-center gap-1 rounded-xl text-[11px] font-bold ${
                    adding ? 'bg-accent text-white' : 'bg-accent-soft text-accent'
                  }`}
                >
                  <Plus size={12} strokeWidth={2.8} /> 지출 기록
                </button>
                <button
                  onClick={() => toggleOpen(c.id)}
                  aria-expanded={isOpen}
                  className="press flex min-h-[36px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-fill text-[11px] font-bold text-sub"
                >
                  <ReceiptText size={12} /> 내역 {c.lines.length + catExpenses.length}건
                  <ChevronDown size={13} className={`text-mute transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* quick add */}
              <AnimatePresence initial={false}>
                {adding && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18, ease: [0.3, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="flex overflow-hidden rounded-xl bg-fill p-0.5">
                        {(['KRW', 'JPY'] as const).map((cur) => (
                          <button
                            key={cur}
                            onClick={() => setDraftCur(cur)}
                            className={`min-h-[34px] rounded-[10px] px-2.5 text-[11px] font-bold ${
                              draftCur === cur ? 'bg-card text-ink shadow-card' : 'text-mute'
                            }`}
                          >
                            {cur === 'KRW' ? '₩' : '¥'}
                          </button>
                        ))}
                      </div>
                      <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        autoFocus
                        value={draft}
                        placeholder={draftCur === 'JPY' ? '엔화 금액' : '원화 금액'}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addExpense(c.id)}
                        className="min-w-0 flex-1 rounded-xl bg-fill px-3 py-2 text-sm font-bold tabular-nums outline-none placeholder:font-medium placeholder:text-mute"
                      />
                      <button
                        onClick={() => addExpense(c.id)}
                        className="press flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl bg-accent text-white"
                        aria-label="지출 추가"
                      >
                        <Plus size={16} strokeWidth={2.8} />
                      </button>
                    </div>
                    {draftCur === 'JPY' && Number(draft) > 0 && (
                      <p className="mt-1.5 px-1 text-[11px] font-medium tabular-nums text-mute">
                        ≈ {fmtKRW(Math.round(Number(draft) * rate))} (환율 {rate})
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* breakdown: expenses + estimates */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.3, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    {catExpenses.length > 0 && (
                      <ul className="mt-2 divide-y divide-line px-1">
                        {catExpenses.map((e) => (
                          <li key={e.id} className="flex items-center justify-between gap-2 py-2">
                            <span className="text-[11px] font-medium text-mute">{fmtDate(e.at)}</span>
                            <span className="flex items-center gap-2">
                              <span className="text-xs font-bold tabular-nums">
                                {e.jpy ? `¥${e.jpy.toLocaleString()} → ` : ''}
                                {fmtKRW(e.krw)}
                              </span>
                              <button
                                onClick={() => setExpenses((prev) => prev.filter((x) => x.id !== e.id))}
                                aria-label="지출 삭제"
                                className="press p-1 text-mute"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="mt-2 px-1 text-[10px] font-bold tracking-wide text-mute">산정 근거</p>
                    <ul className="divide-y divide-line px-1">
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRightLeft size={16} className="text-accent" />
            <h2 className="text-[15px] font-bold">엔화 계산기</h2>
          </div>
          {fx && (
            <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[10px] font-bold tabular-nums text-accent">
              실시간 {fx.rate}원/¥
            </span>
          )}
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
        <div className="mt-3 flex items-center justify-between text-xs text-sub">
          <span>적용 환율 (원/¥)</span>
          <span className="flex items-center gap-1.5">
            {rateManual && fx && (
              <button
                onClick={() => {
                  setRateManual(false)
                  setRate(fx.rate)
                }}
                className="press inline-flex min-h-[30px] items-center gap-1 rounded-full bg-accent-soft px-2.5 text-[10px] font-bold text-accent"
              >
                <RefreshCw size={10} /> 실시간으로
              </button>
            )}
            <input
              type="number"
              inputMode="decimal"
              step={0.1}
              min={0}
              value={rate}
              onChange={(e) => {
                setRateManual(true)
                setRate(Math.max(0, Number(e.target.value) || 0))
              }}
              className="w-16 rounded-xl bg-fill px-2 py-1.5 text-right font-bold tabular-nums text-ink outline-none"
            />
          </span>
        </div>
      </motion.section>
    </motion.div>
  )
}
