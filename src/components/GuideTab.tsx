import { motion } from 'motion/react'
import { MapPin, Clock, Lightbulb, TrainFront } from 'lucide-react'
import { VENUES, FOOD_SPOTS, TRANSIT, TRANSIT_TIP, mapUrl, type Venue } from '../data/trip'
import { stagger, rise } from '../lib/motion'

const VENUE_GRADIENT: Record<Venue['id'], string> = {
  odori: 'linear-gradient(135deg, #1b64da 0%, #3182f6 100%)',
  susukino: 'linear-gradient(135deg, #4a3aa7 0%, #7a6ce0 100%)',
  tsudome: 'linear-gradient(135deg, #0d8a60 0%, #1baf7a 100%)',
  jozankei: 'linear-gradient(135deg, #c2410c 0%, #f0885a 100%)',
}

export default function GuideTab() {
  return (
    <motion.div className="space-y-5 pt-8" variants={stagger} initial="hidden" animate="show">
      <motion.header variants={rise} className="px-1">
        <h1 className="text-[22px] font-extrabold tracking-tight">가이드</h1>
        <p className="mt-1 text-sm text-sub">여행 중 바로 꺼내 보는 현지 정보</p>
      </motion.header>

      {/* venue carousel */}
      <motion.section variants={rise}>
        <h2 className="px-1 text-[15px] font-bold">❄️ 눈축제 회장 & 온천</h2>
        <p className="mt-0.5 px-1 text-xs text-mute">옆으로 넘겨보세요</p>
        <div className="no-scrollbar -mx-4 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
          {VENUES.map((v) => (
            <article
              key={v.id}
              className="w-[76%] shrink-0 snap-center overflow-hidden rounded-3xl bg-card shadow-card"
            >
              <div className="relative flex h-[92px] items-end p-4" style={{ background: VENUE_GRADIENT[v.id] }}>
                <span className="absolute right-3 top-3 text-3xl drop-shadow-sm">{v.emoji}</span>
                <div>
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                    {v.tag}
                  </span>
                  <h3 className="mt-1 text-lg font-extrabold text-white">{v.name}</h3>
                </div>
              </div>
              <div className="p-4">
                <ul className="space-y-1.5">
                  {v.lines.map((line) => (
                    <li key={line} className="flex gap-2 text-xs leading-relaxed text-sub">
                      <span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-mute" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={mapUrl(v.map)}
                  target="_blank"
                  rel="noreferrer"
                  className="press mt-3 inline-flex min-h-[34px] items-center gap-1 rounded-full bg-accent-soft px-3.5 text-xs font-bold text-accent"
                >
                  <MapPin size={12} /> 지도 보기
                </a>
              </div>
            </article>
          ))}
        </div>
      </motion.section>

      {/* food grid */}
      <motion.section variants={rise}>
        <h2 className="px-1 text-[15px] font-bold">🍜 먹킷리스트</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {FOOD_SPOTS.map((f) => (
            <a
              key={f.name}
              href={mapUrl(f.map)}
              target="_blank"
              rel="noreferrer"
              className="press rounded-3xl bg-card p-4 shadow-card"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fill text-2xl">{f.emoji}</span>
              <p className="mt-3 text-sm font-bold leading-snug">{f.name}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-sub">{f.desc}</p>
              <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-accent">
                <MapPin size={11} /> 지도
              </p>
            </a>
          ))}
        </div>
      </motion.section>

      {/* transit diagram */}
      <motion.section variants={rise} className="rounded-3xl bg-card p-5 shadow-card">
        <div className="flex items-center gap-2">
          <TrainFront size={16} className="text-accent" />
          <h2 className="text-[15px] font-bold">교통 한눈에</h2>
        </div>
        <div className="mt-4 space-y-4">
          {TRANSIT.map((t) => (
            <div key={`${t.from}-${t.to}`}>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-accent bg-card" />
                <span className="text-sm font-bold">{t.from}</span>
                <span className="relative mx-1 h-px flex-1 bg-line">
                  <span className="absolute -right-0.5 -top-[3px] border-y-4 border-l-[6px] border-y-transparent border-l-line" />
                </span>
                <span className="text-sm font-bold">{t.to}</span>
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 pl-5">
                <span className="rounded-full bg-fill px-2 py-0.5 text-[10px] font-bold text-sub">{t.mode}</span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-fill px-2 py-0.5 text-[10px] font-bold tabular-nums text-sub">
                  <Clock size={9} /> {t.minutes}분
                </span>
                <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-bold tabular-nums text-accent">
                  {t.fare}
                </span>
                {t.note && <span className="text-[10px] font-medium text-onsen">{t.note}</span>}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 flex items-start gap-1.5 rounded-2xl bg-fill px-3.5 py-2.5 text-xs leading-relaxed text-sub">
          <Lightbulb size={13} className="mt-0.5 shrink-0 text-onsen" />
          <span>{TRANSIT_TIP}</span>
        </p>
      </motion.section>
    </motion.div>
  )
}
