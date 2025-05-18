import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { usePomodoroStore } from '../../../store/pomodoroStore';
import { PomodoroSettings as Settings } from '../../../types';

interface PomodoroSettingsProps {
  onClose: () => void;
}

const PomodoroSettings: React.FC<PomodoroSettingsProps> = ({ onClose }) => {
  const { settings, updateSettings } = usePomodoroStore();
  
  const [focusMinutes, setFocusMinutes] = useState(Math.floor(settings.focusDuration / 60));
  const [shortBreakMinutes, setShortBreakMinutes] = useState(Math.floor(settings.shortBreakDuration / 60));
  const [longBreakMinutes, setLongBreakMinutes] = useState(Math.floor(settings.longBreakDuration / 60));
  const [sessionsCount, setSessionsCount] = useState(settings.sessionsBeforeLongBreak);
  
  const handleSave = () => {
    const updatedSettings: Settings = {
      focusDuration: focusMinutes * 60,
      shortBreakDuration: shortBreakMinutes * 60,
      longBreakDuration: longBreakMinutes * 60,
      sessionsBeforeLongBreak: sessionsCount,
    };
    
    updateSettings(updatedSettings);
    onClose();
  };
  
  return (
    <motion.div 
      className="glass-panel p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">Timer Settings</h2>
        <button onClick={onClose} className="icon-btn">
          <X size={18} />
        </button>
      </div>
      
      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="focus-duration" className="block text-sm font-medium mb-1">
            Focus Duration (minutes)
          </label>
          <input
            id="focus-duration"
            type="number"
            min="1"
            max="60"
            value={focusMinutes}
            onChange={(e) => setFocusMinutes(parseInt(e.target.value) || 25)}
            className="input-field"
          />
        </div>
        
        <div>
          <label htmlFor="short-break" className="block text-sm font-medium mb-1">
            Short Break Duration (minutes)
          </label>
          <input
            id="short-break"
            type="number"
            min="1"
            max="30"
            value={shortBreakMinutes}
            onChange={(e) => setShortBreakMinutes(parseInt(e.target.value) || 5)}
            className="input-field"
          />
        </div>
        
        <div>
          <label htmlFor="long-break" className="block text-sm font-medium mb-1">
            Long Break Duration (minutes)
          </label>
          <input
            id="long-break"
            type="number"
            min="1"
            max="60"
            value={longBreakMinutes}
            onChange={(e) => setLongBreakMinutes(parseInt(e.target.value) || 15)}
            className="input-field"
          />
        </div>
        
        <div>
          <label htmlFor="sessions-count" className="block text-sm font-medium mb-1">
            Sessions Before Long Break
          </label>
          <input
            id="sessions-count"
            type="number"
            min="1"
            max="10"
            value={sessionsCount}
            onChange={(e) => setSessionsCount(parseInt(e.target.value) || 4)}
            className="input-field"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button onClick={handleSave} className="btn-primary">
          Save Changes
        </button>
      </div>
    </motion.div>
  );
};

export default PomodoroSettings;