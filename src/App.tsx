import { Background } from "@/components/Background"
import { DockNav } from "@/components/DockNav"
import { ScrollProgress } from "@/components/ScrollProgress"
import { profile } from "@/data"
import { Hero } from "@/sections/Hero"
import { About, Certifications, Contact, Education, Highlights, Sketch, Skills, Work } from "@/sections/Sections"

export default function App() {
  return (
    <div className="bg-background text-foreground relative min-h-dvh overflow-x-clip">
      <Background />
      <ScrollProgress />
      <div className="relative z-10 mx-auto max-w-2xl px-6 py-12 pb-28 sm:py-20 sm:pb-32">
        <main className="relative flex flex-col gap-14">
          <Hero />
          <About />
          <Work />
          <Education />
          <Certifications />
          <Skills />
          <Highlights />
          <Sketch />
          <Contact />
        </main>
        <footer className="text-muted-foreground mt-14 text-center text-sm">© 2026 {profile.name}</footer>
      </div>
      <DockNav />
    </div>
  )
}
