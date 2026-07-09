import { Plane, Snowflake, Thermometer, Wallet, MapPin, Sparkles } from 'lucide-react'
import Countdown from './Countdown'
import { TRIP, fmtKRW } from '../data/trip'

export default function HomeTab() {
  return (
    <div className="space-y-4 pt-6">
      {/* hero */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#16224a] via-[#121c3e] to-card p-6">
        <Snowflake aria-hidden className="absolute -right-6 -top-6 h-32 w-32 text-ice/10" />
        <p className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-ice">
          <Sparkles size={14} /> {TRIP.festival.name}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight">
          {TRIP.title}
          <span className="mt-1 block text-base font-medium text-sub">{TRIP.subtitle}</span>
        </h1>
        <p className="mt-3 inline-flex rounded-full bg-white/8 px-3 py-1 text-xs font-medium text-sub">
          {TRIP.dateLabel} · {TRIP.travelers}
        </p>
        <div className="mt-6">
          <Countdown />
        </div>
      </section>

      {/* summary cards */}
      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-line/60 bg-card p-4">
          <Plane size={18} className="text-cat-move" />
          <p className="mt-2 text-[11px] text-sub">항공</p>
          <p className="text-sm font-semibold leading-snug">
            김해 ↔ 신치토세
            <span className="block text-xs font-normal text-sub">직항 약 2시간 20분</span>
          </p>
        </div>
        <div className="rounded-2xl border border-line/60 bg-card p-4">
          <Wallet size={18} className="text-cat-shop" />
          <p className="mt-2 text-[11px] text-sub">총예산 (2인)</p>
          <p className="text-sm font-semibold leading-snug">
            {fmtKRW(TRIP.totalBudget)}
            <span className="block text-xs font-normal text-sub">예산 탭에서 지출 관리</span>
          </p>
        </div>
        <div className="rounded-2xl border border-line/60 bg-card p-4">
          <MapPin size={18} className="text-cat-onsen" />
          <p className="mt-2 text-[11px] text-sub">숙소 동선</p>
          <p className="text-sm font-semibold leading-snug">
            삿포로 2박 + 료칸 1박
            <span className="block text-xs font-normal text-sub">스스키노 → 조잔케이</span>
          </p>
        </div>
        <div className="rounded-2xl border border-line/60 bg-card p-4">
          <Snowflake size={18} className="text-ice" />
          <p className="mt-2 text-[11px] text-sub">눈축제</p>
          <p className="text-sm font-semibold leading-snug">
            {TRIP.festival.period}
            <span className="block text-xs font-normal text-sub">{TRIP.festival.note}</span>
          </p>
        </div>
      </section>

      {/* weather */}
      <section className="rounded-2xl border border-line/60 bg-card p-4">
        <div className="flex items-center gap-2">
          <Thermometer size={18} className="text-ice" />
          <h2 className="text-sm font-bold">2월 초 삿포로 날씨</h2>
        </div>
        <div className="mt-3 flex items-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold tabular-nums">-1°</p>
            <p className="text-[11px] text-sub">평균 최고</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold tabular-nums text-ice">-8°</p>
            <p className="text-[11px] text-sub">평균 최저</p>
          </div>
          <p className="flex-1 text-xs leading-relaxed text-sub">
            도로 대부분이 눈·빙판이에요. 방수 부츠 + 아이젠 + 핫팩이 하루의 컨디션을 좌우합니다.
          </p>
        </div>
      </section>

      {/* highlight strip */}
      <section className="rounded-2xl border border-line/60 bg-card p-4">
        <h2 className="text-sm font-bold">이 여행의 3대 하이라이트</h2>
        <ul className="mt-3 space-y-2.5">
          {[
            { emoji: '🏔️', text: '개막일 밤, 오도리 공원 대설상 라이트업' },
            { emoji: '♨️', text: '눈 내리는 조잔케이 노천온천 + 가이세키' },
            { emoji: '🏮', text: '해질녘 오타루 운하, 가스등 켜진 설경' },
          ].map((h) => (
            <li key={h.text} className="flex items-center gap-3 rounded-xl bg-white/4 px-3 py-2.5 text-sm">
              <span className="text-lg">{h.emoji}</span>
              <span>{h.text}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
