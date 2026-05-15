"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function Preloader() {
  const [loading, setLoading] = useState(true)
  const [percentage, setPercentage] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Percentage counter animation
    const interval = setInterval(() => {
      setPercentage((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return Math.min(prev + 2, 100)
      })
    }, 30)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (percentage === 100) {
      const timer = setTimeout(() => {
        setLoading(false)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [percentage])

  if (!isClient || !loading) return null

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-8 px-4">
        <div className="flex flex-col items-center gap-4">
          <span className="text-6xl md:text-8xl font-bold font-geist-sans tracking-tighter text-foreground">
            100<span className="text-muted-foreground italic">DAYS</span>
          </span>
          
          <div className="h-[2px] w-64 bg-muted overflow-hidden rounded-full">
            <div 
              className="h-full bg-foreground transition-all duration-100"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground uppercase tracking-[0.3em]">
          <span>INITIALIZING</span>
          <span className="w-12 text-right text-foreground font-bold">{percentage}%</span>
        </div>
      </div>
    </div>
  )
}
