import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import MainContent from './components/layout/MainContent';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import { ThemeProvider } from './context/ThemeContext';
import { useAuthStore } from './store/authStore';

function App() {
  const { isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gray-900">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex flex-1 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {sidebarOpen && (
              <motion.div
                key="sidebar"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }} // 240px width (adjust to your sidebar width)
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800 text-white overflow-hidden"
                style={{ minWidth: 0 }} // prevents overflow issues on collapse
              >
                <Sidebar />
              </motion.div>
            )}
          </AnimatePresence>
          <MainContent sidebarOpen={sidebarOpen} />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
