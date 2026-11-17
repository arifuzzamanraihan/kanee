import { motion, useScroll, useSpring } from "motion/react"

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 })
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="bg-brand pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 origin-left"
    />
  )
}
