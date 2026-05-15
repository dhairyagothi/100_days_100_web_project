"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

import { CommandPalette } from "@/components/CommandPalette"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { UserNav } from "@/components/layout/UserNav"

const navLinks = [
  { href: "/", label: "Grid" },
  { href: "/timeline", label: "Timeline" },
  { href: "/contributors", label: "Contributors" },
  { href: "/about", label: "About" },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center mx-auto px-4 md:px-8">
        {/* Mobile menu toggle */}
        <button
          className="mr-4 inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Desktop brand + nav */}
        <div className="mr-8 hidden md:flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <span className="font-bold font-geist-sans text-lg tracking-tight">
              100<span className="text-muted-foreground">DAYS</span>
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-foreground/80 ${
                  pathname === link.href ? "text-foreground" : "text-foreground/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile brand */}
        <Link href="/" className="mr-auto font-bold font-geist-sans text-base md:hidden">
          100<span className="text-muted-foreground">DAYS</span>
        </Link>

        {/* Right side actions — with better breathing room */}
        <div className="flex flex-1 items-center justify-end gap-3 md:gap-4">
          <div className="w-full max-w-[200px] hidden lg:block">
            <CommandPalette />
          </div>
          
          <div className="flex items-center gap-1.5 md:gap-2">
            <Link
              href="https://github.com/dhairyagothi/100_days_100_web_project"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9 border border-transparent hover:border-border/50"
            >
              <Icons.gitHub className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>

            <ThemeToggle />
          </div>

          <div className="hidden h-6 w-[1px] bg-border/50 md:block" />

          <UserNav />
        </div>
      </div>

      {/* Mobile dropdown nav */}
      {mobileOpen && (
        <div className="border-t border-border/40 bg-background/95 backdrop-blur md:hidden">
          <nav className="container mx-auto flex flex-col px-4 py-6 gap-2">
            <div className="mb-4 sm:hidden">
              <CommandPalette />
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center rounded-xl px-4 py-3 text-base transition-colors hover:bg-accent ${
                  pathname === link.href
                    ? "bg-accent text-foreground font-semibold"
                    : "text-foreground/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
