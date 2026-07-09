import { ArrowRightLeft } from 'lucide-react'
import { BUDGET, DEFAULT_JPY_RATE, TRIP, fmtKRW } from '../data/trip'
import { useLocalStorage } from '../hooks/useLocalStorage'

function Bar({ ratio, track }: { ratio: number; track?: string }) {
  const pct = Math.min(ratio, 1) * 100
  const over = ratio > 1
  const near = !over && ratio > 0.9
  const color = over ? 'var(--color-over)' : near ? 'var(--color-warn)' : 'var(--color-accent)'
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full ${track ?? 'bg-fill'}`}>
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${pct}%`, background: color }}
      />
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
    <div className="space-y-4 pt-8">
      <header className="px-1">
        <h1 className="text-[22px] font-extrabold tracking-tight">예산</h1>
        <p className="mt-1 text-sm text-sub">지출을 입력하면 자동 저장돼요 · 원 단위, 2인 합계</p>
      </header>

      {/* total */}
      <section className="rounded-[28px] bg-card p-6 shadow-card">
        <p className="text-xs font-medium text-mute">지금까지 쓴 돈</p>
        <p className="mt-1.5 text-[32px] font-extrabold tabular-nums leading-none tracking-tight">
          {fmtKRW(totalSpent)}
        </p>
        <div className="mt-5">
          <Bar ratio={totalRatio} />
        </div>
        <div className="mt-2.5 flex items-center justify-between text-xs">
          <span className="tabular-nums text-mute">{Math.round(totalRatio * 100)}% 사용</span>
          <span className={`font-bold tabular-nums ${remain >= 0 ? 'text-accent' : 'text-over'}`}>
            {remain >= 0 ? `${fmtKRW(remain)} 남음` : `${fmtKRW(-remain)} 초과`}
          </span>
        </div>
      </section>

      {/* per-category */}
      <section className="space-y-2.5">
        {BUDGET.map((c) => {
          const s = spent[c.id] ?? 0
          const ratio = s / c.planned
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
            </div>
          )
        })}
      </section>

      {/* converter */}
      <section className="rounded-3xl bg-card p-5 shadow-card">
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
      </section>
    </div>
  )
}
