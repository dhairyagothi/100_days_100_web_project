"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ExternalLink, Star } from "lucide-react"
import { useFavorites } from "@/hooks/useFavorites"
import { Project } from "@/data/projects"

interface ProjectGridProps {
  projects: Project[]
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          variants={item}
          className="group relative"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="relative h-full overflow-hidden rounded-[1.5rem] bg-card p-5 sm:p-6 border border-border/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] sm:text-xs font-medium text-primary font-mono">
                {project.day}
              </span>
              <button
                onClick={() => toggleFavorite(project.id)}
                className={`p-1.5 sm:p-2 rounded-full transition-colors ${isFavorite(project.id) ? 'text-yellow-500' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Star className="h-4 w-4" fill={isFavorite(project.id) ? "currentColor" : "none"} />
              </button>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-1">{project.title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-6 line-clamp-2">
              Interactive web project built during the 100 days of code challenge.
            </p>
            
            <div className="flex items-center justify-between mt-auto">
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-sm font-medium text-primary hover:underline underline-offset-4"
              >
                View Live <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>

            {/* Minimal hover overlay effect */}
            {hoveredIndex === index && (
              <motion.div
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 -z-10 rounded-[1.5rem] bg-accent/50 backdrop-blur-3xl"
              />
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
