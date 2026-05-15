"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"

interface Contributor {
  login: string
  avatar_url: string
  html_url: string
  contributions: number
}

export function ContributorGrid({ contributors }: { contributors: Contributor[] }) {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gridRef.current) return

    const cards = gridRef.current.querySelectorAll(".contributor-card")
    gsap.fromTo(
      cards,
      { 
        opacity: 0, 
        y: 30,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.05,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%"
        }
      }
    )
  }, [contributors])

  return (
    <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {contributors.map((contributor) => (
        <a
          key={contributor.login}
          href={contributor.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="contributor-card group flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card p-6 transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30"
        >
          <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-border transition-all group-hover:border-primary">
            <Image
              src={contributor.avatar_url}
              alt={contributor.login}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold truncate max-w-[120px]">
              {contributor.login}
            </p>
            <p className="text-xs text-muted-foreground">
              {contributor.contributions} {contributor.contributions === 1 ? "commit" : "commits"}
            </p>
          </div>
        </a>
      ))}
    </div>
  )
}
