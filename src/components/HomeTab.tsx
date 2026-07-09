import { Plane, Snowflake, Thermometer, Wallet, MapPin } from 'lucide-react'
import Countdown from './Countdown'
import SnowEffect from './SnowEffect'
import { TRIP, fmtKRW } from '../data/trip'

const SUMMARY = [
  { Icon: Plane, tint: 'var(--color-cat-move)', label: '항공', title: '김해 ↔ 신치토세', sub: '직항 약 2시간 20분' },
  { Icon: Wallet, tint: 'var(--color-cat-shop)', label: '총예산 (2인)', title: fmtKRW(TRIP.totalBudget), sub: '예산 탭에서 지출 관리' },
  { Icon: MapPin, tint: 'var(--color-cat-onsen)', label: '숙소 동선', title: '삿포로 2박 + 료칸 1박', sub: '스스키노 → 조잔케이' },
  { Icon: Snowflake, tint: 'var(--color-accent)', label: '눈축제', title: TRIP.festival.period, sub: TRIP.festival.note },
]

export default function HomeTab() {
  return (
    <div className="space-y-4 pt-8">
      <header className="px-1">
        <h1 className="text-[22px] font-extrabold leading-snug tracking-tight">
          곧 떠나요, 삿포로 ❄️
        </h1>
        <p className="mt-1 text-sm text-sub">{TRIP.dateLabel} · {TRIP.travelers}</p>
      </header>

      {/* hero */}
      <section className="hero-gradient relative overflow-hidden rounded-[28px] p-6 shadow-card">
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
      </section>

      {/* summary cards */}
      <section className="grid grid-cols-2 gap-3">
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
      </section>

      {/* weather */}
      <section className="rounded-3xl bg-card p-5 shadow-card">
        <div className="flex items-center gap-2">
          <Thermometer size={17} className="text-accent" />
          <h2 className="text-[15px] font-bold">2월 초 삿포로 날씨</h2>
        </div>
        <div className="mt-4 flex items-center gap-5">
          <div className="text-center">
            <p className="text-[28px] font-extrabold tabular-nums leading-none">-1°</p>
            <p className="mt-1.5 text-[11px] font-medium text-mute">평균 최고</p>
          </div>
          <div className="h-9 w-px bg-line" />
          <div className="text-center">
            <p className="text-[28px] font-extrabold tabular-nums leading-none text-accent">-8°</p>
            <p className="mt-1.5 text-[11px] font-medium text-mute">평균 최저</p>
          </div>
          <p className="flex-1 text-xs leading-relaxed text-sub">
            도로 대부분이 눈·빙판이에요. 방수 부츠, 아이젠, 핫팩이 하루의 컨디션을 좌우해요.
          </p>
        </div>
      </section>

      {/* highlights */}
      <section className="rounded-3xl bg-card p-5 shadow-card">
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
      </section>
    </div>
  )
}
