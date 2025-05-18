import { create } from 'zustand';
import { StickyNote } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface NoteStore {
  notes: StickyNote[];
  addNote: (content: string, color: string) => void;
  updateNote: (id: string, content: string) => void;
  updateNotePosition: (id: string, x: number, y: number) => void;
  updateNoteColor: (id: string, color: string) => void;
  removeNote: (id: string) => void;
}

const LOCAL_STORAGE_KEY = 'sticky-notes';

function saveToLocalStorage(notes: StickyNote[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Failed to save notes:', error);
  }
}

function loadFromLocalStorage(): StickyNote[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load notes:', error);
    return [];
  }
}

export const useNoteStore = create<NoteStore>((set) => ({
  notes: loadFromLocalStorage(),

  addNote: (content, color) => {
    const newNote: StickyNote = {
      id: uuidv4(),
      content,
      color,
      position: { x: 100, y: 100 },
      createdAt: new Date(),
    };
    set((state) => {
      const updatedNotes = [...state.notes, newNote];
      saveToLocalStorage(updatedNotes);
      return { notes: updatedNotes };
    });
  },

  updateNote: (id, content) => {
    set((state) => {
      const updatedNotes = state.notes.map((note) =>
        note.id === id ? { ...note, content } : note
      );
      saveToLocalStorage(updatedNotes);
      return { notes: updatedNotes };
    });
  },

  updateNotePosition: (id, x, y) => {
    set((state) => {
      const updatedNotes = state.notes.map((note) =>
        note.id === id ? { ...note, position: { x, y } } : note
      );
      saveToLocalStorage(updatedNotes);
      return { notes: updatedNotes };
    });
  },

  updateNoteColor: (id, color) => {
    set((state) => {
      const updatedNotes = state.notes.map((note) =>
        note.id === id ? { ...note, color } : note
      );
      saveToLocalStorage(updatedNotes);
      return { notes: updatedNotes };
    });
  },

  removeNote: (id) => {
    set((state) => {
      const updatedNotes = state.notes.filter((note) => note.id !== id);
      saveToLocalStorage(updatedNotes);
      return { notes: updatedNotes };
    });
  },
}));
