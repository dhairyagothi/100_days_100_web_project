import React from 'react';
import { Post as PostType } from '../../types';
import PostHeader from './PostHeader';
import PostActions from './PostActions';

interface PostProps {
  post: PostType;
}

export default function Post({ post }: PostProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4">
        <PostHeader author={post.author} timestamp={post.timestamp} />
        <p className="mt-4">{post.content}</p>
      </div>
      
      <div className="px-4 py-2 border-t">
        <PostActions 
          likes={post.likes} 
          commentCount={post.comments.length}
        />
      </div>
    </div>
  );
}