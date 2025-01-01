import React from 'react';
import Feed from '../components/Feed';
import ProfileCard from '../components/ProfileCard';
import NewsFeed from '../components/news/NewsFeed';
import { currentUser } from '../data/mockData';

export default function HomePage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="md:col-span-1">
        <ProfileCard user={currentUser} />
      </div>
      <div className="md:col-span-2">
        <Feed />
      </div>
      <div className="md:col-span-1">
        <NewsFeed />
      </div>
    </div>
  );
}