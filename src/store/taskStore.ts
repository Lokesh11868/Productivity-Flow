import { create } from 'zustand';
import { Task } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface TaskStore {
  tasks: Task[];
  addTask: (title: string, priority: Task['priority']) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  updateTaskPriority: (id: string, priority: Task['priority']) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [
    {
      id: uuidv4(),
      title: 'Complete project documentation',
      completed: false,
      priority: 'high',
      createdAt: new Date(),
      dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
    },
    {
      id: uuidv4(),
      title: 'Review pull requests',
      completed: true,
      priority: 'medium',
      createdAt: new Date(),
      dueDate: new Date(),
    },
    {
      id: uuidv4(),
      title: 'Plan weekly meeting',
      completed: false,
      priority: 'low',
      createdAt: new Date(),
      dueDate: new Date(Date.now() + 86400000), // 1 day from now
    },
  ],
  
  addTask: (title, priority) => 
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          id: uuidv4(),
          title,
          completed: false,
          priority,
          createdAt: new Date(),
        },
      ],
    })),
  
  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    })),
  
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
  
  updateTaskPriority: (id, priority) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, priority } : task
      ),
    })),
}));