import React from "react";

interface SkillBadgeProps {
  name: string;
}

export default function SkillBadge({ name }: SkillBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-lg border border-purple-500/20 bg-purple-500/5 px-3 py-1 text-xs font-medium text-purple-300 transition-all hover:bg-purple-500/15 hover:border-purple-500/30">
      {name}
    </span>
  );
}
