import React, { useState } from 'react';
import { Search, Home, Users2, Briefcase, MessageSquare, Bell, Menu, X } from 'lucide-react';
import NavItem from './NavItem';
import LinkedInLogo from './LinkedInLogo';
import { useNavigation } from '../../context/NavigationContext';
import MobileMenu from './MobileMenu';

export default function Header() {
  const { activeTab, setActiveTab } = useNavigation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <LinkedInLogo />
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </form>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <NavItem 
              icon={<Home />} 
              label="Home" 
              active={activeTab === 'home'}
              onClick={() => setActiveTab('home')}
            />
            <NavItem 
              icon={<Users2 />} 
              label="Network" 
              active={activeTab === 'network'}
              onClick={() => setActiveTab('network')}
            />
            <NavItem 
              icon={<Briefcase />} 
              label="Jobs" 
              active={activeTab === 'jobs'}
              onClick={() => setActiveTab('jobs')}
            />
            <NavItem 
              icon={<MessageSquare />} 
              label="Messaging" 
              active={activeTab === 'messaging'}
              onClick={() => setActiveTab('messaging')}
            />
            <NavItem 
              icon={<Bell />} 
              label="Notifications" 
              active={activeTab === 'notifications'}
              onClick={() => setActiveTab('notifications')}
            />
            <div className="h-8 w-8 rounded-full bg-gray-200 cursor-pointer" />
          </nav>

          <button 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && <MobileMenu />}
    </header>
  );
}