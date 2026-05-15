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
      <div className="container flex h-14 max-w-screen-2xl items-center mx-auto px-4">
        {/* Mobile menu toggle */}
        <button
          className="mr-2 inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Desktop brand + nav */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold font-geist-sans">
              100 Days 100 Web Projects
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-foreground/80 ${
                  pathname === link.href ? "text-foreground font-medium" : "text-foreground/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile brand */}
        <Link href="/" className="mr-auto font-bold font-geist-sans text-sm md:hidden">
          100D100P
        </Link>

        {/* Right side actions — always visible */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <CommandPalette />
          </div>

          <Link
            href="https://github.com/dhairyagothi/100_days_100_web_project"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
          >
            <Icons.gitHub className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </Link>

          <ThemeToggle />
          <UserNav />
        </div>
      </div>

      {/* Mobile dropdown nav */}
      {mobileOpen && (
        <div className="border-t border-border/40 bg-background md:hidden">
          <nav className="container mx-auto flex flex-col px-4 py-3 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent ${
                  pathname === link.href
                    ? "bg-accent text-foreground font-medium"
                    : "text-foreground/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 sm:hidden">
              <CommandPalette />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
