import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNoteStore } from '../../../store/noteStore';
import StickyNote from './StickyNote';

const colorOptions = [
  { value: '#FDFD96', label: 'Yellow' },
  { value: '#FFC0CB', label: 'Pink' },
  { value: '#C1E1C1', label: 'Green' },
  { value: '#C3B1E1', label: 'Purple' },
  { value: '#AFEEEE', label: 'Blue' },
];

const StickyNotes: React.FC = () => {
  const { notes, addNote } = useNoteStore();
  const [newNoteContent, setNewNoteContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState({ left: 0, top: 0 });

  const trimmedContent = newNoteContent.trim();

  const handleAddNote = useCallback(() => {
    if (trimmedContent !== '') {
      addNote(trimmedContent, selectedColor);
      setNewNoteContent('');
    }
  }, [addNote, trimmedContent, selectedColor]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleAddNote();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAddNote]);

  // Update scroll position state on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setScroll({
          left: scrollRef.current.scrollLeft,
          top: scrollRef.current.scrollTop,
        });
      }
    };
    const node = scrollRef.current;
    if (node) node.addEventListener('scroll', handleScroll);
    return () => {
      if (node) node.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Sticky Notes</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Capture your thoughts and ideas
        </p>

        <div className="glass-panel p-4 mb-6">
          <textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Type your note here..."
            className="input-field min-h-28 resize-none mb-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 items-center">
            <div className="flex space-x-2 self-start sm:self-auto">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-6 h-6 rounded-full border transition-all ${
                    selectedColor === color.value
                      ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-600'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                  aria-label={`Select ${color.label} color`}
                />
              ))}
            </div>

            <div className="flex-1"></div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAddNote}
              className="btn-primary w-full sm:w-auto flex items-center justify-center"
              disabled={trimmedContent === ''}
            >
              <PlusCircle size={18} className="mr-2" />
              Add Note
            </motion.button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="relative h-[calc(100vh-300px)] min-h-[400px] overflow-auto border border-gray-200 dark:border-gray-700 rounded-xl"
        style={{
          backgroundImage:
            'linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)',
          backgroundSize: '25px 25px',
          backgroundPosition: `-${scroll.left}px -${scroll.top}px`, // <-- key part!
          backgroundRepeat: 'repeat',
          backgroundColor: 'transparent',
        }}
      >
        <div
          style={{ width: 2000, height: 1200, position: 'relative' }}
          className="touch-none select-none z-10"
        >
          <AnimatePresence>
            {notes.map((note) => (
              <StickyNote key={note.id} note={note} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default React.memo(StickyNotes);
