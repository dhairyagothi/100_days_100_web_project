"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Menu, X, Compass, Route, Info } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6">
                <Sparkles className="h-5 w-5 text-purple-400" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white transition-colors group-hover:text-purple-400">
                SkillBridge
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-purple-400"
              >
                <Compass className="h-4 w-4" />
                Explore Careers
              </Link>
              <Link
                href="/#roadmaps"
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-purple-400"
              >
                <Route className="h-4 w-4" />
                Learning Roadmaps
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-purple-400"
              >
                GitHub Project
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-border bg-background/95 px-4 pt-2 pb-4 space-y-1 transition-all duration-300 animate-in slide-in-from-top-5">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-purple-400"
          >
            <Compass className="h-5 w-5" />
            Explore Careers
          </Link>
          <Link
            href="/#roadmaps"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-purple-400"
          >
            <Route className="h-5 w-5" />
            Learning Roadmaps
          </Link>
          <a
            href="https://github.com"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-purple-400"
          >
            GitHub Project
          </a>
        </div>
      )}
    </nav>
  );
}
