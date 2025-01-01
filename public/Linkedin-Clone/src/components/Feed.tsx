import React from 'react';
import Post from './post/Post';
import CreatePost from './create-post/CreatePost';
import { MOCK_POSTS } from '../data/mockPosts';

export default function Feed() {
  return (
    <div className="space-y-4">
      <CreatePost />
      {MOCK_POSTS.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}