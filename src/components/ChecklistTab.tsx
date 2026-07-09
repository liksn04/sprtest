import { Check } from 'lucide-react'
import { CHECKLIST } from '../data/trip'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function ChecklistTab() {
  const [checked, setChecked] = useLocalStorage<Record<string, boolean>>('checklist-v1', {})

  const total = CHECKLIST.reduce((n, s) => n + s.items.length, 0)
  const doneCount = CHECKLIST.reduce((n, s) => n + s.items.filter((i) => checked[i.id]).length, 0)

  const toggle = (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="space-y-4 pt-6">
      <div>
        <h1 className="text-xl font-extrabold">체크리스트</h1>
        <p className="mt-0.5 text-xs text-sub">탭해서 체크 — 자동 저장돼요</p>
      </div>

      <section className="rounded-2xl border border-line/60 bg-card p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">전체 진행률</p>
          <p className="text-sm font-bold tabular-nums text-ice">
            {doneCount} / {total}
          </p>
        </div>
        <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full rounded-full bg-ice-deep transition-all"
            style={{ width: `${total ? (doneCount / total) * 100 : 0}%` }}
          />
        </div>
      </section>

      {CHECKLIST.map((section) => {
        const sectionDone = section.items.filter((i) => checked[i.id]).length
        return (
          <section key={section.id} className="rounded-2xl border border-line/60 bg-card p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold">
                {section.emoji} {section.title}
              </h2>
              <span className="text-[11px] tabular-nums text-sub">
                {sectionDone}/{section.items.length}
              </span>
            </div>
            <ul className="mt-3 space-y-1">
              {section.items.map((item) => {
                const isDone = !!checked[item.id]
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => toggle(item.id)}
                      className="flex min-h-[44px] w-full items-start gap-3 rounded-xl px-2 py-2 text-left active:bg-white/5"
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                          isDone ? 'border-ice bg-ice text-page' : 'border-mute/60 text-transparent'
                        }`}
                      >
                        <Check size={13} strokeWidth={3.5} />
                      </span>
                      <span className="min-w-0">
                        <span className={`block text-sm leading-snug ${isDone ? 'text-mute line-through' : ''}`}>
                          {item.label}
                        </span>
                        {item.note && <span className="mt-0.5 block text-[11px] leading-snug text-sub">{item.note}</span>}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
