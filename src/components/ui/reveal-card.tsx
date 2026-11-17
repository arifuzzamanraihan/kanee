import { motion } from "motion/react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/** Section heading with a hairline that draws itself in as the section scrolls into view. */
export function H2({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="text-xl font-bold">{children}</h2>
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.25 }}
        className="bg-border h-px flex-1 origin-left"
      />
    </div>
  )
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "border-border text-foreground inline-flex h-6 w-fit items-center rounded-md border px-2 text-[11px] font-medium",
        className
      )}
    >
      {children}
    </span>
  )
}
