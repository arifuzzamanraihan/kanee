import { useEffect, useRef } from "react"

import { useReducedMotionPref } from "@/lib/hooks"
import { useIsDark } from "@/lib/theme"

type Particle = {
  x: number
  y: number
  sx: number
  sy: number
  tx: number
  ty: number
  seed: number
  depth: number
  delay: number
  size: number
  bucket: number
}

const BUCKETS = 16
const GATHER_MS = 1900
const STAGGER_MS = 650

const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16))
const mix = (a: string, b: string, t: number) => {
  const A = hex(a)
  const B = hex(b)
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(",")})`
}
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * Her name drawn as thousands of tiny particles. They drift in from all sides and
 * assemble into the letters, keep breathing gently, and scatter away from the cursor or a finger.
 * Tapping or clicking re-scatters and re-assembles the name.
 */
export function ParticleName({ text = "Kaneeta Zahid" }: { text?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dark = useIsDark()
  const reduced = useReducedMotionPref()
  const darkRef = useRef(dark)
  const paletteRef = useRef<string[]>([])
  darkRef.current = dark

  useEffect(() => {
    const colors = dark ? ["#fff1e8", "#e8a07f"] : ["#6e2a12", "#d9825f"]
    paletteRef.current = Array.from({ length: BUCKETS }, (_, i) => mix(colors[0], colors[1], i / (BUCKETS - 1)))
  }, [dark])

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let particles: Particle[] = []
    let groups: Particle[][] = []
    let w = 0
    let h = 0
    let raf = 0
    let buildToken = 0
    let t0 = 0
    let visible = true
    let running = false
    const pointer = { x: 0, y: 0, sx: 0, sy: 0, active: false }

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h)
      const palette = paletteRef.current
      pointer.sx += (pointer.x - pointer.sx) * 0.2
      pointer.sy += (pointer.y - pointer.sy) * 0.2
      let settled = true
      for (const p of particles) {
        let tx = p.tx
        let ty = p.ty
        if (!reduced) {
          const k = Math.min(Math.max((now - t0 - p.delay) / GATHER_MS, 0), 1)
          if (k < 1) settled = false
          const e = easeOut(k)
          tx = p.sx + (p.tx - p.sx) * e
          ty = p.sy + (p.ty - p.sy) * e
          if (k >= 1) {
            const s = now * 0.001
            tx += Math.sin(s * 0.9 + p.seed * 10) * 0.9 * p.depth
            ty += Math.cos(s * 0.75 + p.depth * 10) * 0.9 * p.depth
          }
          if (pointer.active) {
            const dx = tx - pointer.sx
            const dy = ty - pointer.sy
            const d = Math.hypot(dx, dy)
            const R = 90
            if (d > 0 && d < R) {
              const f = Math.pow(1 - d / R, 2) * 46
              tx += (dx / d) * f
              ty += (dy / d) * f
            }
          }
          p.x += (tx - p.x) * 0.22
          p.y += (ty - p.y) * 0.22
        } else {
          p.x = tx
          p.y = ty
        }
      }
      for (let b = 0; b < BUCKETS; b++) {
        const g = groups[b]
        if (!g.length) continue
        ctx.fillStyle = palette[b]
        for (const p of g) {
          const a = reduced ? 1 : 0.35 + 0.65 * Math.min(Math.max((now - t0 - p.delay) / GATHER_MS, 0), 1)
          ctx.globalAlpha = a
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
        }
      }
      ctx.globalAlpha = 1
      return settled
    }

    const frame = (now: number) => {
      draw(now)
      raf = visible && !reduced ? requestAnimationFrame(frame) : 0
      running = raf !== 0
    }
    const start = () => {
      if (!running && !reduced) {
        running = true
        raf = requestAnimationFrame(frame)
      }
    }

    const build = async () => {
      const token = ++buildToken
      w = Math.floor(wrap.clientWidth)
      if (w <= 0) return
      const stacked = w < 520
      const lines = stacked ? text.split(" ") : [text]
      const family = getComputedStyle(wrap).fontFamily || "sans-serif"
      const weight = 800
      const base = stacked ? 96 : 108
      const off = document.createElement("canvas")
      const octx = off.getContext("2d", { willReadFrequently: true })
      if (!octx) return
      try {
        await document.fonts.load(`${weight} ${base}px ${family}`)
      } catch {
        /* font fallback is fine */
      }
      if (token !== buildToken) return
      octx.font = `${weight} ${base}px ${family}`
      const widest = Math.max(...lines.map((l) => octx.measureText(l).width), 1)
      const size = Math.min(base, (base * w * 0.94) / widest)
      const lineH = size * 1.06
      const pad = size * 0.28
      h = Math.ceil(lines.length * lineH + pad)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      wrap.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      off.width = w
      off.height = h
      octx.font = `${weight} ${size}px ${family}`
      octx.textAlign = "center"
      octx.textBaseline = "middle"
      octx.fillStyle = "#fff"
      lines.forEach((l, i) => octx.fillText(l, w / 2, pad / 2 + lineH * (i + 0.5) + size * 0.04))
      const img = octx.getImageData(0, 0, w, h).data
      const cap = stacked ? 2600 : 4600
      let step = 3
      let pts: { x: number; y: number }[] = []
      for (;;) {
        pts = []
        for (let y = 0; y < h; y += step)
          for (let x = 0; x < w; x += step) if (img[(y * w + x) * 4 + 3] > 80) pts.push({ x, y })
        if (pts.length <= cap || step >= 7) break
        step += 1
      }
      const spread = Math.max(w, 420)
      const next: Particle[] = pts.map((pt, i) => {
        const seed = ((i * 9301 + 49297) % 233280) / 233280
        const depth = 0.45 + (((i * 233 + 97) % 1000) / 1000) * 0.9
        const ang = seed * Math.PI * 2
        const rad = spread * (0.35 + depth * 0.5)
        const sx = pt.x + Math.cos(ang) * rad * 0.9
        const sy = pt.y + Math.sin(ang) * rad * 0.5 + (depth - 0.9) * 90
        return {
          x: reduced ? pt.x : sx,
          y: reduced ? pt.y : sy,
          sx,
          sy,
          tx: pt.x,
          ty: pt.y,
          seed,
          depth,
          delay: seed * STAGGER_MS,
          size: Math.max(1.6, step * 0.72),
          bucket: Math.min(BUCKETS - 1, Math.floor(Math.min(1, Math.max(0, pt.x / w + (seed - 0.5) * 0.3)) * BUCKETS)),
        }
      })
      particles = next
      groups = Array.from({ length: BUCKETS }, () => [])
      next.forEach((p) => groups[p.bucket].push(p))
      t0 = performance.now()
      pointer.x = pointer.sx = w / 2
      pointer.y = pointer.sy = h / 2
      if (reduced) draw(t0)
      else start()
    }

    const scatterAgain = () => {
      if (reduced) return
      const now = performance.now()
      for (const p of particles) {
        const a = Math.random() * Math.PI * 2
        const r = 60 + Math.random() * 160
        p.sx = p.x + Math.cos(a) * r
        p.sy = p.y + Math.sin(a) * r * 0.6
        p.delay = p.seed * 420
      }
      t0 = now
      start()
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      pointer.x = e.clientX - r.left
      pointer.y = e.clientY - r.top
      pointer.active = true
    }
    const onLeave = () => (pointer.active = false)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
    })
    io.observe(wrap)
    let rt = 0
    const ro = new ResizeObserver(() => {
      window.clearTimeout(rt)
      rt = window.setTimeout(build, 150)
    })
    ro.observe(wrap)
    const onVis = () => {
      if (!document.hidden) start()
    }
    document.addEventListener("visibilitychange", onVis)
    canvas.addEventListener("pointermove", onMove)
    canvas.addEventListener("pointerleave", onLeave)
    canvas.addEventListener("pointerup", onLeave)
    canvas.addEventListener("click", scatterAgain)
    build()

    return () => {
      buildToken++
      cancelAnimationFrame(raf)
      window.clearTimeout(rt)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener("visibilitychange", onVis)
      canvas.removeEventListener("pointermove", onMove)
      canvas.removeEventListener("pointerleave", onLeave)
      canvas.removeEventListener("pointerup", onLeave)
      canvas.removeEventListener("click", scatterAgain)
    }
  }, [text, reduced])

  return (
    <div ref={wrapRef} className="relative min-h-[130px] w-full select-none" role="img" aria-label={text}>
      <canvas ref={canvasRef} className="absolute inset-0 block touch-pan-y" aria-hidden />
    </div>
  )
}
