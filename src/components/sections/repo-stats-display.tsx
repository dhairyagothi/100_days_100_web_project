"use client"

import { Star, GitFork, AlertCircle, GitPullRequest } from "lucide-react";
import { motion } from "framer-motion"
import { GitHubStats } from "../../lib/github";

export function RepoStatsDisplay({ stats }: { stats: GitHubStats | null }) {
  const statItems = [
    { label: "Stars", value: stats?.stars ?? 0, icon: Star, color: "text-yellow-500" },
    { label: "Forks", value: stats?.forks ?? 0, icon: GitFork, color: "text-blue-500" },
    { label: "Issues", value: stats?.openIssues ?? 0, icon: AlertCircle, color: "text-green-500" },
    { label: "PRs", value: stats?.pullRequests ?? 0, icon: GitPullRequest, color: "text-purple-500" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full">
      {statItems.map((item) => (
        <motion.div 
          key={item.label}
          whileHover={{ y: -5, scale: 1.02 }}
          className="bg-card/50 backdrop-blur-sm border border-border/50 p-3 md:p-4 rounded-2xl flex flex-col items-center justify-center space-y-1.5 md:space-y-2 hover:border-primary/20 transition-colors cursor-default"
        >
          <item.icon className={`h-4 w-4 md:h-5 md:w-5 ${item.color}`} />
          <span className="text-xl md:text-2xl font-bold font-geist-mono">{item.value.toLocaleString()}</span>
          <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest">{item.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
