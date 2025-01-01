import React from 'react';
import { ThumbsUp, MessageSquare, Share2, Send } from 'lucide-react';
import PostAction from './PostAction';

interface PostActionsProps {
  likes: number;
  commentCount: number;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onSend?: () => void;
}

export default function PostActions({ 
  likes, 
  commentCount, 
  onLike, 
  onComment, 
  onShare, 
  onSend 
}: PostActionsProps) {
  return (
    <div className="flex justify-between">
      <PostAction icon={<ThumbsUp />} label={`${likes} Likes`} onClick={onLike} />
      <PostAction icon={<MessageSquare />} label={`${commentCount} Comments`} onClick={onComment} />
      <PostAction icon={<Share2 />} label="Share" onClick={onShare} />
      <PostAction icon={<Send />} label="Send" onClick={onSend} />
    </div>
  );
}