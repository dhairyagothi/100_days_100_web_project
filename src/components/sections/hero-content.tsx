"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { RepoStatsDisplay } from "./repo-stats-display"
import { GitHubStats } from "../../lib/github"

interface HeroContentProps {
  stats: GitHubStats
  onExplore: () => void
  showGrid: boolean
}

export function HeroContent({ stats, onExplore, showGrid }: HeroContentProps) {
  return (
    <div className="container mx-auto max-w-5xl text-center space-y-12 py-20 relative z-10">
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
        <RepoStatsDisplay stats={stats} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="pt-8 flex flex-col items-center gap-4"
      >
        <button
          onClick={onExplore}
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
  )
}
