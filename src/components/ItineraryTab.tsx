import { useState } from 'react'
import { MapPin, Lightbulb, Check } from 'lucide-react'
import { ITINERARY, CATEGORY_META, mapUrl } from '../data/trip'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function ItineraryTab() {
  const [day, setDay] = useState(0)
  const [done, setDone] = useLocalStorage<Record<string, boolean>>('itinerary-done-v1', {})
  const plan = ITINERARY[day]

  const toggle = (id: string) => setDone((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="pt-6">
      <h1 className="text-xl font-extrabold">일정</h1>
      <p className="mt-0.5 text-xs text-sub">항목을 탭하면 완료 표시돼요 · 📍는 구글맵으로 연결</p>

      {/* day selector */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {ITINERARY.map((d, i) => {
          const active = i === day
          return (
            <button
              key={d.day}
              onClick={() => setDay(i)}
              className={`min-h-[52px] rounded-2xl border px-1 py-2 text-center transition-colors ${
                active ? 'border-ice/60 bg-ice-deep/20 text-ink' : 'border-line/60 bg-card text-sub'
              }`}
            >
              <span className={`block text-[10px] font-semibold ${active ? 'text-ice' : 'text-mute'}`}>DAY {d.day}</span>
              <span className="block text-sm font-bold">
                {d.date} <span className="text-xs font-medium">({d.dow})</span>
              </span>
            </button>
          )
        })}
      </div>

      <p className="mt-4 text-sm font-bold text-ice">{plan.headline}</p>

      {/* timeline */}
      <ol className="relative mt-3 space-y-3 border-l border-line/70 pl-5">
        {plan.items.map((item) => {
          const meta = CATEGORY_META[item.category]
          const isDone = !!done[item.id]
          return (
            <li key={item.id} className="relative">
              <span
                aria-hidden
                className="absolute -left-[26.5px] top-4 h-3 w-3 rounded-full border-2 border-page"
                style={{ background: meta.color }}
              />
              <div
                className={`rounded-2xl border border-line/60 bg-card p-4 transition-opacity ${isDone ? 'opacity-55' : ''}`}
              >
                <button onClick={() => toggle(item.id)} className="flex w-full items-start gap-3 text-left">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold tabular-nums text-ice">{item.time}</span>
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{ color: meta.color, background: `color-mix(in srgb, ${meta.color} 16%, transparent)` }}
                      >
                        {meta.label}
                      </span>
                    </div>
                    <p className={`mt-1 text-[15px] font-bold leading-snug ${isDone ? 'line-through' : ''}`}>
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-sub">{item.desc}</p>
                  </div>
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                      isDone ? 'border-ice bg-ice text-page' : 'border-line text-transparent'
                    }`}
                  >
                    <Check size={14} strokeWidth={3} />
                  </span>
                </button>
                {(item.tip || item.map) && (
                  <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-line/50 pt-2.5">
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
                        className="inline-flex min-h-[32px] items-center gap-1 rounded-full bg-white/6 px-3 text-xs font-medium text-ice"
                      >
                        <MapPin size={12} /> 지도 보기
                      </a>
                    )}
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
