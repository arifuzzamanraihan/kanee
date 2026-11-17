import { motion, useScroll, useTransform } from "motion/react"

import { FloatingParticles } from "@/components/FloatingParticles"
import { useReducedMotionPref, useViewportWidth } from "@/lib/hooks"
import { useIsDark } from "@/lib/theme"

/**
 * The page colour stays perfectly solid (pure white / solid dark). The only motion is a layer of
 * floating dust particles that fades under the text-heavy sections. Not rendered when the visitor
 * prefers reduced motion.
 */
export function Background() {
  const dark = useIsDark()
  const reduced = useReducedMotionPref()
  const small = useViewportWidth() < 768
  const { scrollY } = useScroll()
  const fadeFx = useTransform(scrollY, [0, 450, 900], [1, 0.45, 0.28])
  if (reduced) return null
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div style={{ opacity: fadeFx }} className="absolute inset-0">
        <FloatingParticles color={dark ? "#f0b393" : "#b4532f"} count={small ? 40 : 80} />
      </motion.div>
    </div>
  )
}
