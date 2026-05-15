import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto px-4">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with Taste Standard by{" "}
          <a
            href="https://github.com/dhairyagothi"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Dhairya Gothi
          </a>
          . Open source initiative for GSSoC.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/about" className="text-sm font-medium underline underline-offset-4 text-muted-foreground">
            About
          </Link>
          <Link href="/timeline" className="text-sm font-medium underline underline-offset-4 text-muted-foreground">
            Timeline
          </Link>
        </div>
      </div>
    </footer>
  )
}
