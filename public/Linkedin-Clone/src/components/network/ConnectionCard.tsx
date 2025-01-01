import React from 'react';
import { User } from '../../types';

const MOCK_CONNECTIONS = [
  {
    id: '1',
    name: 'Sarah Wilson',
    title: 'Product Designer at Design Co',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    mutualConnections: 12,
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Software Engineer at Tech Corp',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    mutualConnections: 8,
  },
];

export default function ConnectionCard() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">People you may know</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_CONNECTIONS.map((connection) => (
            <div key={connection.id} className="border rounded-lg p-4">
              <div className="flex items-start gap-4">
                <img
                  src={connection.avatar}
                  alt={connection.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{connection.name}</h3>
                  <p className="text-sm text-gray-600">{connection.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {connection.mutualConnections} mutual connections
                  </p>
                  <button className="mt-2 px-4 py-1 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50">
                    Connect
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}