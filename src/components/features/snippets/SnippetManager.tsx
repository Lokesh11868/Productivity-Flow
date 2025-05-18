import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Copy, Check, Trash2, Code } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import { useTheme } from '../../../context/ThemeContext';

interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
  createdAt: Date;
}

const languages = [
  'javascript',
  'typescript',
  'python',
  'java',
  'c++',
  'ruby',
  'php',
  'html',
  'css',
  'sql',
];

const SnippetManager: React.FC = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [tags, setTags] = useState('');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const { theme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSnippet: Snippet = {
      id: Date.now().toString(),
      title,
      code,
      language,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      createdAt: new Date(),
    };
    
    setSnippets([newSnippet, ...snippets]);
    setTitle('');
    setCode('');
    setTags('');
  };

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDelete = (id: string) => {
    setSnippets(snippets.filter(snippet => snippet.id !== id));
  };

  const filteredSnippets = snippets.filter(snippet => {
    const searchLower = search.toLowerCase();
    return (
      snippet.title.toLowerCase().includes(searchLower) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      snippet.language.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Code Snippets</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Save and organize your code snippets
        </p>

        <div className="glass-panel p-4 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                placeholder="Snippet title..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Code</label>
              <CodeMirror
                value={code}
                height="200px"
                extensions={[javascript()]}
                onChange={setCode}
                theme={theme === 'dark' ? githubDark : githubLight}
                className="overflow-hidden rounded-lg"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="input-field"
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Tags</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="input-field"
                  placeholder="Comma-separated tags..."
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="btn-primary w-full flex items-center justify-center"
            >
              <Plus size={18} className="mr-2" />
              Save Snippet
            </motion.button>
          </form>
        </div>

        <div className="glass-panel p-4">
          <div className="flex items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
                placeholder="Search snippets..."
              />
            </div>
          </div>

          {filteredSnippets.length > 0 ? (
            <div className="space-y-4">
              {filteredSnippets.map(snippet => (
                <motion.div
                  key={snippet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass-panel p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-medium">{snippet.title}</h3>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="px-2 py-1 text-xs rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                          {snippet.language}
                        </span>
                        {snippet.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCopy(snippet.id, snippet.code)}
                        className="icon-btn"
                      >
                        {copied === snippet.id ? (
                          <Check size={18} className="text-green-500" />
                        ) : (
                          <Copy size={18} />
                        )}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(snippet.id)}
                        className="icon-btn text-red-500"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </div>

                  <CodeMirror
                    value={snippet.code}
                    height="auto"
                    extensions={[javascript()]}
                    theme={theme === 'dark' ? githubDark : githubLight}
                    editable={false}
                    className="overflow-hidden rounded-lg"
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Code size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No snippets found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {snippets.length === 0
                  ? "Add your first code snippet to get started"
                  : "No snippets match your search criteria"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SnippetManager;