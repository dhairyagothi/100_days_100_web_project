import { getContributors } from "@/lib/github";
import Image from "next/image";

export async function Contributors() {
  const contributors = await getContributors();

  if (contributors.length === 0) return null;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Our Contributors</h2>
        <p className="text-muted-foreground">The amazing people who helped build this project.</p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4">
        {contributors.map((contributor) => (
          <a
            key={contributor.login}
            href={contributor.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-border transition-all group-hover:border-primary group-hover:scale-110">
              <Image
                src={contributor.avatar_url}
                alt={contributor.login}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-popover px-2 py-1 text-xs font-medium text-popover-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100 z-10">
              {contributor.login} ({contributor.contributions})
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
