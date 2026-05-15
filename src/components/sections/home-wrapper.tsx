"use client"

import * as React from "react"
import { HeroContent } from "./hero-content"
import { GitHubStats } from "../../lib/github"

export function HomeWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
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
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-background px-4 border-2 border-red-500">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[120px] opacity-50" />
          <div className="absolute bottom-1/4 left-1/4 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] opacity-30" />
        </div>

        <HeroContent 
          onExplore={handleExplore} 
          showGrid={showGrid} 
        />
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
          {children}
        </div>
      </section>
    </div>
  )
}
