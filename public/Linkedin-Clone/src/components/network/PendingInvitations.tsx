import React from 'react';

const MOCK_INVITATIONS = [
  {
    id: '1',
    name: 'Emily Brown',
    title: 'Marketing Manager',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    timeAgo: '3d',
  },
];

export default function PendingInvitations() {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold mb-4">Pending Invitations</h2>
      <div className="space-y-4">
        {MOCK_INVITATIONS.map((invitation) => (
          <div key={invitation.id} className="flex items-start gap-4">
            <img
              src={invitation.avatar}
              alt={invitation.name}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{invitation.name}</h3>
              <p className="text-sm text-gray-600">{invitation.title}</p>
              <p className="text-xs text-gray-500">{invitation.timeAgo}</p>
              <div className="flex gap-2 mt-2">
                <button className="px-4 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                  Accept
                </button>
                <button className="px-4 py-1 border border-gray-400 rounded-full hover:bg-gray-50">
                  Ignore
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}