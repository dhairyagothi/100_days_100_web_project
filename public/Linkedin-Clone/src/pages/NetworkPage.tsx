import React from 'react';
import ConnectionCard from '../components/network/ConnectionCard';
import PendingInvitations from '../components/network/PendingInvitations';

export default function NetworkPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1">
        <PendingInvitations />
      </div>
      <div className="md:col-span-2">
        <ConnectionCard />
      </div>
    </div>
  );
}