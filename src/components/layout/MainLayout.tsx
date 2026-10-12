import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ToastContainer } from '../ui/Toast';
import { useApp } from '../../context/AppContext';

export const MainLayout: React.FC = () => {
  const { sidebarCollapsed } = useApp();

  return (
    <div className="min-h-screen bg-[#07080f] text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background Ambience: Subtle Stars, Mesh & Glowing Cosmic Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Deep Violet Top Orb */}
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[130px] animate-pulse-slow" />
        {/* Electric Cyan Right Orb */}
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-cyan-600/10 rounded-full blur-[140px]" />
        {/* Blue Center/Bottom Orb */}
        <div className="absolute -bottom-40 left-1/3 w-[650px] h-[650px] bg-blue-600/10 rounded-full blur-[150px]" />
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      </div>

      {/* Main Sidebar */}
      <Sidebar />

      {/* Top Navbar */}
      <Navbar />

      {/* Content Area */}
      <main
        className={`flex-1 relative z-10 transition-all duration-300 p-4 sm:p-8 max-w-7xl w-full mx-auto ${
          sidebarCollapsed ? 'lg:pl-24' : 'lg:pl-72'
        }`}
      >
        <Outlet />
      </main>

      {/* Platform Footer */}
      <footer
        className={`relative z-10 py-6 px-8 border-t border-white/5 text-center text-xs text-slate-300 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white tracking-wider">PRISM</span>
            <span>— Next-Gen Collegiate Experience Platform</span>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <span>© 2026 PRISM Technologies</span>
            <span className="hover:text-purple-300 transition-colors">Privacy & Security</span>
            <span className="hover:text-purple-300 transition-colors">Campus Life Code</span>
          </div>
        </div>
      </footer>

      {/* Floating Notifications */}
      <ToastContainer />
    </div>
  );
};
