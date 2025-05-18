import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Trash2, Edit, Check } from 'lucide-react';
import { StickyNote as StickyNoteType } from '../../../types';
import { useNoteStore } from '../../../store/noteStore';

interface StickyNoteProps {
  note: StickyNoteType;
}

const DraggableContent = forwardRef<HTMLDivElement, {
  note: StickyNoteType;
  editing: boolean;
  content: string;
  onEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  position: { x: number; y: number };
  setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}>(
  (
    {
      note,
      editing,
      content,
      onEdit,
      onSave,
      onDelete,
      setContent,
      textareaRef,
      position,
      setPosition,
    },
    ref
  ) => (
    <motion.div
      ref={ref}
      className="w-60 shadow-lg rounded-lg overflow-hidden cursor-move z-10"
      style={{ backgroundColor: note.color, x: position.x, y: position.y }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1, x: position.x, y: position.y }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{
        boxShadow:
          '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
      }}
      drag={!editing ? true : false}
      dragConstraints={{ left: 0, top: 0, right: 2000, bottom: 1200 }} // adapt to your board size
      dragElastic={0.1}
      dragMomentum={false}
      onDragEnd={(_event, info: PanInfo) => {
        setPosition({
          x: position.x + info.offset.x,
          y: position.y + info.offset.y,
        });
      }}
      dragListener={true}
      dragPropagation={false}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      dragSnapToOrigin={false}
      onDrag={(_) => {
        // Optional: can do something during drag
      }}
    >
      <div className="handle px-4 py-2 flex justify-between items-center border-b border-black/10 cursor-grab">
        <div className="flex space-x-1.5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-black/20" />
          ))}
        </div>
        <div className="flex space-x-1">
          {editing ? (
            <button
              onClick={onSave}
              className="p-1 text-green-700 hover:text-green-900 transition-colors"
            >
              <Check size={16} />
            </button>
          ) : (
            <button
              onClick={onEdit}
              className="p-1 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <Edit size={16} />
            </button>
          )}
          <button
            onClick={onDelete}
            className="p-1 text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="px-4 py-3 bg-white/30" style={{ minHeight: '100px' }}>
        {editing ? (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full min-h-[100px] bg-transparent resize-none outline-none text-gray-800"
          />
        ) : (
          <p className="text-gray-800 break-words whitespace-pre-wrap">
            {note.content}
          </p>
        )}
      </div>
    </motion.div>
  )
);
DraggableContent.displayName = 'DraggableContent';

const StickyNote: React.FC<StickyNoteProps> = ({ note }) => {
  const { updateNote, updateNotePosition, removeNote } = useNoteStore();
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(note.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Manage position state for framer-motion drag
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: note.position.x,
    y: note.position.y,
  });

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [editing]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditing(false);
        setContent(note.content);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [note.content]);

  // Update global store position when drag ends
  useEffect(() => {
    updateNotePosition(note.id, position.x, position.y);
  }, [position.x, position.y, note.id, updateNotePosition]);

  const handleEdit = () => setEditing(true);
  const handleSave = () => {
    updateNote(note.id, content.trim());
    setEditing(false);
  };
  const handleDelete = () => removeNote(note.id);

  return (
    <DraggableContent
      note={note}
      editing={editing}
      content={content}
      onEdit={handleEdit}
      onSave={handleSave}
      onDelete={handleDelete}
      setContent={setContent}
      textareaRef={textareaRef}
      position={position}
      setPosition={setPosition}
    />
  );
};

export default React.memo(StickyNote);
