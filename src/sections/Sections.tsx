import { Award, Briefcase, ChevronRight, GraduationCap, Heart, MessageCircle, Mail, Rocket, BookOpen } from "lucide-react"
import { useState } from "react"

import { SketchParticles } from "@/components/SketchParticles"
import { LinkedInIcon } from "@/components/icons"
import { Badge, H2 } from "@/components/ui/reveal-card"
import { BlurFade as BaseBlurFade } from "@/components/ui/blur-fade"
import { BorderBeam } from "@/components/ui/border-beam"
import { FlickeringGrid } from "@/components/ui/flickering-grid"
import { MagicCard } from "@/components/ui/magic-card"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { about, certifications, education, posts, profile, skills, work } from "@/data"
import { useReducedMotionPref } from "@/lib/hooks"
import { useIsDark } from "@/lib/theme"
import { cn } from "@/lib/utils"

/** Scroll-driven reveal: each block blurs and rises into place as it enters the viewport. */
function BlurFade(props: React.ComponentProps<typeof BaseBlurFade>) {
  return <BaseBlurFade inView inViewMargin="-70px" offset={14} duration={0.55} {...props} />
}

function useBrand() {
  const dark = useIsDark()
  return {
    dark,
    from: dark ? "#e8a07f" : "#b4532f",
    to: dark ? "#ffffff" : "#d9825f",
  }
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  const { dark, from, to } = useBrand()
  return (
    <MagicCard
      className={cn("rounded-xl", className)}
      gradientSize={200}
      gradientColor={dark ? "#2a1710" : "#fbebe3"}
      gradientFrom={from}
      gradientTo={to}
      gradientOpacity={dark ? 0.7 : 0.9}
    >
      {children}
    </MagicCard>
  )
}

export function About() {
  return (
    <section id="about">
      <div className="flex min-h-0 flex-col gap-y-4">
        <BlurFade delay={0.05}>
          <H2>About</H2>
        </BlurFade>
        <BlurFade delay={0.05}>
          <div className="text-muted-foreground max-w-full space-y-3 font-sans leading-relaxed text-pretty">
            {about.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="text-foreground font-semibold">{about.bringTitle}</p>
            <ul className="list-disc space-y-1 pl-5">
              {about.bring.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <p>{about.outro}</p>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}

function Circle({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-border ring-border bg-background flex size-8 flex-none items-center justify-center rounded-full border p-1.5 shadow ring-2 md:size-10 md:p-2">
      {children}
    </div>
  )
}

function WorkItem({ w }: { w: (typeof work)[number] }) {
  const [open, setOpen] = useState(false)
  const expandable = !!(w.bullets || w.skills)
  return (
    <div className="grid gap-2">
      <button
        type="button"
        onClick={() => expandable && setOpen((o) => !o)}
        aria-expanded={expandable ? open : undefined}
        className={cn("group flex w-full items-center justify-between gap-x-3 text-left", expandable && "cursor-pointer")}
      >
        <div className="flex min-w-0 flex-1 items-center gap-x-3">
          <Circle>
            {w.current ? <Rocket className="text-brand size-full" /> : <Briefcase className="text-muted-foreground size-full" />}
          </Circle>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <div className="flex items-center gap-2 leading-none font-semibold">
              {w.org}
              {expandable && (
                <ChevronRight className={cn("text-muted-foreground size-3.5 transition-transform duration-200", open ? "rotate-90 opacity-100" : "opacity-60 group-hover:translate-x-1")} />
              )}
            </div>
            <div className="text-muted-foreground font-sans text-sm">{w.title}</div>
          </div>
        </div>
        <div className="text-muted-foreground flex-none text-right text-xs tabular-nums">{w.meta}</div>
      </button>
      {(w.note || w.place) && (
        <div className="text-muted-foreground ml-11 text-xs sm:text-sm md:ml-13">
          {w.place && <p>{w.place}</p>}
          {w.note && <p>{w.note}</p>}
        </div>
      )}
      {expandable && open && (
        <div className="text-muted-foreground ml-11 space-y-3 text-xs sm:text-sm md:ml-13">
          {w.bullets && (
            <ul className="list-disc space-y-1 pl-4">
              {w.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
          {w.skills && (
            <div className="flex flex-wrap gap-1">
              {w.skills.map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function Work() {
  return (
    <section id="work">
      <div className="flex min-h-0 flex-col gap-y-6">
        <BlurFade delay={0.05}>
          <H2>Work Experience</H2>
        </BlurFade>
        <BlurFade delay={0.05}>
          <div className="grid gap-6">
            {work.map((w) => (
              <WorkItem key={w.title} w={w} />
            ))}
          </div>
        </BlurFade>
      </div>
    </section>
  )
}

export function Education() {
  return (
    <section id="education">
      <div className="flex min-h-0 flex-col gap-y-6">
        <BlurFade delay={0.05}>
          <H2>Education</H2>
        </BlurFade>
        <div className="flex flex-col gap-8">
          {education.map((e, i) => (
            <BlurFade key={e.school} delay={i * 0.05}>
              <div className="flex items-center justify-between gap-x-3">
                <div className="flex min-w-0 flex-1 items-center gap-x-3">
                  <Circle>
                    <GraduationCap className="text-brand size-full" />
                  </Circle>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <div className="leading-none font-semibold">{e.school}</div>
                    <div className="text-muted-foreground font-sans text-sm">{e.degree}</div>
                  </div>
                </div>
                <div className="text-muted-foreground flex-none text-right text-xs tabular-nums">{e.dates}</div>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Certifications() {
  const { from, to } = useBrand()
  return (
    <section id="certifications">
      <div className="flex min-h-0 flex-col gap-y-6">
        <BlurFade delay={0.05}>
          <H2>Certifications</H2>
        </BlurFade>
        <div className="grid gap-3 sm:grid-cols-2">
          {certifications.map((c, i) => (
            <BlurFade key={c.id} delay={i * 0.05} className="h-full">
              <div className="relative h-full rounded-xl">
                <Card className="h-full">
                  <div className="flex h-full flex-col gap-3 p-5">
                    <div className="flex items-start gap-3">
                      <Circle>
                        <Award className="text-brand size-full" />
                      </Circle>
                      <div>
                        <h3 className="leading-tight font-semibold">{c.name}</h3>
                        <p className="text-muted-foreground text-xs">
                          {c.issuer} · Issued {c.issued}
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">{c.description}</p>
                    <div className="mt-auto flex flex-wrap gap-1">
                      {c.skills.map((s) => (
                        <Badge key={s}>{s}</Badge>
                      ))}
                    </div>
                    <p className="text-muted-foreground font-mono text-[11px]">Credential ID: {c.id}</p>
                  </div>
                </Card>
                {i === 0 && <BorderBeam size={100} duration={10} colorFrom={from} colorTo={to} />}
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Skills() {
  return (
    <section id="skills">
      <div className="flex min-h-0 flex-col gap-y-4">
        <BlurFade delay={0.05}>
          <H2>Skills</H2>
        </BlurFade>
        <div className="flex flex-wrap gap-2">
          {skills.map((s, id) => (
            <BlurFade key={`${s}-${id}`} delay={(id % 10) * 0.04}>
              <div className="border-border bg-background ring-border/20 hover:border-brand flex h-8 w-fit items-center gap-2 rounded-xl border px-4 ring-2 transition-colors">
                <span className="text-foreground text-sm font-medium">{s}</span>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Highlights() {
  const { dark, from, to } = useBrand()
  const [featured, ...rest] = posts
  return (
    <section id="highlights">
      <div className="flex min-h-0 flex-col gap-y-6">
        <BlurFade delay={0.05}>
          <H2>Highlights</H2>
        </BlurFade>
        <BlurFade delay={0.05}>
          <div className="relative rounded-xl">
            <Card>
              <div className="flex flex-col gap-3 p-5 sm:p-6">
                <div className="text-brand flex items-center gap-2 text-sm font-semibold">
                  <BookOpen className="size-4" /> Featured · Free ebook
                </div>
                <p className="text-lg font-medium sm:text-xl">{featured.summary}</p>
                <a href={profile.ebook} target="_blank" rel="noreferrer" className="w-fit">
                  <ShimmerButton
                    background={dark ? "#fafafa" : "#0a0a0a"}
                    shimmerColor={dark ? "#c4704f" : "#e8a07f"}
                    className={dark ? "text-[#050505]" : "text-white"}
                  >
                    <span className="text-sm font-semibold">Get the free ebook</span>
                  </ShimmerButton>
                </a>
                <Stats p={featured} />
              </div>
            </Card>
            <BorderBeam size={140} duration={8} colorFrom={from} colorTo={to} />
          </div>
        </BlurFade>
        <ul className="border-border ml-4 space-y-5 border-l">
          {rest.map((p, i) => (
            <BlurFade key={p.summary} delay={i * 0.05}>
              <li className="relative ml-6">
                <span className="bg-brand ring-background absolute top-1.5 -left-[29px] size-2 rounded-full ring-4" />
                <p className="text-sm leading-relaxed sm:text-base">{p.summary}</p>
                <Stats p={p} />
              </li>
            </BlurFade>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Stats({ p }: { p: (typeof posts)[number] }) {
  if (p.reactions === null) return null
  return (
    <div className="text-muted-foreground mt-1 flex gap-4 text-xs">
      <span className="inline-flex items-center gap-1.5">
        <Heart className="size-3.5" /> {p.reactions}
      </span>
      {p.comments !== undefined && (
        <span className="inline-flex items-center gap-1.5">
          <MessageCircle className="size-3.5" /> {p.comments}
        </span>
      )}
    </div>
  )
}

export function Sketch() {
  return (
    <section id="sketch">
      <div className="flex min-h-0 flex-col gap-y-4">
        <BlurFade delay={0.05}>
          <H2>Sketch</H2>
        </BlurFade>
        <BlurFade delay={0.1}>
          <p className="text-muted-foreground text-sm">A pencil sketch, rebuilt from particles. Move your cursor, or drag a finger, across it.</p>
        </BlurFade>
        <BlurFade delay={0.15}>
          <SketchParticles />
        </BlurFade>
      </div>
    </section>
  )
}

export function Contact() {
  const { dark } = useBrand()
  const reduced = useReducedMotionPref()
  return (
    <section id="contact">
      <BlurFade delay={0.05}>
        <div className="border-border bg-background relative rounded-xl border p-8 sm:p-10">
          <div className="bg-primary border-border absolute -top-4 left-1/2 z-10 -translate-x-1/2 rounded-xl border px-4 py-1">
            <span className="text-background text-sm font-medium">Contact</span>
          </div>
          <div className="absolute inset-x-0 top-0 h-1/2 overflow-hidden rounded-xl">
            <FlickeringGrid
              className="h-full w-full"
              squareSize={2}
              gridGap={2}
              color={dark ? "rgb(232, 160, 127)" : "rgb(180, 83, 47)"}
              maxOpacity={0.35}
              flickerChance={reduced ? 0 : 0.2}
              style={{
                maskImage: "linear-gradient(to bottom, black, transparent)",
                WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
              }}
            />
          </div>
          <div className="relative flex flex-col items-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Get in Touch</h2>
            <p className="text-muted-foreground mx-auto max-w-lg text-balance">
              If you work in HR or youth programs, I'd love to connect. Reach out by email or find me on LinkedIn.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <a href={`mailto:${profile.email}`}>
                <ShimmerButton
                  background={dark ? "#fafafa" : "#0a0a0a"}
                  shimmerColor={dark ? "#c4704f" : "#e8a07f"}
                  className={dark ? "text-[#050505]" : "text-white"}
                >
                  <Mail className="mr-2 size-4" />
                  <span className="text-sm font-semibold break-all">{profile.email}</span>
                </ShimmerButton>
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="border-border bg-background hover:border-brand inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors"
              >
                <LinkedInIcon className="size-4" /> {profile.linkedinLabel}
              </a>
            </div>
          </div>
        </div>
      </BlurFade>
    </section>
  )
}
