import { motion } from 'motion/react'
import { Plane, Snowflake, Wallet, MapPin, Route } from 'lucide-react'
import Countdown from './Countdown'
import SnowEffect from './SnowEffect'
import RouteMap from './RouteMap'
import { TRIP, fmtKRW } from '../data/trip'
import { stagger, rise } from '../lib/motion'

const SUMMARY = [
  { Icon: Plane, tint: 'var(--color-cat-move)', label: '항공', title: '김해 ↔ 신치토세', sub: '직항 약 2시간 20분' },
  { Icon: Wallet, tint: 'var(--color-cat-shop)', label: '기준 예산 (2인)', title: fmtKRW(TRIP.totalBudget), sub: '항공 시나리오는 예산 탭에서' },
  { Icon: MapPin, tint: 'var(--color-cat-onsen)', label: '숙소 동선', title: '삿포로 2박 + 료칸 1박', sub: '스스키노 → 조잔케이' },
  { Icon: Snowflake, tint: 'var(--color-accent)', label: '눈축제', title: TRIP.festival.period, sub: TRIP.festival.note },
]

/* 2월 초 삿포로 기후 평년값 기준 */
const WEATHER = [
  { day: 'DAY 1', lo: -8, hi: -1 },
  { day: 'DAY 2', lo: -9, hi: -2 },
  { day: 'DAY 3', lo: -8, hi: -1 },
  { day: 'DAY 4', lo: -7, hi: 0 },
]
const T_MIN = -12
const T_MAX = 4

function TempRange({ lo, hi }: { lo: number; hi: number }) {
  const left = ((lo - T_MIN) / (T_MAX - T_MIN)) * 100
  const width = ((hi - lo) / (T_MAX - T_MIN)) * 100
  return (
    <div className="relative h-2 w-full rounded-full bg-fill">
      <motion.div
        className="absolute h-2 rounded-full"
        style={{
          left: `${left}%`,
          background: 'linear-gradient(90deg, var(--color-accent-deep) 0%, var(--color-accent) 100%)',
        }}
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: `${width}%`, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.3 }}
      />
    </div>
  )
}

export default function HomeTab() {
  return (
    <motion.div className="space-y-4 pt-8" variants={stagger} initial="hidden" animate="show">
      <motion.header variants={rise} className="px-1">
        <h1 className="text-[22px] font-extrabold leading-snug tracking-tight">곧 떠나요, 삿포로 ❄️</h1>
        <p className="mt-1 text-sm text-sub">
          {TRIP.dateLabel} · {TRIP.travelers}
        </p>
      </motion.header>

      {/* hero */}
      <motion.section variants={rise} className="hero-gradient relative overflow-hidden rounded-[28px] p-6 shadow-card">
        <SnowEffect />
        <div className="relative">
          <span className="inline-flex rounded-full bg-white/16 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
            {TRIP.festival.name}
          </span>
          <h2 className="mt-3 text-[26px] font-extrabold leading-tight text-white">
            {TRIP.title}
            <span className="mt-0.5 block text-sm font-medium text-white/75">{TRIP.subtitle}</span>
          </h2>
          <div className="mt-7">
            <Countdown />
          </div>
        </div>
      </motion.section>

      {/* journey map */}
      <motion.section variants={rise} className="rounded-3xl bg-card p-5 shadow-card">
        <div className="flex items-center gap-2">
          <Route size={17} className="text-accent" />
          <h2 className="text-[15px] font-bold">여행 동선</h2>
        </div>
        <div className="mt-2">
          <RouteMap />
        </div>
      </motion.section>

      {/* summary cards */}
      <motion.section variants={rise} className="grid grid-cols-2 gap-3">
        {SUMMARY.map(({ Icon, tint, label, title, sub }) => (
          <div key={label} className="press rounded-3xl bg-card p-4 shadow-card">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-2xl"
              style={{ background: `color-mix(in srgb, ${tint} 13%, transparent)` }}
            >
              <Icon size={19} style={{ color: tint }} />
            </span>
            <p className="mt-3 text-[11px] font-medium text-mute">{label}</p>
            <p className="mt-0.5 text-[15px] font-bold leading-snug">{title}</p>
            <p className="mt-0.5 text-xs text-sub">{sub}</p>
          </div>
        ))}
      </motion.section>

      {/* weather */}
      <motion.section variants={rise} className="rounded-3xl bg-card p-5 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold">🌨️ 여행 기간 기온</h2>
          <span className="text-[11px] font-medium text-mute">2월 초 평년값 · °C</span>
        </div>
        <div className="mt-4 space-y-3">
          {WEATHER.map((w) => (
            <div key={w.day} className="flex items-center gap-3">
              <span className="w-12 shrink-0 text-[11px] font-bold text-mute">{w.day}</span>
              <span className="w-8 shrink-0 text-right text-xs font-bold tabular-nums text-accent">{w.lo}°</span>
              <TempRange lo={w.lo} hi={w.hi} />
              <span className="w-7 shrink-0 text-xs font-bold tabular-nums">{w.hi}°</span>
            </div>
          ))}
        </div>
        <p className="mt-4 rounded-2xl bg-fill px-3.5 py-2.5 text-xs leading-relaxed text-sub">
          도로 대부분이 눈·빙판이에요. 방수 부츠 + 아이젠 + 핫팩이 하루의 컨디션을 좌우해요.
        </p>
      </motion.section>

      {/* highlights */}
      <motion.section variants={rise} className="rounded-3xl bg-card p-5 shadow-card">
        <h2 className="text-[15px] font-bold">이 여행의 3대 하이라이트</h2>
        <ul className="mt-4 space-y-4">
          {[
            { emoji: '🏔️', title: '오도리 대설상 라이트업', sub: '개막일 밤, 프로젝션 맵핑까지' },
            { emoji: '♨️', title: '조잔케이 노천온천', sub: '눈 맞으며 온천욕 + 가이세키' },
            { emoji: '🏮', title: '오타루 운하 야경', sub: '해질녘 가스등 켜진 설경' },
          ].map((h) => (
            <li key={h.title} className="flex items-center gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-fill text-xl">
                {h.emoji}
              </span>
              <div>
                <p className="text-sm font-bold leading-snug">{h.title}</p>
                <p className="mt-0.5 text-xs text-sub">{h.sub}</p>
              </div>
            </li>
          ))}
        </ul>
      </motion.section>
    </motion.div>
  )
}
