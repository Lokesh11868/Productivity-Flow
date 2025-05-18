import React, { useState } from 'react';
import { PlusCircle, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaskStore } from '../../../store/taskStore';
import TaskItem from './TaskItem';
import { Task } from '../../../types';

const TaskList: React.FC = () => {
  const { tasks, addTask } = useTaskStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('medium');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim() !== '') {
      addTask(newTaskTitle, newTaskPriority);
      setNewTaskTitle('');
      setNewTaskPriority('medium');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });
  
  const activeTasks = tasks.filter(task => !task.completed).length;
  const completedTasks = tasks.filter(task => task.completed).length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Task Manager</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Stay organized and track your progress
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="card bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Total Tasks</h3>
              <div className="text-2xl font-bold">{tasks.length}</div>
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-green-500/10 to-teal-500/10 border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Active</h3>
              <div className="text-2xl font-bold">{activeTasks}</div>
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Completed</h3>
              <div className="text-2xl font-bold">{completedTasks}</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleAddTask} className="glass-panel p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a new task..."
              className="input-field flex-1"
            />
            
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as Task['priority'])}
              className="input-field md:w-32"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="btn-primary flex items-center justify-center"
            >
              <PlusCircle size={18} className="mr-2" />
              Add Task
            </motion.button>
          </div>
        </form>

        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-medium">
            {activeTasks} {activeTasks === 1 ? 'task' : 'tasks'} remaining
          </div>
          
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-md ${
                filter === 'all'
                  ? 'bg-white dark:bg-gray-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1 text-sm rounded-md ${
                filter === 'active'
                  ? 'bg-white dark:bg-gray-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 text-sm rounded-md ${
                filter === 'completed'
                  ? 'bg-white dark:bg-gray-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>
      
      <AnimatePresence mode="popLayout">
        {filteredTasks.length > 0 ? (
          <motion.ul 
            className="space-y-3" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
          >
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </motion.ul>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center py-10 text-gray-500 dark:text-gray-400"
          >
            <p className="text-lg">No tasks found</p>
            <p className="text-sm">
              {filter === 'all' 
                ? 'Add a new task to get started' 
                : `No ${filter} tasks available`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;