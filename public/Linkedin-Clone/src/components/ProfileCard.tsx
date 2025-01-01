import React from 'react';
import { User } from '../types';

interface ProfileCardProps {
  user: User;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div 
        className="h-24 bg-cover bg-center"
        style={{
          backgroundImage: `url(${user.backgroundImage || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809'})`,
        }}
      />
      <div className="p-4 relative">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-16 h-16 rounded-full border-4 border-white absolute -top-8 left-4"
        />
        <div className="mt-8">
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-600">{user.title}</p>
          <div className="mt-4 text-sm text-gray-600">
            <p>{user.connections} connections</p>
          </div>
        </div>
        <button className="mt-4 w-full bg-blue-600 text-white rounded-full py-1.5 font-medium hover:bg-blue-700">
          View Profile
        </button>
      </div>
    </div>
  );
}