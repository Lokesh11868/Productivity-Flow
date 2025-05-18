import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Task } from '../../../types';
import { useTaskStore } from '../../../store/taskStore';

interface TaskItemProps {
  task: Task;
}

const priorityColors = {
  low: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-800 dark:text-green-300',
    border: 'border-green-200 dark:border-green-700'
  },
  medium: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-800 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-700'
  },
  high: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-800 dark:text-red-300',
    border: 'border-red-200 dark:border-red-700'
  }
};

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { toggleTask, removeTask, updateTaskPriority } = useTaskStore();

  return (
    <motion.li
      layout
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className={`glass-panel p-4 flex flex-col sm:flex-row sm:items-center border-l-4 ${
        task.completed 
          ? 'border-l-gray-300 dark:border-l-gray-600' 
          : `border-l-${task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'blue' : 'green'}-500`
      }`}
    >
      <div className="flex items-center flex-1">
        <button
          onClick={() => toggleTask(task.id)}
          className="mr-3 text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
        >
          {task.completed ? (
            <CheckCircle className="text-primary-500 dark:text-primary-400" size={20} />
          ) : (
            <Circle size={20} />
          )}
        </button>
        
        <div className="flex-1">
          <h3 className={`text-base font-medium ${
            task.completed 
              ? 'text-gray-500 dark:text-gray-400 line-through' 
              : 'text-gray-800 dark:text-white'
          }`}>
            {task.title}
          </h3>
          
          {task.dueDate && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Due: {format(task.dueDate, 'MMM d, yyyy')}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center mt-3 sm:mt-0 space-x-2">
        <select
          value={task.priority}
          onChange={(e) => updateTaskPriority(task.id, e.target.value as Task['priority'])}
          className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority].bg} ${priorityColors[task.priority].text} ${priorityColors[task.priority].border} border`}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => removeTask(task.id)}
          className="p-1 hover:text-red-500 text-gray-400"
        >
          <Trash2 size={16} />
        </motion.button>
      </div>
      
      {!task.completed && (
        <div className="w-full mt-3 sm:hidden">
          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${
                task.priority === 'high' 
                  ? 'bg-red-500' 
                  : task.priority === 'medium' 
                    ? 'bg-blue-500' 
                    : 'bg-green-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      )}
    </motion.li>
  );
};

export default TaskItem;