import React, { useState } from 'react';
import { Image, Video, Calendar, FileText } from 'lucide-react';
import PostButton from './PostButton';

export default function CreatePost() {
  const [content, setContent] = useState('');

  const handlePost = () => {
    if (!content.trim()) return;
    // Handle post creation
    setContent('');
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex gap-4">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
          alt="Profile"
          className="w-12 h-12 rounded-full"
        />
        <button
          onClick={() => {}} 
          className="flex-1 text-left px-4 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500"
        >
          Start a post
        </button>
      </div>
      
      <div className="flex justify-between mt-4 pt-4 border-t">
        <PostButton icon={<Image className="text-blue-500" />} label="Photo" />
        <PostButton icon={<Video className="text-green-500" />} label="Video" />
        <PostButton icon={<Calendar className="text-orange-500" />} label="Event" />
        <PostButton icon={<FileText className="text-rose-500" />} label="Write article" />
      </div>
    </div>
  );
}