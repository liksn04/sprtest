import { useEffect, useRef } from 'react'
import { animate, useReducedMotion } from 'motion/react'

interface Props {
  value: number
  format?: (n: number) => string
  duration?: number
  className?: string
}

/** Animates a number from its previous value to `value`. */
export default function CountUp({ value, format = (n) => n.toLocaleString('ko-KR'), duration = 0.8, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const prev = useRef(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced) {
      el.textContent = format(value)
      prev.current = value
      return
    }
    const controls = animate(prev.current, value, {
      duration,
      ease: [0.2, 0.6, 0.2, 1],
      onUpdate: (v) => {
        el.textContent = format(v)
      },
    })
    prev.current = value
    return () => controls.stop()
  }, [value, duration, format, reduced])

  return (
    <span ref={ref} className={className}>
      {format(prev.current)}
    </span>
  )
}
