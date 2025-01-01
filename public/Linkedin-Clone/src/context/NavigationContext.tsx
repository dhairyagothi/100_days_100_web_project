import React, { createContext, useContext, useState } from 'react';

type NavigationTab = 'home' | 'network' | 'jobs' | 'messaging' | 'notifications';

interface NavigationContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');

  return (
    <NavigationContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}