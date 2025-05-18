import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';

// Feature pages imports (your actual components)
import TaskList from '../features/task/TaskList';
import StickyNotes from '../features/notes/StickyNotes';
import Pomodoro from '../features/pomodoro/Pomodoro';
import MarkdownEditor from '../features/markdown/MarkdownEditor';
import Calendar from '../features/calendar/Calendar';
import TimeZone from '../features/timezone/TimeZone';
import JsonViewer from '../features/json/JsonViewer';
import RegexTester from '../features/regex/RegexTester';
import MindMap from '../features/mindmap/MindMap';
import SnippetManager from '../features/snippets/SnippetManager';

interface MainContentProps {
  sidebarOpen: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ sidebarOpen }) => {
  return (
    <motion.main
      className="flex-1 overflow-y-auto p-3"   // flex-1 fills remaining space
      style={{ height: 'calc(100vh - 3.5rem)' }} // subtract header height (~56px = 3.5rem)
      animate={{
        marginLeft: sidebarOpen ? 0 : 0, // no margin shifts here, keep it simple or adjust if needed
        transition: { duration: 0.3 },
      }}
    >
      <div className="glass-panel p-5 min-h-full">
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/notes" element={<StickyNotes />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/markdown" element={<MarkdownEditor />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/timezone" element={<TimeZone />} />
          <Route path="/json" element={<JsonViewer />} />
          <Route path="/regex" element={<RegexTester />} />
          <Route path="/mindmap" element={<MindMap />} />
          <Route path="/snippets" element={<SnippetManager />} />
          <Route path="*" element={<TaskList />} />
        </Routes>
      </div>
    </motion.main>
  );
};

export default MainContent;
