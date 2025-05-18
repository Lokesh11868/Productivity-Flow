import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from 'date-fns';

import { festivals } from './festivals'; // <-- Import your festivals here

type EventType = {
  id: string;
  title: string;
  date: Date;
  color: string;
};

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<EventType[]>([]);
  const [newEvent, setNewEvent] = useState({ title: '', color: '#3B82F6' });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const addEvent = (date: Date) => {
    if (newEvent.title.trim()) {
      setEvents([
        ...events,
        {
          id: Date.now().toString(),
          title: newEvent.title,
          date,
          color: newEvent.color,
        },
      ]);
      setNewEvent({ title: '', color: '#3B82F6' });
    }
  };

  // Combine user events and festivals, filter by date
  const getEventsForDate = (date: Date) => {
    const allEvents = [...events, ...festivals];
    return allEvents.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Calendar</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Schedule and manage your events
        </p>

        <div className="glass-panel p-4 mb-6">
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className="icon-btn">
              <ChevronLeft size={20} />
            </button>

            <h2 className="text-xl font-semibold">{format(currentDate, 'MMMM yyyy')}</h2>

            <button onClick={nextMonth} className="icon-btn">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Scrollable container for days */}
          <div className="max-h-[400px] overflow-y-auto">
            <div className="grid grid-cols-7 gap-1">
              {daysInMonth.map((date, idx) => {
                const dayEvents = getEventsForDate(date);
                const isCurrentMonth = isSameMonth(date, currentDate);

                return (
                  <motion.div
                    key={date.toString()}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className={`
                      min-h-24 p-2 border rounded-lg
                      ${
                        isCurrentMonth
                          ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                          : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800'
                      }
                      ${isToday(date) ? 'ring-2 ring-primary-500 dark:ring-primary-400' : ''}
                    `}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`
                          text-sm font-medium
                          ${
                            isCurrentMonth
                              ? 'text-gray-900 dark:text-gray-100'
                              : 'text-gray-400 dark:text-gray-600'
                          }
                        `}
                      >
                        {format(date, 'd')}
                      </span>

                      {isCurrentMonth && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => addEvent(date)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                          aria-label={`Add event for ${format(date, 'MMMM do, yyyy')}`}
                        >
                          <Plus size={14} />
                        </motion.button>
                      )}
                    </div>

                    <div className="space-y-1">
                      {dayEvents.map((event) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-xs p-1 rounded truncate"
                          style={{ backgroundColor: `${event.color}20`, color: event.color }}
                        >
                          {event.title}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="glass-panel p-4">
          <h3 className="text-lg font-medium mb-4">Add New Event</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              placeholder="Event title..."
              className="input-field flex-1"
            />

            <input
              type="color"
              value={newEvent.color}
              onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
              className="w-12 h-10 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
