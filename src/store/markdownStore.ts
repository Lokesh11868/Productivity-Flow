import { create } from 'zustand';
import { MarkdownDocument } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface MarkdownStore {
  documents: MarkdownDocument[];
  currentDocument: MarkdownDocument | null;
  createDocument: (title: string, content: string) => void;
  updateDocument: (id: string, content: string) => void;
  updateDocumentTitle: (id: string, title: string) => void;
  selectDocument: (id: string) => void;
  removeDocument: (id: string) => void;
}

const initialDocuments: MarkdownDocument[] = [
  {
    id: uuidv4(),
    title: 'Welcome to Markdown Editor',
    content: `# Welcome to the Markdown Editor

## Features
- **Live Preview** - See your changes as you type
- **Syntax Highlighting** - Makes editing easier
- **Multiple Documents** - Create and manage multiple notes
- **Full Markdown Support** - Including tables, code blocks, and more

## Basic Markdown Guide

### Headers
# H1
## H2
### H3

### Emphasis
*This text will be italic*
**This text will be bold**

### Lists
- Item 1
- Item 2
  - Subitem

1. Ordered item 1
2. Ordered item 2

### Links
[Productivity Flow](https://example.com)

### Images
![alt text](https://source.unsplash.com/random/300x200/?nature)

### Code
\`\`\`javascript
function sayHello() {
  console.log("Hello!");
}
\`\`\`

### Tables
| Header | Header |
| ------ | ------ |
| Cell   | Cell   |
| Cell   | Cell   |

Try editing this document or create a new one to get started!
`,
    lastUpdated: new Date(),
  },
];

export const useMarkdownStore = create<MarkdownStore>((set) => ({
  documents: initialDocuments,
  currentDocument: initialDocuments[0],
  
  createDocument: (title, content = '') => 
    set((state) => {
      const newDocument = {
        id: uuidv4(),
        title,
        content,
        lastUpdated: new Date(),
      };
      
      return {
        documents: [...state.documents, newDocument],
        currentDocument: newDocument,
      };
    }),
  
  updateDocument: (id, content) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id 
          ? { ...doc, content, lastUpdated: new Date() } 
          : doc
      ),
      currentDocument: state.currentDocument?.id === id
        ? { ...state.currentDocument, content, lastUpdated: new Date() }
        : state.currentDocument,
    })),
  
  updateDocumentTitle: (id, title) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id 
          ? { ...doc, title, lastUpdated: new Date() } 
          : doc
      ),
      currentDocument: state.currentDocument?.id === id
        ? { ...state.currentDocument, title, lastUpdated: new Date() }
        : state.currentDocument,
    })),
  
  selectDocument: (id) =>
    set((state) => ({
      currentDocument: state.documents.find((doc) => doc.id === id) || null,
    })),
  
  removeDocument: (id) =>
    set((state) => {
      const filteredDocuments = state.documents.filter((doc) => doc.id !== id);
      
      return {
        documents: filteredDocuments,
        currentDocument: state.currentDocument?.id === id
          ? filteredDocuments.length > 0 ? filteredDocuments[0] : null
          : state.currentDocument,
      };
    }),
}));