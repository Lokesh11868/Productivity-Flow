import { create } from 'zustand';
import { PomodoroMode, PomodoroSettings } from '../types';

interface PomodoroState {
  mode: PomodoroMode;
  timeLeft: number;
  isActive: boolean;
  completedSessions: number;
  settings: PomodoroSettings;
  
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipToNext: () => void;
  tick: () => void;
  setMode: (mode: PomodoroMode) => void;
  updateSettings: (settings: Partial<PomodoroSettings>) => void;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  focusDuration: 25 * 60, // 25 minutes in seconds
  shortBreakDuration: 5 * 60, // 5 minutes
  longBreakDuration: 15 * 60, // 15 minutes
  sessionsBeforeLongBreak: 4,
};

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  mode: 'focus',
  timeLeft: DEFAULT_SETTINGS.focusDuration,
  isActive: false,
  completedSessions: 0,
  settings: DEFAULT_SETTINGS,
  
  startTimer: () => set({ isActive: true }),
  
  pauseTimer: () => set({ isActive: false }),
  
  resetTimer: () => {
    const { mode, settings } = get();
    let newTimeLeft;
    
    switch (mode) {
      case 'focus':
        newTimeLeft = settings.focusDuration;
        break;
      case 'shortBreak':
        newTimeLeft = settings.shortBreakDuration;
        break;
      case 'longBreak':
        newTimeLeft = settings.longBreakDuration;
        break;
      default:
        newTimeLeft = settings.focusDuration;
    }
    
    set({ timeLeft: newTimeLeft, isActive: false });
  },
  
  skipToNext: () => {
    const { mode, settings, completedSessions } = get();
    let newMode: PomodoroMode;
    let newTimeLeft: number;
    let newCompletedSessions = completedSessions;
    
    if (mode === 'focus') {
      newCompletedSessions = completedSessions + 1;
      if (newCompletedSessions % settings.sessionsBeforeLongBreak === 0) {
        newMode = 'longBreak';
        newTimeLeft = settings.longBreakDuration;
      } else {
        newMode = 'shortBreak';
        newTimeLeft = settings.shortBreakDuration;
      }
    } else {
      newMode = 'focus';
      newTimeLeft = settings.focusDuration;
    }
    
    set({
      mode: newMode,
      timeLeft: newTimeLeft,
      completedSessions: newCompletedSessions,
      isActive: false,
    });
  },
  
  tick: () => {
    const { timeLeft, mode, settings, completedSessions } = get();
    
    if (timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
    } else {
      let newMode: PomodoroMode;
      let newTimeLeft: number;
      let newCompletedSessions = completedSessions;
      
      if (mode === 'focus') {
        newCompletedSessions = completedSessions + 1;
        if (newCompletedSessions % settings.sessionsBeforeLongBreak === 0) {
          newMode = 'longBreak';
          newTimeLeft = settings.longBreakDuration;
        } else {
          newMode = 'shortBreak';
          newTimeLeft = settings.shortBreakDuration;
        }
      } else {
        newMode = 'focus';
        newTimeLeft = settings.focusDuration;
      }
      
      set({
        mode: newMode,
        timeLeft: newTimeLeft,
        completedSessions: newCompletedSessions,
        isActive: false,
      });
    }
  },
  
  setMode: (mode) => {
    const { settings } = get();
    let newTimeLeft;
    
    switch (mode) {
      case 'focus':
        newTimeLeft = settings.focusDuration;
        break;
      case 'shortBreak':
        newTimeLeft = settings.shortBreakDuration;
        break;
      case 'longBreak':
        newTimeLeft = settings.longBreakDuration;
        break;
      default:
        newTimeLeft = settings.focusDuration;
    }
    
    set({ mode, timeLeft: newTimeLeft, isActive: false });
  },
  
  updateSettings: (newSettings) => {
    const { settings, mode } = get();
    const updatedSettings = { ...settings, ...newSettings };
    let newTimeLeft;
    
    switch (mode) {
      case 'focus':
        newTimeLeft = updatedSettings.focusDuration;
        break;
      case 'shortBreak':
        newTimeLeft = updatedSettings.shortBreakDuration;
        break;
      case 'longBreak':
        newTimeLeft = updatedSettings.longBreakDuration;
        break;
      default:
        newTimeLeft = updatedSettings.focusDuration;
    }
    
    set({ settings: updatedSettings, timeLeft: newTimeLeft, isActive: false });
  },
}));