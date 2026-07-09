import { useEffect, useRef } from 'react'

interface Flake {
  x: number
  y: number
  r: number
  vy: number
  vx: number
  phase: number
}

/** Snowfall canvas that fills its nearest positioned parent. */
export default function SnowEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const host = canvas.parentElement
    if (!host) return

    let width = 0
    let height = 0
    let flakes: Flake[] = []
    let raf = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = host.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(48, Math.floor(width / 8))
      flakes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.8 + Math.random() * 2,
        vy: 0.3 + Math.random() * 0.7,
        vx: -0.12 + Math.random() * 0.24,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    const tick = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
      for (const f of flakes) {
        f.phase += 0.012
        f.y += f.vy
        f.x += f.vx + Math.sin(f.phase) * 0.22
        if (f.y > height + 4) {
          f.y = -4
          f.x = Math.random() * width
        }
        if (f.x > width + 4) f.x = -4
        if (f.x < -4) f.x = width + 4
        ctx.globalAlpha = 0.3 + (f.r / 2.8) * 0.5
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(host)
    resize()
    tick()
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
}
