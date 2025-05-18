import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw, Settings } from 'lucide-react';
import { usePomodoroStore } from '../../../store/pomodoroStore';
import PomodoroTimer from './PomodoroTimer';
import PomodoroSettings from './PomodoroSettings';

const Pomodoro: React.FC = () => {
  const { 
    mode, 
    timeLeft, 
    isActive, 
    completedSessions,
    startTimer, 
    pauseTimer, 
    resetTimer, 
    skipToNext, 
    tick, 
    setMode 
  } = usePomodoroStore();
  
  const [showSettings, setShowSettings] = React.useState(false);
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive) {
      interval = setInterval(() => tick(), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, tick]);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getModeColor = () => {
    switch (mode) {
      case 'focus':
        return 'from-primary-500/20 to-primary-700/20 dark:from-primary-700/20 dark:to-primary-900/20';
      case 'shortBreak':
        return 'from-secondary-500/20 to-secondary-700/20 dark:from-secondary-700/20 dark:to-secondary-900/20';
      case 'longBreak':
        return 'from-accent-500/20 to-accent-700/20 dark:from-accent-700/20 dark:to-accent-900/20';
      default:
        return 'from-primary-500/20 to-primary-700/20 dark:from-primary-700/20 dark:to-primary-900/20';
    }
  };

  const getModeText = () => {
    switch (mode) {
      case 'focus': return 'Focus Session';
      case 'shortBreak': return 'Short Break';
      case 'longBreak': return 'Long Break';
      default: return 'Focus Session';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Pomodoro Timer</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Stay focused and take breaks at the right intervals
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Pomodoro Timer Panel */}
        <div className={`flex-1 glass-panel p-6 bg-gradient-to-br ${getModeColor()}`}>
          <div className="flex justify-center mb-6">
            <div className="flex space-x-1 bg-white/50 dark:bg-gray-800/50 rounded-lg p-1">
              {['focus', 'shortBreak', 'longBreak'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    mode === m
                      ? `bg-white dark:bg-gray-700 text-${m === 'focus' ? 'primary' : m === 'shortBreak' ? 'secondary' : 'accent'}-700 dark:text-${m === 'focus' ? 'primary' : m === 'shortBreak' ? 'secondary' : 'accent'}-300 shadow-sm`
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80'
                  }`}
                >
                  {m === 'focus' ? 'Focus' : m === 'shortBreak' ? 'Short Break' : 'Long Break'}
                </button>
              ))}
            </div>
          </div>

          <PomodoroTimer mode={mode} timeLeft={timeLeft} formatTime={formatTime} />

          <div className="text-center text-lg font-medium mb-8 text-gray-800 dark:text-gray-200">
            {getModeText()}
          </div>

          <div className="flex justify-center space-x-3">
            {!isActive ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startTimer}
                className="btn-primary flex items-center px-6"
              >
                <Play size={18} className="mr-2" /> Start
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={pauseTimer}
                className="btn-primary flex items-center px-6"
              >
                <Pause size={18} className="mr-2" /> Pause
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetTimer}
              className="btn-secondary flex items-center"
            >
              <RotateCcw size={18} className="mr-2" /> Reset
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={skipToNext}
              className="btn-secondary flex items-center"
            >
              <SkipForward size={18} className="mr-2" /> Skip
            </motion.button>
          </div>
        </div>

        {/* Session Progress Panel */}
        <div className="flex-1 glass-panel p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Session Progress</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(!showSettings)}
              className="icon-btn"
            >
              <Settings size={20} />
            </motion.button>
          </div>

          <div className="text-center py-3">
            <div className="text-3xl font-bold mb-2 text-primary-600 dark:text-primary-400">
              {completedSessions}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Completed Sessions
            </div>
          </div>

          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-4">
            <motion.div 
              className="h-full bg-primary-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedSessions % 4) * 25}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>0</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
          </div>

          {/* Settings Panel Inside Progress Box */}
          {showSettings && (
            <div className="mt-6">
              <PomodoroSettings onClose={() => setShowSettings(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
