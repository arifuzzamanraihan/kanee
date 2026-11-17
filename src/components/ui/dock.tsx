import { createContext, useContext, useRef, type ReactNode } from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"

import { cn } from "@/lib/utils"

interface DockProps {
  className?: string
  children: ReactNode
  /** Icon container size at rest, in px. */
  baseSize?: number
  /** Container size under the cursor, in px. Set equal to baseSize to disable magnification. */
  magnification?: number
  distance?: number
}

interface DockIconProps {
  className?: string
  children?: ReactNode
}

const ICON_SIZE_RATIO = 0.5
const SPRING = { mass: 0.1, stiffness: 150, damping: 12 }

interface DockContextValue {
  mouseX: MotionValue<number>
  baseSize: number
  magnification: number
  distance: number
}

const DockContext = createContext<DockContextValue | null>(null)

/** Dock with hover magnification. */
const Dock = ({ className, children, baseSize = 40, magnification = 60, distance = 100 }: DockProps) => {
  const mouseX = useMotionValue(Infinity)
  return (
    <DockContext.Provider value={{ mouseX, baseSize, magnification, distance }}>
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={cn(
          "mx-auto flex h-full w-max items-end justify-center overflow-visible rounded-full border",
          className
        )}
      >
        {children}
      </motion.div>
    </DockContext.Provider>
  )
}

const DockIcon = ({ className, children }: DockIconProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const context = useContext(DockContext)
  if (!context) throw new Error("DockIcon must be used within a Dock component")
  const { mouseX, baseSize, magnification, distance } = context

  const distanceCalc = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })
  const containerSize = useSpring(
    useTransform(distanceCalc, [-distance, 0, distance], [baseSize, magnification, baseSize]),
    SPRING
  )
  const iconSize = useSpring(
    useTransform(
      distanceCalc,
      [-distance, 0, distance],
      [baseSize * ICON_SIZE_RATIO, magnification * ICON_SIZE_RATIO, baseSize * ICON_SIZE_RATIO]
    ),
    SPRING
  )

  return (
    <motion.div
      ref={ref}
      style={{ width: containerSize, height: containerSize }}
      className={cn("relative flex aspect-square shrink-0 items-center justify-center rounded-full", className)}
    >
      <motion.div style={{ width: iconSize, height: iconSize }} className="flex items-center justify-center">
        {children}
      </motion.div>
    </motion.div>
  )
}

export { Dock, DockIcon }
