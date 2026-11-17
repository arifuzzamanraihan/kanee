import { useEffect, useRef } from "react"

type Dot = { x: number; y: number; z: number; vx: number; vy: number; ph: number }

/** Slow, depth-sorted dust that drifts upward, parallaxes with the cursor and the scroll position. */
export function FloatingParticles({ color, count }: { color: string; count: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const colorRef = useRef(color)
  colorRef.current = color

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    let w = 0
    let h = 0
    let raf = 0
    let dots: Dot[] = []
    const mouse = { x: 0, y: 0, sx: 0, sy: 0 }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dots = Array.from({ length: count }, () => {
        const z = 0.2 + Math.random() * 0.8
        return { x: Math.random() * w, y: Math.random() * h, z, vx: (Math.random() - 0.5) * 0.12 * z, vy: -(0.05 + Math.random() * 0.18) * z, ph: Math.random() * 6.28 }
      })
    }
    const onMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / w - 0.5) * 2
      mouse.y = (e.clientY / h - 0.5) * 2
    }
    const frame = (now: number) => {
      mouse.sx += (mouse.x - mouse.sx) * 0.05
      mouse.sy += (mouse.y - mouse.sy) * 0.05
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = colorRef.current
      const sc = window.scrollY
      for (const d of dots) {
        d.x += d.vx + Math.sin(now * 0.0004 + d.ph) * 0.06 * d.z
        d.y += d.vy
        if (d.y < -10) d.y = h + 10
        if (d.x < -10) d.x = w + 10
        if (d.x > w + 10) d.x = -10
        const px = d.x + mouse.sx * 26 * d.z
        let py = d.y + mouse.sy * 18 * d.z - sc * 0.18 * d.z
        py = ((py % (h + 20)) + (h + 20)) % (h + 20) - 10
        ctx.globalAlpha = 0.1 + d.z * 0.3
        ctx.beginPath()
        ctx.arc(px, py, 0.6 + d.z * 1.7, 0, 6.2832)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      raf = document.hidden ? 0 : requestAnimationFrame(frame)
    }
    const onVis = () => {
      if (!document.hidden && !raf) raf = requestAnimationFrame(frame)
    }
    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("pointermove", onMove, { passive: true })
    document.addEventListener("visibilitychange", onVis)
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [count])

  return <canvas ref={ref} className="absolute inset-0" />
}
