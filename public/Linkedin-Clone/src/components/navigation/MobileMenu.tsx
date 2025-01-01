import React from 'react';
import { Home, Users2, Briefcase, MessageSquare, Bell } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import NavItem from './NavItem';

export default function MobileMenu() {
  const { activeTab, setActiveTab } = useNavigation();

  return (
    <div className="md:hidden fixed top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
      <div className="p-4 space-y-4">
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
      </div>
    </div>
  );
}