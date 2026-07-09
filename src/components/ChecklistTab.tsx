import { Check } from 'lucide-react'
import { CHECKLIST } from '../data/trip'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function ChecklistTab() {
  const [checked, setChecked] = useLocalStorage<Record<string, boolean>>('checklist-v1', {})

  const total = CHECKLIST.reduce((n, s) => n + s.items.length, 0)
  const doneCount = CHECKLIST.reduce((n, s) => n + s.items.filter((i) => checked[i.id]).length, 0)

  const toggle = (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="space-y-4 pt-8">
      <header className="px-1">
        <h1 className="text-[22px] font-extrabold tracking-tight">체크리스트</h1>
        <p className="mt-1 text-sm text-sub">탭해서 체크 — 자동 저장돼요</p>
      </header>

      <section className="rounded-3xl bg-card p-5 shadow-card">
        <div className="flex items-end justify-between">
          <p className="text-sm font-bold">전체 진행률</p>
          <p className="text-lg font-extrabold tabular-nums leading-none text-accent">
            {doneCount}
            <span className="text-xs font-semibold text-mute"> / {total}</span>
          </p>
        </div>
        <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-fill">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300"
            style={{ width: `${total ? (doneCount / total) * 100 : 0}%` }}
          />
        </div>
      </section>

      {CHECKLIST.map((section) => {
        const sectionDone = section.items.filter((i) => checked[i.id]).length
        return (
          <section key={section.id} className="rounded-3xl bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-bold">
                {section.emoji} {section.title}
              </h2>
              <span className="rounded-full bg-fill px-2.5 py-1 text-[11px] font-bold tabular-nums text-sub">
                {sectionDone}/{section.items.length}
              </span>
            </div>
            <ul className="mt-2.5">
              {section.items.map((item) => {
                const isDone = !!checked[item.id]
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => toggle(item.id)}
                      className="press flex min-h-[48px] w-full items-start gap-3 rounded-2xl px-1.5 py-2.5 text-left"
                    >
                      <span
                        className={`mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-lg transition-colors ${
                          isDone ? 'bg-accent text-white' : 'bg-fill text-transparent'
                        }`}
                      >
                        <Check size={13} strokeWidth={3.5} />
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`block text-sm font-medium leading-snug ${isDone ? 'text-mute line-through' : ''}`}
                        >
                          {item.label}
                        </span>
                        {item.note && (
                          <span className="mt-0.5 block text-[11px] leading-snug text-mute">{item.note}</span>
                        )}
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
