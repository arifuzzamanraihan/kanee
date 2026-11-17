import { MapPin } from "lucide-react"

import { ParticleName } from "@/components/ParticleName"
import { BlurFade } from "@/components/ui/blur-fade"
import { BlurFadeText } from "@/components/ui/blur-fade-text"
import { BorderBeam } from "@/components/ui/border-beam"
import { Marquee } from "@/components/ui/marquee"
import { NumberTicker } from "@/components/ui/number-ticker"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { certifications, profile, skills } from "@/data"
import { useIsDark } from "@/lib/theme"

const D = 0.1

export function Hero() {
  const dark = useIsDark()
  const from = dark ? "#e8a07f" : "#b4532f"
  const to = dark ? "#ffffff" : "#d9825f"
  const stats = [
    { label: "Followers", value: profile.followers, suffix: "" },
    { label: "Connections", value: profile.connections, suffix: "+" },
    { label: "Skills", value: skills.length, suffix: "" },
    { label: "Certificates", value: certifications.length, suffix: "" },
  ]
  return (
    <section id="hero" className="pt-2 sm:pt-0">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-5 text-center">
        <BlurFade delay={D}>
          <div className="relative size-24 rounded-full md:size-28">
            <img
              src={`${import.meta.env.BASE_URL}avatar.jpg`}
              alt="Portrait of Kaneeta Zahid"
              width={300}
              height={300}
              className="border-border ring-muted size-full rounded-full border object-cover shadow-lg ring-4"
            />
            <BorderBeam size={60} duration={6} borderWidth={3} colorFrom={from} colorTo={to} className="rounded-full" />
          </div>
        </BlurFade>

        <div className="w-full">
          <div className="flex justify-center">
            <BlurFadeText delay={D * 2} yOffset={8} text="Hi, I'm" className="text-muted-foreground text-lg font-medium sm:text-xl" />
          </div>
          <h1 className="sr-only">Kaneeta Zahid</h1>
          <div className="-mb-8">
            <ParticleName text="Kaneeta Zahid" />
          </div>
        </div>

        <BlurFade delay={D * 8} className="w-full">
          <div className="text-brand flex min-h-7 items-center justify-center text-base font-semibold sm:text-lg">
            <TypingAnimation words={profile.roles} loop pauseDelay={1800} />
          </div>
        </BlurFade>

        <BlurFade delay={D * 9}>
          <p className="text-muted-foreground max-w-xl text-base text-balance sm:text-lg">{profile.tagline}</p>
        </BlurFade>

        <BlurFade delay={D * 10}>
          <p className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
            <MapPin className="size-4" /> {profile.location}
          </p>
        </BlurFade>

        <BlurFade delay={D * 11}>
          <div className="flex flex-wrap justify-center gap-2">
            {profile.headlineParts.map((p) => (
              <span
                key={p}
                className="border-border bg-background ring-border/20 flex h-8 w-fit items-center rounded-xl border px-4 text-sm font-medium ring-2"
              >
                {p}
              </span>
            ))}
          </div>
        </BlurFade>

        <BlurFade delay={D * 12} className="w-full">
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="border-border bg-background rounded-xl border px-3 py-3">
                <dd className="text-2xl font-bold tabular-nums">
                  <NumberTicker value={s.value} />
                  {s.suffix}
                </dd>
                <dt className="text-muted-foreground text-xs">{s.label}</dt>
              </div>
            ))}
          </dl>
        </BlurFade>

        <BlurFade delay={D * 13} className="w-full">
          <div
            className="relative -mx-6 overflow-hidden"
            style={{
              maskImage: "linear-gradient(to right, transparent, black 14%, black 86%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 14%, black 86%, transparent)",
            }}
          >
            <Marquee pauseOnHover className="[--duration:30s] [--gap:0.75rem]">
              {profile.focus.map((f) => (
                <span key={f} className="border-border bg-background text-muted-foreground rounded-full border px-4 py-1.5 text-sm font-medium whitespace-nowrap">
                  {f}
                </span>
              ))}
            </Marquee>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
