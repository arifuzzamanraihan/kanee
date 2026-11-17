import { useEffect, useState } from "react"

export function useViewportWidth() {
  const [w, setW] = useState(() => window.innerWidth)
  useEffect(() => {
    const on = () => setW(window.innerWidth)
    window.addEventListener("resize", on)
    return () => window.removeEventListener("resize", on)
  }, [])
  return w
}

export function useReducedMotionPref() {
  const [r, setR] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const on = () => setR(mq.matches)
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [])
  return r
}
