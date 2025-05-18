import React from 'react';
import { motion } from 'framer-motion';
import { PomodoroMode } from '../../../types';

interface PomodoroTimerProps {
  mode: PomodoroMode;
  timeLeft: number;
  formatTime: (seconds: number) => string;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ mode, timeLeft, formatTime }) => {
  // Calculate color based on mode
  const getColor = () => {
    switch (mode) {
      case 'focus':
        return { stroke: '#3B82F6', text: 'text-primary-600 dark:text-primary-400' };
      case 'shortBreak':
        return { stroke: '#14B8A6', text: 'text-secondary-600 dark:text-secondary-400' };
      case 'longBreak':
        return { stroke: '#F97316', text: 'text-accent-600 dark:text-accent-400' };
      default:
        return { stroke: '#3B82F6', text: 'text-primary-600 dark:text-primary-400' };
    }
  };
  
  // Calculate total time based on mode (in seconds)
  const getTotalTime = () => {
    switch (mode) {
      case 'focus':
        return 25 * 60; // 25 minutes
      case 'shortBreak':
        return 5 * 60; // 5 minutes
      case 'longBreak':
        return 15 * 60; // 15 minutes
      default:
        return 25 * 60;
    }
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    const totalTime = getTotalTime();
    return (totalTime - timeLeft) / totalTime;
  };
  
  // Calculate stroke dash offset for circular progress
  const calculateStrokeDashoffset = () => {
    const progress = calculateProgress();
    const circumference = 2 * Math.PI * 120; // 120 is the radius
    return circumference * (1 - progress);
  };
  
  return (
    <motion.div 
      className="flex justify-center items-center mb-5"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-64 h-64">
        <svg
          width="256"
          height="256"
          viewBox="0 0 256 256"
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
            className="dark:opacity-20"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke={getColor().stroke}
            strokeWidth="8"
            strokeDasharray={2 * Math.PI * 120}
            initial={{ strokeDashoffset: 2 * Math.PI * 120 }}
            animate={{ strokeDashoffset: calculateStrokeDashoffset() }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div 
            key={formatTime(timeLeft)}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`text-5xl font-bold ${getColor().text}`}
          >
            {formatTime(timeLeft)}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PomodoroTimer;