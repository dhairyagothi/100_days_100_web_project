import React from 'react';
import Header from './components/navigation/Header';
import HomePage from './pages/HomePage';
import NetworkPage from './pages/NetworkPage';
import JobsPage from './pages/JobsPage';
import { NavigationProvider, useNavigation } from './context/NavigationContext';

function MainContent() {
  const { activeTab } = useNavigation();

  return (
    <main className="max-w-6xl mx-auto px-4 pt-20">
      {activeTab === 'home' && <HomePage />}
      {activeTab === 'network' && <NetworkPage />}
      {activeTab === 'jobs' && <JobsPage />}
      {activeTab === 'messaging' && <div>Messaging coming soon...</div>}
      {activeTab === 'notifications' && <div>Notifications coming soon...</div>}
    </main>
  );
}

export default function App() {
  return (
    <NavigationProvider>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <MainContent />
      </div>
    </NavigationProvider>
  );
}