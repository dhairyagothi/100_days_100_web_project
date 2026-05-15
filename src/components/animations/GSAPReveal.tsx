"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface GSAPRevealProps {
  children: React.ReactNode
  direction?: "up" | "down" | "left" | "right"
  delay?: number
  duration?: number
  distance?: number
}

export function GSAPReveal({ 
  children, 
  direction = "up", 
  delay = 0, 
  duration = 1, 
  distance = 50 
}: GSAPRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    let x = 0
    let y = 0

    if (direction === "up") y = distance
    if (direction === "down") y = -distance
    if (direction === "left") x = distance
    if (direction === "right") x = -distance

    gsap.fromTo(
      element,
      { opacity: 0, x, y },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 90%",
          toggleActions: "play none none none"
        }
      }
    )
  }, [direction, delay, duration, distance])

  return <div ref={elementRef}>{children}</div>
}
