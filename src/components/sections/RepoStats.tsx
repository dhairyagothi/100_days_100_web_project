import { getRepoStats } from "@/lib/github";
import { Star, GitFork, AlertCircle, GitPullRequest } from "lucide-react";

export async function RepoStats() {
  const stats = await getRepoStats();

  const statItems = [
    { label: "Stars", value: stats.stars, icon: Star, color: "text-yellow-500" },
    { label: "Forks", value: stats.forks, icon: GitFork, color: "text-blue-500" },
    { label: "Issues", value: stats.openIssues, icon: AlertCircle, color: "text-green-500" },
    { label: "PRs", value: stats.pullRequests, icon: GitPullRequest, color: "text-purple-500" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {statItems.map((item) => (
        <div 
          key={item.label}
          className="bg-card/50 backdrop-blur-sm border border-border/50 p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 hover:border-primary/20 transition-colors"
        >
          <item.icon className={`h-5 w-5 ${item.color}`} />
          <span className="text-2xl font-bold font-geist-mono">{item.value.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
