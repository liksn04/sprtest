import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, MapPin, MessageCircle } from 'lucide-react'
import { GUIDE, PHRASES, mapUrl } from '../data/trip'

export default function GuideTab() {
  const [open, setOpen] = useState<string | null>(GUIDE[0].id)

  const toggle = (id: string) => setOpen((cur) => (cur === id ? null : id))

  return (
    <div className="space-y-3 pt-6">
      <div>
        <h1 className="text-xl font-extrabold">가이드</h1>
        <p className="mt-0.5 text-xs text-sub">여행 중 바로 꺼내 보는 현지 정보</p>
      </div>

      {GUIDE.map((section) => {
        const isOpen = open === section.id
        return (
          <section key={section.id} className="overflow-hidden rounded-2xl border border-line/60 bg-card">
            <button
              onClick={() => toggle(section.id)}
              className="flex min-h-[56px] w-full items-center justify-between px-4 py-3 text-left"
              aria-expanded={isOpen}
            >
              <h2 className="text-[15px] font-bold">
                {section.emoji} {section.title}
              </h2>
              <ChevronDown size={18} className={`text-mute transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <div className="space-y-2.5 px-4 pb-4">
                    {section.cards.map((card) => (
                      <div key={card.title} className="rounded-xl bg-white/4 p-3.5">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-bold text-ice">{card.title}</h3>
                          {card.map && (
                            <a
                              href={mapUrl(card.map)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex min-h-[32px] shrink-0 items-center gap-1 rounded-full bg-white/6 px-2.5 text-[11px] font-medium text-ice"
                            >
                              <MapPin size={11} /> 지도
                            </a>
                          )}
                        </div>
                        <ul className="mt-2 space-y-1.5">
                          {card.lines.map((line) => (
                            <li key={line} className="flex gap-2 text-[13px] leading-relaxed text-sub">
                              <span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-mute" />
                              <span>{line}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )
      })}

      {/* phrases */}
      <section className="rounded-2xl border border-line/60 bg-card p-4">
        <div className="flex items-center gap-2">
          <MessageCircle size={16} className="text-onsen" />
          <h2 className="text-[15px] font-bold">여행 일본어 12선</h2>
        </div>
        <ul className="mt-3 divide-y divide-line/50">
          {PHRASES.map((p) => (
            <li key={p.jp} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-snug">{p.jp}</p>
                <p className="mt-0.5 text-xs text-onsen">{p.read}</p>
              </div>
              <p className="shrink-0 text-right text-xs text-sub">{p.ko}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
