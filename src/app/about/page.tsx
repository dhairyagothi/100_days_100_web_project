import Link from "next/link"
import { Code2, MonitorSmartphone, Users } from "lucide-react"
import { Icons } from "@/components/icons"
import { FadeIn } from "@/components/animations/FadeIn"

export default function About() {
  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-4xl">
      <FadeIn>
        <div className="space-y-12">
          <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground font-geist-sans">
            About the Project
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              The <strong className="text-foreground font-medium">100 Days 100 Web Projects</strong> initiative is a journey of continuous learning and creation. This platform archives one hundred interactive web experiences built using vanilla HTML, CSS, JavaScript, and modern frameworks.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-card p-6 rounded-[1.5rem] border border-border/50">
              <Code2 className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Modern Stack</h3>
              <p className="text-sm text-muted-foreground">Migrated to Next.js 16, React 19, and Tailwind CSS v4 to deliver a high-performance, responsive experience.</p>
            </div>
            <div className="bg-card p-6 rounded-[1.5rem] border border-border/50">
              <MonitorSmartphone className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Taste Standard</h3>
              <p className="text-sm text-muted-foreground">Designed with the &apos;Taste Standard&apos; — featuring minimal borders, neutral tones, and precise typography.</p>
            </div>
            <div className="bg-card p-6 rounded-[1.5rem] border border-border/50">
              <Icons.gitHub className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Open Source</h3>
              <p className="text-sm text-muted-foreground">Maintained as an open-source project, welcoming contributions from the global developer community under GSSoC.</p>
            </div>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <h2>Why 100 Days?</h2>
            <p>
              Consistency is the key to mastery. By building a new project every day, or consistently over 100 sessions, developers encounter diverse challenges—from DOM manipulation to complex state management and API integrations. This repository serves as both a portfolio and a learning resource.
            </p>
            
            <h2>The Redesign</h2>
            <p>
              The legacy monolithic application has been refactored into a scalable, component-driven Next.js architecture. This upgrade improves SEO, accessibility, and maintainability, establishing it as a premium open-source repository.
            </p>
          </div>

          {/* Link to Contributors page */}
          <div className="pt-8 border-t border-border/50">
            <Link
              href="/contributors"
              className="group flex flex-col sm:flex-row items-center justify-between rounded-2xl border border-border/40 bg-card p-5 md:p-6 transition-all hover:shadow-lg hover:border-primary/30 gap-4"
            >
              <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Our Contributors</h3>
                  <p className="text-sm text-muted-foreground">Meet the amazing people who helped build this project.</p>
                </div>
              </div>
              <span className="hidden sm:block text-muted-foreground group-hover:text-foreground transition-colors text-2xl">→</span>
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  )
}
