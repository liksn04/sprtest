import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import CountUp from './CountUp'
import BackupCard from './BackupCard'
import { CHECKLIST } from '../data/trip'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { stagger, rise } from '../lib/motion'

/** Small progress ring for a section header. */
function Ring({ done, total }: { done: number; total: number }) {
  const R = 14
  const C = 2 * Math.PI * R
  const ratio = total ? done / total : 0
  return (
    <div className="relative h-9 w-9">
      <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
        <circle cx="18" cy="18" r={R} fill="none" stroke="var(--color-fill)" strokeWidth="3.5" />
        <motion.circle
          cx="18"
          cy="18"
          r={R}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={false}
          animate={{ strokeDashoffset: C * (1 - ratio) }}
          transition={{ type: 'spring', stiffness: 90, damping: 20 }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold tabular-nums text-sub">
        {done}/{total}
      </span>
    </div>
  )
}

export default function ChecklistTab() {
  const [checked, setChecked] = useLocalStorage<Record<string, boolean>>('checklist-v1', {})

  const total = CHECKLIST.reduce((n, s) => n + s.items.length, 0)
  const doneCount = CHECKLIST.reduce((n, s) => n + s.items.filter((i) => checked[i.id]).length, 0)

  const toggle = (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <motion.div className="space-y-4 pt-8" variants={stagger} initial="hidden" animate="show">
      <motion.header variants={rise} className="px-1">
        <h1 className="text-[22px] font-extrabold tracking-tight">체크리스트</h1>
        <p className="mt-1 text-sm text-sub">탭해서 체크 — 자동 저장돼요</p>
      </motion.header>

      <motion.section variants={rise} className="rounded-3xl bg-card p-5 shadow-card">
        <div className="flex items-end justify-between">
          <p className="text-sm font-bold">전체 진행률</p>
          <p className="text-lg font-extrabold tabular-nums leading-none text-accent">
            <CountUp value={doneCount} format={(n) => String(Math.round(n))} duration={0.4} />
            <span className="text-xs font-semibold text-mute"> / {total}</span>
          </p>
        </div>
        <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-fill">
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${total ? (doneCount / total) * 100 : 0}%` }}
            transition={{ type: 'spring', stiffness: 130, damping: 22 }}
          />
        </div>
      </motion.section>

      {CHECKLIST.map((section) => {
        const sectionDone = section.items.filter((i) => checked[i.id]).length
        return (
          <motion.section key={section.id} variants={rise} className="rounded-3xl bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-bold">
                {section.emoji} {section.title}
              </h2>
              <Ring done={sectionDone} total={section.items.length} />
            </div>
            <ul className="mt-1.5">
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
                        <motion.span
                          key={String(isDone)}
                          initial={{ scale: 0.4 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 600, damping: 18 }}
                          className="flex"
                        >
                          <Check size={13} strokeWidth={3.5} />
                        </motion.span>
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
          </motion.section>
        )
      })}

      <motion.div variants={rise}>
        <BackupCard />
      </motion.div>
    </motion.div>
  )
}
