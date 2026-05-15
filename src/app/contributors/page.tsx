import { getContributors } from "@/lib/github"
import Image from "next/image"
import { Users, GitCommit } from "lucide-react"

export const metadata = {
  title: "Contributors — 100 Days 100 Web Projects",
  description: "Meet the amazing people who helped build this project.",
}

export default async function ContributorsPage() {
  const contributors = await getContributors()
  const totalCommits = contributors.reduce((sum, c) => sum + c.contributions, 0)

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-screen-2xl">
      {/* Header */}
      <div className="text-center space-y-4 mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground font-geist-sans">
          Our Contributors
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          This project is built by an incredible community. Thank you to everyone who has contributed!
        </p>

        {/* Stats row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="font-semibold text-foreground">{contributors.length}</span> Contributors
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GitCommit className="h-4 w-4" />
            <span className="font-semibold text-foreground">{totalCommits.toLocaleString()}</span> Total Commits
          </div>
        </div>
      </div>

      {/* Contributor Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {contributors.map((contributor) => (
          <a
            key={contributor.login}
            href={contributor.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card p-6 transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30"
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
    </div>
  )
}
