import React, { useState } from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Sidebar } from './Sidebar';
import { AboutModal } from '../AboutModal';
import type { View } from '../../App';

interface LayoutProps {
  children: React.ReactNode;
  activeView: View;
  setActiveView: (view: View) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
      <Header 
        onAboutClick={() => setIsAboutModalOpen(true)}
        onMenuClick={() => setMobileSidebarOpen(true)} 
      />
      <div className="flex flex-grow w-full max-w-7xl mx-auto relative">
        {/* Overlay for mobile */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-x-0 top-16 bottom-0 bg-black/50 z-30 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          ></div>
        )}
        <Sidebar 
          activeView={activeView} 
          setActiveView={setActiveView}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <Footer />
      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
    </div>
  );
};