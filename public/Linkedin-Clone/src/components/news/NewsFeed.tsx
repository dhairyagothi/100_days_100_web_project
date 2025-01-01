import React from 'react';
import NewsItem from './NewsItem';

const NEWS_ITEMS = [
  { title: "Top news in tech", readers: "64,288" },
  { title: "The future of remote work", readers: "45,123" },
  { title: "AI trends in 2024", readers: "32,876" }
];

export default function NewsFeed() {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold mb-4">LinkedIn News</h2>
      <ul className="space-y-4">
        {NEWS_ITEMS.map((item, index) => (
          <NewsItem key={index} {...item} />
        ))}
      </ul>
    </div>
  );
}