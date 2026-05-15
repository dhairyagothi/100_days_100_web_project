"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { projects } from "@/data/projects"
import { ExternalLink } from "lucide-react"

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-4xl" ref={containerRef}>
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground font-geist-sans mb-4">
          Journey Timeline
        </h1>
        <p className="text-muted-foreground">
          A chronological view of the 100 days of web development.
        </p>
      </div>

      <div className="relative border-l border-border/50 ml-4 md:ml-0 md:border-none">
        {/* Central timeline line for desktop */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border/50 -translate-x-1/2" />

        {projects.map((project, index) => {
          const isEven = index % 2 === 0
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className={`relative flex items-center justify-between mb-12 md:mb-24 w-full ${
                isEven ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              <div className="hidden md:block w-5/12" />
              
              {/* Timeline Dot */}
              <div className="absolute left-[-5px] md:left-1/2 w-2.5 h-2.5 rounded-full bg-primary md:-translate-x-1/2 ring-4 ring-background" />

              {/* Content Card */}
              <div className="w-full pl-6 md:pl-0 md:w-5/12">
                <div className="bg-card p-6 rounded-[1.5rem] border border-border/40 shadow-sm hover:shadow-lg transition-shadow">
                  <span className="inline-block px-3 py-1 mb-4 text-xs font-mono font-medium text-primary bg-primary/10 rounded-full">
                    {project.day}
                  </span>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Completed as part of the 100 Days of Web Projects challenge. Focuses on core frontend principles and interactive UI design.
                  </p>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    View Project <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
