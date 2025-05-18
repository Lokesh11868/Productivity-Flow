import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { 
  Check, 
  StickyNote, 
  Timer, 
  FileText, 
  Calendar, 
  Globe, 
  Code, 
  Network, 
  BookMarked, 
  Search 
} from 'lucide-react';

const sidebarVariants = {
  open: { 
    width: '240px',
    opacity: 1,
    x: 0,
    transition: { 
      type: 'spring', 
      stiffness: 300, 
      damping: 24 
    }
  },
  closed: { 
    width: 0,
    opacity: 0,
    x: -40,
    transition: { 
      type: 'spring', 
      stiffness: 300, 
      damping: 24 
    }
  }
};

const menuItems = [
  { icon: <Check size={18} />, name: 'Tasks', path: '/' },
  { icon: <StickyNote size={18} />, name: 'Notes', path: '/notes' },
  { icon: <Timer size={18} />, name: 'Pomodoro', path: '/pomodoro' },
  { icon: <FileText size={18} />, name: 'Markdown', path: '/markdown' },
  { icon: <Calendar size={18} />, name: 'Calendar', path: '/calendar' },
  { icon: <Globe size={18} />, name: 'Time Zones', path: '/timezone' },
  { icon: <Code size={18} />, name: 'JSON Viewer', path: '/json' },
  { icon: <Network size={18} />, name: 'Mind Map', path: '/mindmap' },
  { icon: <BookMarked size={18} />, name: 'Snippets', path: '/snippets' },
  { icon: <Search size={18} />, name: 'Regex Tester', path: '/regex' },
];

const Sidebar: React.FC = () => {
  return (
    <motion.aside 
      className="h-[calc(100vh-1rem)] glass-panel ml-2 mr-1 my-1 overflow-y-auto flex flex-col z-10 w-60 border-b-2 border-gray-200 dark:border-gray-700"
      variants={sidebarVariants}
      initial="closed"
      animate="open"
      exit="closed"
    >
      <div className="p-4">
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
            TOOLS
          </h3>
          <nav>
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => 
                      `flex items-center px-2 py-2 text-sm rounded-lg ${
                        isActive 
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`
                    }
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      
      <div className="mt-8 p-4 pb-6 pt-2"> {/* Add pb-6 for extra space above the border */}
        <div className="glass-panel p-3 mb-2 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 dark:from-primary-500/20 dark:to-secondary-500/20">
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
            Boost your productivity with our premium tools
          </p>
          <button className="w-full py-1 text-xs bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;