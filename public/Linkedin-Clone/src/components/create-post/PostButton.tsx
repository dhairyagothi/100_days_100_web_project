import React from 'react';

interface PostButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export default function PostButton({ icon, label, onClick }: PostButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded"
    >
      {icon}
      <span className="text-sm text-gray-600">{label}</span>
    </button>
  );
}