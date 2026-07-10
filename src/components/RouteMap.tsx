import { motion, useReducedMotion } from 'motion/react'
import { ROUTE } from '../data/trip'

interface StopPos {
  x: number
  y: number
  labelAbove: boolean
}

const POS: Record<string, StopPos> = {
  pus: { x: 40, y: 150, labelAbove: false },
  cts: { x: 132, y: 150, labelAbove: false },
  spk: { x: 200, y: 100, labelAbove: false },
  jzk: { x: 112, y: 48, labelAbove: true },
  otr: { x: 300, y: 48, labelAbove: true },
}

const SEGMENTS = [
  { d: 'M 40 150 Q 86 118 132 150', color: 'var(--color-accent)', dashed: true },
  { d: 'M 132 150 C 160 150 180 130 200 100', color: 'var(--color-accent)', dashed: false },
  { d: 'M 200 100 C 176 82 144 60 112 48', color: 'var(--color-cat-onsen)', dashed: false },
  { d: 'M 200 100 C 236 82 268 60 300 48', color: 'var(--color-cat-tour)', dashed: false },
]

/** Metro-style journey map: Gimhae → Chitose → Sapporo → Jozankei / Otaru. */
export default function RouteMap() {
  const reduced = useReducedMotion()

  return (
    <svg viewBox="0 0 340 196" className="w-full" role="img" aria-label="여행 동선: 김해공항에서 신치토세, 삿포로를 거쳐 조잔케이 온천과 오타루로">
      {SEGMENTS.map((seg, i) => (
        <motion.path
          key={seg.d}
          d={seg.d}
          fill="none"
          stroke={seg.color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={seg.dashed ? '1 7' : undefined}
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, delay: 0.2 + i * 0.28, ease: 'easeInOut' }}
        />
      ))}

      {ROUTE.map((stop, i) => {
        const p = POS[stop.id]
        const nameY = p.labelAbove ? p.y - 34 : p.y + 26
        const subY = p.labelAbove ? p.y - 22 : p.y + 38
        return (
          <motion.g
            key={stop.id}
            initial={reduced ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 420, damping: 20, delay: 0.12 + i * 0.28 }}
            style={{ transformOrigin: `${p.x}px ${p.y}px` }}
          >
            <circle cx={p.x} cy={p.y} r={13} fill="var(--color-card)" stroke="var(--color-line)" strokeWidth={1.5} />
            <text x={p.x} y={p.y + 4.5} textAnchor="middle" fontSize="13">
              {stop.emoji}
            </text>
            <text x={p.x} y={nameY} textAnchor="middle" fontSize="10.5" fontWeight={700} fill="var(--color-ink)">
              {stop.name}
            </text>
            <text x={p.x} y={subY} textAnchor="middle" fontSize="8.5" fill="var(--color-mute)">
              {stop.sub}
            </text>
          </motion.g>
        )
      })}
    </svg>
  )
}
