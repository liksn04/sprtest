import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MapPin, Lightbulb, Check } from 'lucide-react'
import { ITINERARY, CATEGORY_META, mapUrl } from '../data/trip'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { stagger, rise } from '../lib/motion'

export default function ItineraryTab() {
  const [day, setDay] = useState(0)
  const [done, setDone] = useLocalStorage<Record<string, boolean>>('itinerary-done-v1', {})
  const plan = ITINERARY[day]

  const toggle = (id: string) => setDone((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="pt-8">
      <header className="px-1">
        <h1 className="text-[22px] font-extrabold tracking-tight">일정</h1>
        <p className="mt-1 text-sm text-sub">항목을 탭하면 완료 표시돼요</p>
      </header>

      {/* day selector */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {ITINERARY.map((d, i) => {
          const active = i === day
          return (
            <button
              key={d.day}
              onClick={() => setDay(i)}
              className={`press relative min-h-[56px] rounded-2xl px-1 py-2.5 text-center ${
                active ? 'text-white' : 'bg-card text-sub shadow-card'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="day-pill"
                  className="absolute inset-0 rounded-2xl bg-accent shadow-card"
                  transition={{ type: 'spring', stiffness: 450, damping: 34 }}
                />
              )}
              <span className="relative">
                <span className={`block text-[10px] font-bold ${active ? 'text-white/75' : 'text-mute'}`}>
                  DAY {d.day}
                </span>
                <span className="mt-0.5 block text-[15px] font-bold">
                  {d.date} <span className="text-xs font-semibold">({d.dow})</span>
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {/* timeline */}
      <AnimatePresence mode="wait">
        <motion.div key={plan.day} variants={stagger} initial="hidden" animate="show" exit={{ opacity: 0, y: -6 }}>
          <motion.p variants={rise} className="mt-5 px-1 text-[15px] font-bold text-accent">
            {plan.headline}
          </motion.p>

          <ol className="mt-3 space-y-3">
            {plan.items.map((item) => {
              const meta = CATEGORY_META[item.category]
              const isDone = !!done[item.id]
              return (
                <motion.li key={item.id} variants={rise}>
                  <div
                    className={`press rounded-3xl bg-card p-4 shadow-card transition-opacity ${isDone ? 'opacity-50' : ''}`}
                  >
                    <button onClick={() => toggle(item.id)} className="flex w-full items-start gap-3 text-left">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold tabular-nums text-accent">{item.time}</span>
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                            style={{
                              color: meta.color,
                              background: `color-mix(in srgb, ${meta.color} 12%, transparent)`,
                            }}
                          >
                            {meta.label}
                          </span>
                        </div>
                        <p className={`mt-1.5 text-[15px] font-bold leading-snug ${isDone ? 'line-through' : ''}`}>
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-sub">{item.desc}</p>
                      </div>
                      <span
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${
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
                          <Check size={14} strokeWidth={3} />
                        </motion.span>
                      </span>
                    </button>
                    {(item.tip || item.map) && (
                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line pt-3">
                        {item.tip && (
                          <p className="flex items-start gap-1.5 text-xs leading-relaxed text-onsen">
                            <Lightbulb size={13} className="mt-0.5 shrink-0" />
                            <span>{item.tip}</span>
                          </p>
                        )}
                        {item.map && (
                          <a
                            href={mapUrl(item.map)}
                            target="_blank"
                            rel="noreferrer"
                            className="press inline-flex min-h-[34px] items-center gap-1 rounded-full bg-accent-soft px-3.5 text-xs font-bold text-accent"
                          >
                            <MapPin size={12} /> 지도 보기
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </motion.li>
              )
            })}
          </ol>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
