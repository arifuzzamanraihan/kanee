import { useEffect, useRef } from "react"

import inkUrl from "@/assets/sketch-ink.png"
import { useReducedMotionPref } from "@/lib/hooks"
import { useIsDark } from "@/lib/theme"

type P = {
  x: number
  y: number
  vx: number
  vy: number
  sx: number
  sy: number
  tx: number
  ty: number
  a: number
  size: number
  seed: number
  depth: number
  delay: number
}

const GATHER_MS = 2400
const STAGGER_MS = 900
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

const IMG_W = 861
const IMG_H = 1280
const ASPECT = IMG_W / IMG_H
const MIN_INK = 0.14

// Cleaned stroke map (paper, noise and specks removed). It is only sampled, never displayed.
let inkPromise: Promise<HTMLImageElement> | null = null
const loadInk = () =>
  (inkPromise ??= new Promise((res, rej) => {
    const im = new Image()
    im.onload = () => res(im)
    im.onerror = rej
    im.src = inkUrl
  }))

/** Area-averaged downscale of the stroke map to gw x gh, returning per-cell ink (0..1). */
function sampleInk(img: HTMLImageElement, gw: number, gh: number) {
  let src: CanvasImageSource = img
  let sw = img.naturalWidth
  let sh = img.naturalHeight
  while (sw / 2 > gw * 1.2) {
    const c = document.createElement("canvas")
    c.width = Math.ceil(sw / 2)
    c.height = Math.ceil(sh / 2)
    const cx = c.getContext("2d")!
    cx.imageSmoothingQuality = "high"
    cx.drawImage(src, 0, 0, c.width, c.height)
    src = c
    sw = c.width
    sh = c.height
  }
  const c = document.createElement("canvas")
  c.width = gw
  c.height = gh
  const cx = c.getContext("2d", { willReadFrequently: true })!
  cx.imageSmoothingQuality = "high"
  cx.drawImage(src, 0, 0, gw, gh)
  const d = cx.getImageData(0, 0, gw, gh).data
  const out = new Float32Array(gw * gh)
  for (let i = 0; i < out.length; i++) out[i] = d[i * 4] / 255
  return out
}

/**
 * A pencil sketch drawn purely with particles. Every visible mark is a particle sitting on a stroke
 * pixel of the drawing (full sheet, original aspect ratio, no crop). Particles fly in when the
 * section scrolls into view, rest exactly on their targets, flee from the cursor or a finger and
 * spring back.
 */
export function SketchParticles() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dark = useIsDark()
  const reduced = useReducedMotionPref()
  const darkRef = useRef(dark)
  darkRef.current = dark
  const redrawRef = useRef<() => void>(() => {})

  useEffect(() => {
    redrawRef.current()
  }, [dark])

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let w = 0
    let h = 0
    let parts: P[] = []
    let raf = 0
    let t0 = 0
    let started = false
    let visible = false
    let running = false
    let token = 0
    let radius = 80
    const pointer = { x: -999, y: -999, active: false }

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = darkRef.current ? "#f4ece6" : "#141414"
      for (const p of parts) {
        let k = 1
        if (!reduced) {
          k = started ? Math.min(Math.max((now - t0 - p.delay) / GATHER_MS, 0), 1) : 0
          const e = easeOut(k)
          let dx = p.sx + (p.tx - p.sx) * e
          let dy = p.sy + (p.ty - p.sy) * e
          if (k >= 1) {
            const s = now * 0.001
            dx += Math.sin(s * 0.8 + p.seed * 12) * 0.25 * p.depth
            dy += Math.cos(s * 0.7 + p.depth * 9) * 0.25 * p.depth
          }
          p.vx += (dx - p.x) * 0.1
          p.vy += (dy - p.y) * 0.1
          if (pointer.active) {
            const ax = p.x - pointer.x
            const ay = p.y - pointer.y
            const d = Math.hypot(ax, ay)
            if (d > 0 && d < radius) {
              const f = Math.pow(1 - d / radius, 2) * 7
              p.vx += (ax / d) * f
              p.vy += (ay / d) * f
            }
          }
          p.vx *= 0.82
          p.vy *= 0.82
          p.x += p.vx
          p.y += p.vy
        } else {
          p.x = p.tx
          p.y = p.ty
        }
        ctx.globalAlpha = p.a * (reduced ? 1 : 0.05 + 0.95 * k)
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
      }
      ctx.globalAlpha = 1
    }

    const frame = (now: number) => {
      draw(now)
      running = visible && !document.hidden && !reduced
      raf = running ? requestAnimationFrame(frame) : 0
    }
    const start = () => {
      if (!running && !reduced && visible) {
        running = true
        raf = requestAnimationFrame(frame)
      }
    }

    const build = async () => {
      const my = ++token
      const cw = Math.floor(wrap.clientWidth)
      if (cw <= 0) return
      const small = cw < 520
      // Whole sheet at its exact aspect ratio: no crop, no stretch, no rotation.
      h = Math.round(Math.min(cw / ASPECT, Math.min(window.innerHeight * 0.86, small ? 640 : 760)))
      w = cw
      const dw = Math.round(h * ASPECT)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      wrap.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      radius = small ? 56 : 80

      const img = await loadInk()
      if (my !== token) return
      const maxN = small ? 5200 : 12000
      let cell = small ? 1.5 : 1.2
      let cells: Float32Array = new Float32Array(0)
      let gw = 0
      let gh = 0
      for (let tries = 0; tries < 14; tries++) {
        gw = Math.round(dw / cell)
        gh = Math.round(h / cell)
        cells = sampleInk(img, gw, gh)
        let count = 0
        for (let i = 0; i < cells.length; i++) if (cells[i] > MIN_INK) count++
        if (count <= maxN) break
        cell *= 1.07
      }
      const ox = (w - dw) / 2
      const cx = dw / gw
      const cy = h / gh
      const size = Math.min(1.7, Math.max(1.0, Math.max(cx, cy) * 0.95))
      const next: P[] = []
      let idx = 0
      for (let gy = 0; gy < gh; gy++) {
        for (let gx = 0; gx < gw; gx++) {
          const v = cells[gy * gw + gx]
          if (v <= MIN_INK) continue
          const seed = ((idx * 9301 + 49297) % 233280) / 233280
          const depth = 0.5 + (((idx * 233 + 97) % 1000) / 1000) * 0.9
          idx++
          const tx = ox + (gx + 0.5) * cx
          const ty = (gy + 0.5) * cy
          const ang = seed * Math.PI * 2
          const rad = Math.max(w, h) * (0.35 + depth * 0.55)
          const sx = w / 2 + Math.cos(ang) * rad
          const sy = h / 2 + Math.sin(ang) * rad * 0.8
          next.push({
            x: reduced ? tx : sx,
            y: reduced ? ty : sy,
            vx: 0,
            vy: 0,
            sx,
            sy,
            tx,
            ty,
            a: Math.min(1, 0.55 + 0.7 * v),
            size,
            seed,
            depth,
            delay: seed * STAGGER_MS,
          })
        }
      }
      parts = next
      t0 = performance.now()
      if (reduced) draw(t0)
      else start()
    }
    redrawRef.current = () => {
      if (reduced) draw(performance.now())
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      pointer.x = e.clientX - r.left
      pointer.y = e.clientY - r.top
      pointer.active = true
    }
    const onLeave = () => (pointer.active = false)

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible && !started) {
          started = true
          t0 = performance.now()
        }
        if (visible) start()
      },
      { threshold: 0.2 }
    )
    io.observe(wrap)
    let rt = 0
    const ro = new ResizeObserver(() => {
      window.clearTimeout(rt)
      rt = window.setTimeout(() => void build(), 150)
    })
    ro.observe(wrap)
    const onVis = () => {
      if (!document.hidden) start()
    }
    document.addEventListener("visibilitychange", onVis)
    canvas.addEventListener("pointermove", onMove)
    canvas.addEventListener("pointerleave", onLeave)
    canvas.addEventListener("pointerup", onLeave)
    canvas.addEventListener("pointercancel", onLeave)
    void build()

    return () => {
      token++
      cancelAnimationFrame(raf)
      window.clearTimeout(rt)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener("visibilitychange", onVis)
      canvas.removeEventListener("pointermove", onMove)
      canvas.removeEventListener("pointerleave", onLeave)
      canvas.removeEventListener("pointerup", onLeave)
      canvas.removeEventListener("pointercancel", onLeave)
    }
  }, [reduced])

  return (
    <div
      ref={wrapRef}
      className="relative min-h-[320px] w-full select-none"
      role="img"
      aria-label="Pencil line sketch of a woman, drawn with particles"
    >
      <canvas ref={canvasRef} className="absolute inset-0 block touch-pan-y" aria-hidden />
    </div>
  )
}
