import { NavLink, useNavigate } from 'react-router-dom';
import {
  Dumbbell,
  LayoutDashboard,
  ClipboardList,
  History,
  Settings,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { clsx } from 'clsx';

export const Navbar = () => {
  const { logout, user } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: ClipboardList, label: 'My Plans', path: '/plans' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-6 py-3 flex justify-between items-center sm:relative sm:flex-col sm:w-64 sm:h-screen sm:border-r sm:border-t-0 sm:py-8 z-50 transition-colors duration-300">
      <div className="hidden sm:flex items-center gap-3 mb-10 px-2 w-full">
        <div className="bg-primary-600 p-2 rounded-xl">
          <Dumbbell className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold tracking-tight dark:text-white">FlexTrac</span>
      </div>

      <div className="flex sm:flex-col gap-1 w-full justify-around sm:justify-start">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex flex-col sm:flex-row items-center gap-1 sm:gap-3 p-3 rounded-xl transition-all duration-200',
                isActive
                  ? 'text-primary-600 sm:bg-primary-50 dark:sm:bg-primary-900/20'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 sm:hover:bg-slate-50 dark:sm:hover:bg-slate-800'
              )
            }
          >
            <item.icon className="w-6 h-6 sm:w-5 sm:h-5" />
            <span className="text-[10px] sm:text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}

        {/* Mobile Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex sm:hidden flex-col items-center gap-1 p-3 text-slate-400 dark:text-slate-500 transition-all duration-200"
        >
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          <span className="text-[10px] font-medium">{isDarkMode ? 'Light' : 'Dark'}</span>
        </button>
      </div>

      <div className="hidden sm:mt-auto sm:flex flex-col gap-4 w-full">
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-3 p-3 text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all duration-200"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="text-sm font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold truncate dark:text-white">{user?.full_name}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</span>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center gap-3 p-3 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
};
