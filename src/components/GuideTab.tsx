import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, MapPin, MessageCircle } from 'lucide-react'
import { GUIDE, PHRASES, mapUrl } from '../data/trip'

export default function GuideTab() {
  const [open, setOpen] = useState<string | null>(GUIDE[0].id)

  const toggle = (id: string) => setOpen((cur) => (cur === id ? null : id))

  return (
    <div className="space-y-3 pt-8">
      <header className="px-1 pb-1">
        <h1 className="text-[22px] font-extrabold tracking-tight">가이드</h1>
        <p className="mt-1 text-sm text-sub">여행 중 바로 꺼내 보는 현지 정보</p>
      </header>

      {GUIDE.map((section) => {
        const isOpen = open === section.id
        return (
          <section key={section.id} className="overflow-hidden rounded-3xl bg-card shadow-card">
            <button
              onClick={() => toggle(section.id)}
              className="flex min-h-[60px] w-full items-center justify-between px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <h2 className="text-[15px] font-bold">
                {section.emoji} {section.title}
              </h2>
              <ChevronDown
                size={18}
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
                >
                  <div className="space-y-2.5 px-4 pb-4">
                    {section.cards.map((card) => (
                      <div key={card.title} className="rounded-2xl bg-fill p-4">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-bold text-accent">{card.title}</h3>
                          {card.map && (
                            <a
                              href={mapUrl(card.map)}
                              target="_blank"
                              rel="noreferrer"
                              className="press inline-flex min-h-[32px] shrink-0 items-center gap-1 rounded-full bg-accent-soft px-3 text-[11px] font-bold text-accent"
                            >
                              <MapPin size={11} /> 지도
                            </a>
                          )}
                        </div>
                        <ul className="mt-2.5 space-y-1.5">
                          {card.lines.map((line) => (
                            <li key={line} className="flex gap-2 text-[13px] leading-relaxed text-sub">
                              <span aria-hidden className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-mute" />
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
      <section className="rounded-3xl bg-card p-5 shadow-card">
        <div className="flex items-center gap-2">
          <MessageCircle size={16} className="text-onsen" />
          <h2 className="text-[15px] font-bold">여행 일본어 12선</h2>
        </div>
        <ul className="mt-2 divide-y divide-line">
          {PHRASES.map((p) => (
            <li key={p.jp} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="text-sm font-bold leading-snug">{p.jp}</p>
                <p className="mt-0.5 text-xs font-medium text-onsen">{p.read}</p>
              </div>
              <p className="shrink-0 text-right text-xs text-sub">{p.ko}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
