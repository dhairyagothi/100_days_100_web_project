import React from "react";
import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/50 bg-background/50 py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo & Slogan */}
          <div className="flex items-center space-x-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="h-4 w-4 text-purple-400" />
            </div>
            <span className="text-base font-bold tracking-tight text-white">
              SkillBridge
            </span>
            <span className="text-xs text-muted-foreground hidden sm:inline-block">
              — Mapping your path to tech career excellence.
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs md:text-sm font-medium text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-purple-400">
              Home
            </Link>
            <Link href="/#explore-careers" className="transition-colors hover:text-purple-400">
              Careers
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-purple-400">
              Source Code
            </a>
            <a href="https://roadmap.sh" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-purple-400">
              Inspired by Roadmap.sh
            </a>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-8 border-t border-border/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SkillBridge. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="h-3 w-3 text-purple-400 fill-purple-400/20" /> for tech explorers.
          </p>
        </div>

      </div>
    </footer>
  );
}
