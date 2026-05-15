"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"

export function Preloader() {
  const [loading, setLoading] = useState(true)
  const [percentage, setPercentage] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Safety timeout to ensure preloader always closes
    const safetyTimeout = setTimeout(() => {
      setLoading(false)
    }, 8000)

    // Percentage counter animation
    const interval = setInterval(() => {
      setPercentage((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        const increment = Math.random() > 0.8 ? 2 : 1
        return Math.min(prev + increment, 100)
      })
    }, 40)

    return () => {
      clearInterval(interval)
      clearTimeout(safetyTimeout)
    }
  }, [])

  useEffect(() => {
    if (percentage === 100 && isClient) {
      try {
        const tl = gsap.timeline({
          onComplete: () => setLoading(false)
        })

        tl.to(".preloader-content", {
          opacity: 0,
          y: -40,
          duration: 0.8,
          ease: "power3.inOut"
        })
        .to(".preloader-panel", {
          height: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "expo.inOut"
        })
      } catch (error) {
        console.error("Preloader GSAP Error:", error)
        setLoading(false)
      }
    }
  }, [percentage, isClient])

  if (!isClient) return null

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div 
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-background"
        >
          {/* Background Panels */}
          <div className="preloader-panel absolute inset-0 bg-background z-10 w-full h-full" />
          <div className="preloader-panel absolute inset-0 bg-primary/5 z-0 w-full h-full" style={{ top: "100%" }} />
          
          <div className="preloader-content relative z-20 flex flex-col items-center gap-6 px-4">
            <div className="flex flex-col items-center gap-4">
              <span className="text-5xl md:text-7xl font-bold font-geist-sans tracking-tighter text-foreground">
                100<span className="text-muted-foreground italic">DAYS</span>
              </span>
              <div className="h-[3px] w-64 bg-muted overflow-hidden rounded-full">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs md:text-sm font-mono text-muted-foreground uppercase tracking-[0.2em]">
              <span>LOADING EXPERIENCE</span>
              <span className="w-12 text-right text-foreground font-bold">{percentage}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
