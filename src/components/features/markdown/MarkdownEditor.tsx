import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, Pencil, FileText, Eye } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import { useMarkdownStore } from '../../../store/markdownStore';
import { useTheme } from '../../../context/ThemeContext';
import MarkdownPreview from './MarkdownPreview';

const MarkdownEditor: React.FC = () => {
  const { 
    documents, 
    currentDocument, 
    createDocument, 
    updateDocument, 
    updateDocumentTitle,
    selectDocument, 
    removeDocument 
  } = useMarkdownStore();
  
  const { theme } = useTheme();
  const [view, setView] = useState<'edit' | 'preview' | 'split'>('split');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(currentDocument?.title || '');

  useEffect(() => {
    if (currentDocument) {
      setTitle(currentDocument.title);
    }
  }, [currentDocument]);

  const handleCreateDocument = () => {
    createDocument(`New Document ${documents.length + 1}`, '# New Document\n\nStart writing here...');
  };

  const handleRemoveDocument = () => {
    if (currentDocument) {
      if (confirm('Are you sure you want to delete this document?')) {
        removeDocument(currentDocument.id);
      }
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const saveTitle = () => {
    if (currentDocument && title.trim()) {
      updateDocumentTitle(currentDocument.id, title);
    }
    setIsEditingTitle(false);
  };

  const handleContentChange = (value: string) => {
    if (currentDocument) {
      updateDocument(currentDocument.id, value);
    }
  };

  const getWordCount = () => {
    if (!currentDocument) return 0;
    return currentDocument.content.trim().split(/\s+/).filter(Boolean).length;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-1">Markdown Editor</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create and edit documents with Markdown
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateDocument}
            className="btn-primary flex items-center"
          >
            <Plus size={18} className="mr-2" />
            New Document
          </motion.button>
          
          {currentDocument && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRemoveDocument}
              className="btn-secondary flex items-center text-red-500 hover:text-red-600"
              disabled={documents.length <= 1}
            >
              <Trash2 size={18} className="mr-2" />
              Delete
            </motion.button>
          )}
        </div>
      </div>

      <div className="glass-panel p-0 overflow-hidden flex flex-col flex-1">
        <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center flex-1 min-w-0">
            {isEditingTitle ? (
              <div className="flex items-center flex-1">
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  onBlur={saveTitle}
                  onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
                  className="input-field mr-2"
                  autoFocus
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={saveTitle}
                  className="icon-btn text-green-500"
                >
                  <Save size={18} />
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center flex-1 min-w-0">
                <h2 className="font-medium truncate mr-2">{currentDocument?.title}</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditingTitle(true)}
                  className="icon-btn"
                >
                  <Pencil size={16} />
                </motion.button>
              </div>
            )}
          </div>
          
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setView('edit')}
              className={`p-1.5 rounded-md ${
                view === 'edit' 
                  ? 'bg-white dark:bg-gray-600 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <FileText size={16} />
            </button>
            <button
              onClick={() => setView('split')}
              className={`p-1.5 rounded-md ${
                view === 'split' 
                  ? 'bg-white dark:bg-gray-600 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <div className="flex gap-0.5">
                <div className="w-1.5 h-3.5 bg-current rounded-sm"></div>
                <div className="w-1.5 h-3.5 bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setView('preview')}
              className={`p-1.5 rounded-md ${
                view === 'preview' 
                  ? 'bg-white dark:bg-gray-600 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Eye size={16} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden flex">
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            <div className="md:w-64 p-4 overflow-y-auto border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-3">
                DOCUMENTS
              </h3>
              <ul className="space-y-1">
                {documents.map((doc) => (
                  <li key={doc.id}>
                    <button
                      onClick={() => selectDocument(doc.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                        currentDocument?.id === doc.id
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className="font-medium truncate">{doc.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(doc.lastUpdated).toLocaleDateString()} • {getWordCount()} words
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-gray-50 dark:bg-gray-800">
              {(view === 'edit' || view === 'split') && (
                <div className={`${view === 'split' ? 'w-1/2' : 'w-full'} overflow-auto`}>
                  {currentDocument && (
                    <CodeMirror
                      value={currentDocument.content}
                      height="100%"
                      extensions={[markdown()]}
                      onChange={handleContentChange}
                      theme={theme === 'dark' ? githubDark : githubLight}
                      className="h-full"
                    />
                  )}
                </div>
              )}
              
              {(view === 'preview' || view === 'split') && (
                <div className={`${view === 'split' ? 'w-1/2' : 'w-full'} overflow-auto p-4`}>
                  {currentDocument && (
                    <MarkdownPreview markdown={currentDocument.content} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;