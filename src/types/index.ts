// Task Types
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  dueDate?: Date;
}

// Note Types
export interface StickyNote {
  id: string;
  content: string;
  color: string;
  position: {
    x: number;
    y: number;
  };
  createdAt: Date;
}

// Pomodoro Types
export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';

export interface PomodoroSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
}

// Calendar Types
export interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  color: string;
}

// Markdown Types
export interface MarkdownDocument {
  id: string;
  title: string;
  content: string;
  lastUpdated: Date;
}

// Code Snippet Types
export interface CodeSnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
  createdAt: Date;
}

// Time Zone Types
export interface TimeZoneConversion {
  sourceZone: string;
  targetZone: string;
  sourceTime: Date;
  targetTime: Date;
}