import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, Moon, Sun, Search, Bell, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Complete Project Documentation',
    description: 'Make sure to finish early',
    time: '2m ago',
    read: false,
  },
  {
    id: '2',
    title: 'Project deadline approaching',
    description: 'Don’t forget the deadline is tomorrow at 5 PM.',
    time: '1h ago',
    read: true,
  },
  {
    id: '3',
    title: 'System update',
    description: 'Version 2.1.0 has been successfully installed.',
    time: 'Yesterday',
    read: true,
  },
];

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close notification dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Mark all notifications as read when dropdown opens
  useEffect(() => {
    if (showNotifications) {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    }
  }, [showNotifications]);

  return (
    <motion.header 
      className="glass-panel z-10 px-4 py-3 flex items-center justify-between shadow-sm border-b border-gray-200 dark:border-gray-700 m-2 rounded-lg"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar} 
          className="icon-btn mr-2"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 text-transparent bg-clip-text">
          Productivity Flow
        </h1>
      </div>

      <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
        <motion.button 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.95 }}
          className="icon-btn relative"
          aria-label="Notifications"
          onClick={() => setShowNotifications((v) => !v)}
        >
          <Bell size={20} />
          {/* Show red dot if any unread */}
          {notifications.some(n => !n.read) && !showNotifications && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          )}
        </motion.button>

        {/* Notification dropdown */}
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 z-20"
          >
            <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h4>
              <button
                onClick={() => setShowNotifications(false)}
                aria-label="Close notifications"
                className="icon-btn"
              >
                <X size={18} />
              </button>
            </div>
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-gray-500 dark:text-gray-400">
                No notifications
              </p>
            ) : (
              <ul>
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      notif.read ? 'opacity-70' : 'font-semibold bg-blue-50 dark:bg-blue-900'
                    }`}
                  >
                    <div className="flex justify-between">
                      <span className="text-sm">{notif.title}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{notif.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 truncate">{notif.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}

        <motion.button 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="icon-btn"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>
        
        <motion.div 
          className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 flex items-center justify-center text-white font-medium cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          U
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
