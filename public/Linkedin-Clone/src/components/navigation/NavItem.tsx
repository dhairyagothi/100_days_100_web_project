import React from 'react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export default function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center md:flex-col cursor-pointer ${
        active ? 'text-black' : 'text-gray-500'
      } hover:text-black transition-colors duration-200`}
    >
      <div className="relative">
        {icon}
        {label === 'Notifications' && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        )}
      </div>
      <span className="text-xs mt-1 ml-2 md:ml-0">{label}</span>
    </div>
  );
}