import React from 'react';
import { User } from '../../types';

interface PostHeaderProps {
  author: User;
  timestamp: string;
}

export default function PostHeader({ author, timestamp }: PostHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={author.avatar}
        alt={author.name}
        className="w-12 h-12 rounded-full"
      />
      <div>
        <h3 className="font-semibold">{author.name}</h3>
        <p className="text-sm text-gray-500">{author.title}</p>
        <p className="text-xs text-gray-400">{timestamp}</p>
      </div>
    </div>
  );
}