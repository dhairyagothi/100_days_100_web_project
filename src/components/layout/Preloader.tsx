"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import gsap from "gsap"

export function Preloader() {
  const [loading, setLoading] = useState(true)
  const [percentage, setPercentage] = useState(0)

  useEffect(() => {
    // Percentage counter animation
    const interval = setInterval(() => {
      setPercentage((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 15)

    // GSAP sequence for the exit
    const tl = gsap.timeline({
      onComplete: () => setLoading(false)
    })

    if (percentage === 100) {
      tl.to(".preloader-content", {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "power2.inOut"
      })
      .to(".preloader-panel", {
        height: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "expo.inOut"
      })
    }

    return () => clearInterval(interval)
  }, [percentage])

  return (
    <AnimatePresence>
      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden">
          {/* Background Panels */}
          <div className="preloader-panel absolute inset-0 bg-background z-10" />
          <div className="preloader-panel absolute inset-0 bg-primary/5 z-0" style={{ top: "100%" }} />
          
          <div className="preloader-content relative z-20 flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl md:text-6xl font-bold font-geist-sans tracking-tighter">
                100<span className="text-muted-foreground italic">DAYS</span>
              </span>
              <div className="h-[2px] w-48 bg-muted overflow-hidden rounded-full">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm font-mono text-muted-foreground">
              <span>LOADING EXPERIENCE</span>
              <span className="w-12 text-right">{percentage}%</span>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
