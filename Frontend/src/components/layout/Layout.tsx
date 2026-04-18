import React, { useLayoutEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { Loading } from '../common/Loading.tsx';

export const Layout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  useLayoutEffect(() => {
    const html = window.document.documentElement;
    const body = window.document.body;
    
    // Set color scheme for browser elements
    html.style.colorScheme = isDarkMode ? 'dark' : 'light';
    
    // Most important: Sync the global 'dark' class on BOTH html and body
    if (isDarkMode) {
      html.classList.add('dark');
      body.classList.add('dark');
    } else {
      html.classList.remove('dark');
      body.classList.remove('dark');
    }
  }, [isDarkMode]);

  if (isLoading) {
    return <Loading fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={`min-h-screen flex flex-col sm:flex-row transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar />
      <main className="flex-1 pb-24 sm:pb-0 sm:h-screen overflow-y-auto">
        <div className="max-w-6xl mx-auto p-4 sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
