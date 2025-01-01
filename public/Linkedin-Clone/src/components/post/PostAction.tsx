import React from 'react';

interface PostActionProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export default function PostAction({ icon, label, onClick }: PostActionProps) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}