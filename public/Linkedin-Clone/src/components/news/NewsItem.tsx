import React from 'react';

interface NewsItemProps {
  title: string;
  readers: string;
}

export default function NewsItem({ title, readers }: NewsItemProps) {
  return (
    <li>
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-gray-500">{readers} readers</p>
    </li>
  );
}