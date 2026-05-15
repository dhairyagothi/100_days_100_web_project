"use client"

import * as React from "react"
import { projects } from "@/data/projects"
import { ProjectGrid } from "@/components/ProjectGrid"
import { RepoStats } from "@/components/sections/RepoStats"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

export default function Home() {
  const [showGrid, setShowGrid] = React.useState(false)
  const gridRef = React.useRef<HTMLDivElement>(null)

  const handleExplore = () => {
    setShowGrid(true)
    setTimeout(() => {
      gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section - Expanded */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-background px-4">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[120px] opacity-50" />
          <div className="absolute bottom-1/4 left-1/4 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] opacity-30" />
        </div>

        <div className="container mx-auto max-w-5xl text-center space-y-12 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter text-foreground font-geist-sans leading-[1.1]">
              100 Days of <br />
              <span className="text-muted-foreground/40 italic font-medium">Modern</span> Code
            </h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              An immersive journey through 100 days of continuous web development. 
              Exploring cutting-edge technologies, building interactive experiences, 
              and pushing the boundaries of the frontend ecosystem.
            </motion.p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="w-full max-w-3xl mx-auto"
          >
            <RepoStats />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="pt-8 flex flex-col items-center gap-4"
          >
            <button
              onClick={handleExplore}
              className="group relative flex items-center gap-2 bg-foreground text-background px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-foreground/10"
            >
              Explore Projects
              <ChevronDown className={`h-5 w-5 transition-transform duration-300 animate-bounce ${showGrid ? 'rotate-180 animate-none' : 'group-hover:translate-y-1'}`} />
            </button>
            <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase opacity-50">
              Scroll or click to discover
            </p>
          </motion.div>
        </div>
      </section>

      {/* Project Grid Section - Conditional */}
      <section 
        ref={gridRef}
        className={`w-full bg-background transition-opacity duration-700 ${showGrid ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}
      >
        <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8 max-w-screen-2xl">
          <div className="flex flex-col space-y-4 mb-16 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">The Collection</h2>
            <div className="h-1 w-20 bg-primary rounded-full" />
          </div>
          <ProjectGrid projects={projects} />
        </div>
      </section>
    </div>
  )
}
