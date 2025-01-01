import React from 'react';
import { Search, Home, Users2, Briefcase, MessageSquare, Bell, Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
              />
            </svg>
            
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <NavItem icon={<Home />} label="Home" active />
            <NavItem icon={<Users2 />} label="Network" />
            <NavItem icon={<Briefcase />} label="Jobs" />
            <NavItem icon={<MessageSquare />} label="Messaging" />
            <NavItem icon={<Bell />} label="Notifications" />
            <div className="h-8 w-8 rounded-full bg-gray-200 cursor-pointer" />
          </nav>

          <button className="md:hidden">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}

function NavItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <div className={`flex flex-col items-center cursor-pointer ${active ? 'text-black' : 'text-gray-500'} hover:text-black`}>
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </div>
  );
}