import { ArrowRightLeft } from 'lucide-react'
import { BUDGET, DEFAULT_JPY_RATE, TRIP, fmtKRW } from '../data/trip'
import { useLocalStorage } from '../hooks/useLocalStorage'

function Bar({ ratio }: { ratio: number }) {
  const pct = Math.min(ratio, 1) * 100
  const over = ratio > 1
  const near = !over && ratio > 0.9
  const color = over ? 'var(--color-over)' : near ? 'var(--color-warn)' : 'var(--color-ice-deep)'
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/8">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

export default function BudgetTab() {
  const [spent, setSpent] = useLocalStorage<Record<string, number>>('budget-spent-v1', {})
  const [jpy, setJpy] = useLocalStorage<number>('jpy-amount-v1', 1000)
  const [rate, setRate] = useLocalStorage<number>('jpy-rate-v1', DEFAULT_JPY_RATE)

  const totalPlanned = TRIP.totalBudget
  const totalSpent = BUDGET.reduce((sum, c) => sum + (spent[c.id] ?? 0), 0)
  const totalRatio = totalSpent / totalPlanned
  const remain = totalPlanned - totalSpent

  const setCategory = (id: string, raw: string) => {
    const n = Math.max(0, Number(raw.replaceAll(',', '')) || 0)
    setSpent((prev) => ({ ...prev, [id]: n }))
  }

  return (
    <div className="space-y-4 pt-6">
      <div>
        <h1 className="text-xl font-extrabold">예산</h1>
        <p className="mt-0.5 text-xs text-sub">지출을 입력하면 자동 저장돼요 (원 단위, 2인 합계)</p>
      </div>

      {/* total */}
      <section className="rounded-3xl border border-line/60 bg-card p-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] text-sub">총지출</p>
            <p className="text-2xl font-extrabold tabular-nums">{fmtKRW(totalSpent)}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-sub">{remain >= 0 ? '남은 예산' : '예산 초과'}</p>
            <p className={`text-sm font-bold tabular-nums ${remain >= 0 ? 'text-ice' : 'text-over'}`}>
              {fmtKRW(Math.abs(remain))}
            </p>
          </div>
        </div>
        <div className="mt-3">
          <Bar ratio={totalRatio} />
        </div>
        <p className="mt-1.5 text-right text-[11px] tabular-nums text-sub">
          {Math.round(totalRatio * 100)}% / 예산 {fmtKRW(totalPlanned)}
        </p>
      </section>

      {/* per-category */}
      <section className="space-y-2.5">
        {BUDGET.map((c) => {
          const s = spent[c.id] ?? 0
          const ratio = s / c.planned
          return (
            <div key={c.id} className="rounded-2xl border border-line/60 bg-card p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-bold">{c.label}</p>
                  <p className="truncate text-[11px] text-sub">{c.note}</p>
                </div>
                <label className="flex shrink-0 items-center gap-1 rounded-xl border border-line/60 bg-page/60 px-2.5 py-1.5">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={s === 0 ? '' : s}
                    placeholder="0"
                    onChange={(e) => setCategory(c.id, e.target.value)}
                    className="w-24 bg-transparent text-right text-sm font-semibold tabular-nums text-ink outline-none placeholder:text-mute"
                  />
                  <span className="text-xs text-sub">원</span>
                </label>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1">
                  <Bar ratio={ratio} />
                </div>
                <span className={`w-20 text-right text-[11px] tabular-nums ${ratio > 1 ? 'font-bold text-over' : 'text-sub'}`}>
                  {ratio > 1 ? `+${fmtKRW(s - c.planned)}` : `/ ${fmtKRW(c.planned)}`}
                </span>
              </div>
            </div>
          )
        })}
      </section>

      {/* converter */}
      <section className="rounded-2xl border border-line/60 bg-card p-4">
        <div className="flex items-center gap-2">
          <ArrowRightLeft size={16} className="text-ice" />
          <h2 className="text-sm font-bold">엔화 계산기</h2>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <label className="flex flex-1 items-center gap-1 rounded-xl border border-line/60 bg-page/60 px-3 py-2.5">
            <span className="text-sm text-sub">¥</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={jpy === 0 ? '' : jpy}
              placeholder="0"
              onChange={(e) => setJpy(Math.max(0, Number(e.target.value) || 0))}
              className="w-full bg-transparent text-base font-semibold tabular-nums outline-none placeholder:text-mute"
            />
          </label>
          <span className="text-sub">=</span>
          <p className="flex-1 rounded-xl bg-ice-deep/15 px-3 py-2.5 text-right text-base font-bold tabular-nums text-ice">
            {fmtKRW(jpy * rate)}
          </p>
        </div>
        <label className="mt-2.5 flex items-center justify-between text-xs text-sub">
          <span>적용 환율 (원/¥) — 수정 가능</span>
          <input
            type="number"
            inputMode="decimal"
            step={0.1}
            min={0}
            value={rate}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
            className="w-16 rounded-lg border border-line/60 bg-page/60 px-2 py-1 text-right font-semibold tabular-nums text-ink outline-none"
          />
        </label>
      </section>
    </div>
  )
}
