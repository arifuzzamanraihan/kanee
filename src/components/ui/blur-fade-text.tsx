import { useMemo } from "react"
import { motion, type Variants } from "motion/react"

import { cn } from "@/lib/utils"

interface BlurFadeTextProps {
  text: string
  className?: string
  variant?: Variants
  duration?: number
  characterDelay?: number
  delay?: number
  yOffset?: number
  animateByCharacter?: boolean
}

/** Blur and fade in text. */
export function BlurFadeText({
  text,
  className,
  variant,
  duration = 0.4,
  characterDelay = 0.03,
  delay = 0,
  yOffset = 8,
  animateByCharacter = false,
}: BlurFadeTextProps) {
  const variants: Variants = variant ?? {
    hidden: { y: -yOffset, opacity: 0, filter: "blur(8px)" },
    visible: { y: 0, opacity: 1, filter: "blur(0px)" },
  }
  const characters = useMemo(() => Array.from(text), [text])

  if (animateByCharacter) {
    return (
      <div className="flex flex-wrap">
        {characters.map((char, i) => (
          <motion.span
            key={i}
            initial="hidden"
            animate="visible"
            variants={variants}
            transition={{ duration, delay: delay + i * characterDelay, ease: "easeOut" }}
            className={cn("inline-block", className)}
            style={{ width: char.trim() === "" ? "0.25em" : "auto" }}
          >
            {char}
          </motion.span>
        ))}
      </div>
    )
  }

  return (
    <div className="flex">
      <motion.span
        initial="hidden"
        animate="visible"
        variants={variants}
        transition={{ duration, delay, ease: "easeOut" }}
        className={cn("inline-block", className)}
      >
        {text}
      </motion.span>
    </div>
  )
}
