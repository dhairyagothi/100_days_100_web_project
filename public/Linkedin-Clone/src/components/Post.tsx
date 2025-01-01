import React from 'react';
import { ThumbsUp, MessageSquare, Share2, Send } from 'lucide-react';
import { Post as PostType } from '../types';

interface PostProps {
  post: PostType;
}

export default function Post({ post }: PostProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="font-semibold">{post.author.name}</h3>
            <p className="text-sm text-gray-500">{post.author.title}</p>
            <p className="text-xs text-gray-400">{post.timestamp}</p>
          </div>
        </div>
        
        <p className="mt-4">{post.content}</p>
      </div>
      
      <div className="px-4 py-2 border-t">
        <div className="flex justify-between">
          <PostAction icon={<ThumbsUp />} label={`${post.likes} Likes`} />
          <PostAction icon={<MessageSquare />} label={`${post.comments.length} Comments`} />
          <PostAction icon={<Share2 />} label="Share" />
          <PostAction icon={<Send />} label="Send" />
        </div>
      </div>
    </div>
  );
}

function PostAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}