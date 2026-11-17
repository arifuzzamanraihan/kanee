import { Briefcase, GraduationCap, Home, Lightbulb, Mail, User } from "lucide-react"
import { useEffect, useState, type ReactNode } from "react"

import { LinkedInIcon } from "@/components/icons"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { Dock, DockIcon } from "@/components/ui/dock"
import { profile } from "@/data"
import { useViewportWidth } from "@/lib/hooks"
import { cn } from "@/lib/utils"

const ICON_CLASS =
  "bg-background text-muted-foreground hover:bg-muted hover:text-foreground border-border cursor-pointer rounded-3xl border transition-colors"

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState("hero")
  useEffect(() => {
    const ratios = new Map<string, number>()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => ratios.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0))
        let best = ""
        let max = 0
        ratios.forEach((r, id) => {
          if (r > max) {
            max = r
            best = id
          }
        })
        if (best) setActive(best)
      },
      { rootMargin: "-30% 0px -45% 0px", threshold: [0, 0.1, 0.3, 0.6, 1] }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [ids])
  return active
}

const SECTION_IDS = ["hero", "about", "work", "education", "skills"]

function Item({ href, label, children, external, active }: { href: string; label: string; children: ReactNode; external?: boolean; active?: boolean }) {
  return (
    <a
      href={href}
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group relative flex"
    >
      <DockIcon className={cn(ICON_CLASS, active && "bg-muted text-brand border-brand/60")}>{children}</DockIcon>
      <span className="bg-primary text-primary-foreground pointer-events-none absolute -top-11 left-1/2 hidden -translate-x-1/2 rounded-xl px-3 py-1.5 text-sm font-medium whitespace-nowrap opacity-0 shadow-lg transition-opacity group-hover:opacity-100 md:block">
        {label}
      </span>
    </a>
  )
}

const COUNT = 8 // icons
const SEPARATORS = 2

export function DockNav() {
  const vw = useViewportWidth()
  const active = useActiveSection(SECTION_IDS)
  const small = vw < 768
  const gap = vw < 640 ? 4 : 8
  // Fit every icon inside the viewport (16px page margin on each side, p-2, border, separators, gaps).
  const avail = vw - 32 - 16 - 2 - SEPARATORS - gap * (COUNT + SEPARATORS - 1)
  const baseSize = Math.max(28, Math.min(40, Math.floor(avail / COUNT)))
  const magnification = small ? baseSize : 60

  return (
    <nav
      aria-label="Primary"
      className="pointer-events-none fixed inset-x-0 z-50 flex justify-center px-4"
      style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <Dock
        baseSize={baseSize}
        magnification={magnification}
        className="bg-card/90 border-border pointer-events-auto relative mx-auto h-auto max-w-full items-center p-2 shadow-[0_0_10px_3px] shadow-black/5 backdrop-blur-3xl dark:shadow-white/5"
      >
        <div className="flex items-center" style={{ gap }}>
          <Item href="#hero" label="Home" active={active === "hero"}><Home className="size-full" /></Item>
          <Item href="#about" label="About" active={active === "about"}><User className="size-full" /></Item>
          <Item href="#work" label="Experience" active={active === "work"}><Briefcase className="size-full" /></Item>
          <Item href="#education" label="Education" active={active === "education"}><GraduationCap className="size-full" /></Item>
          <Item href="#skills" label="Skills" active={active === "skills"}><Lightbulb className="size-full" /></Item>
          <div className="bg-border h-7 w-px" />
          <Item href={`mailto:${profile.email}`} label="Email"><Mail className="size-full" /></Item>
          <Item href={profile.linkedin} label="LinkedIn" external><LinkedInIcon className="size-full" /></Item>
          <div className="bg-border h-7 w-px" />
          <div className="group relative flex">
            <DockIcon className={ICON_CLASS}>
              <AnimatedThemeToggler
                aria-label="Toggle dark and light mode"
                className="flex size-full cursor-pointer items-center justify-center [&_svg]:size-full"
              />
            </DockIcon>
            <span className="bg-primary text-primary-foreground pointer-events-none absolute -top-11 left-1/2 hidden -translate-x-1/2 rounded-xl px-3 py-1.5 text-sm font-medium whitespace-nowrap opacity-0 shadow-lg transition-opacity group-hover:opacity-100 md:block">
              Theme
            </span>
          </div>
        </div>
      </Dock>
    </nav>
  )
}
