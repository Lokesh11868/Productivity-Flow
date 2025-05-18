import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Copy, Check } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import { useTheme } from '../../../context/ThemeContext';

interface Match {
  text: string;
  index: number;
  groups: string[];
}

const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState('test@example.com\nuser@domain.com\ninvalid.email');
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    testRegex();
  }, [pattern, flags, testText]);

  const testRegex = () => {
    try {
      if (!pattern) {
        setMatches([]);
        setError(null);
        return;
      }

      const regex = new RegExp(pattern, flags);
      const newMatches: Match[] = [];
      let match;

      if (flags.includes('g')) {
        while ((match = regex.exec(testText)) !== null) {
          newMatches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      } else {
        match = regex.exec(testText);
        if (match) {
          newMatches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      setMatches(newMatches);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid regular expression');
      setMatches([]);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pattern);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Regex Tester</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Test and validate regular expressions in real-time
        </p>

        <div className="glass-panel p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Pattern</label>
              <div className="relative">
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="input-field pr-10"
                  placeholder="Enter regex pattern..."
                />
                <button
                  onClick={handleCopy}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
            </div>
            
            <div className="w-full md:w-32">
              <label className="block text-sm font-medium mb-2">Flags</label>
              <input
                type="text"
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                className="input-field"
                placeholder="g, i, m..."
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center p-3 mb-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg"
            >
              <AlertCircle size={18} className="mr-2" />
              {error}
            </motion.div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Test Text</label>
            <CodeMirror
              value={testText}
              height="150px"
              extensions={[javascript()]}
              onChange={setTestText}
              theme={theme === 'dark' ? githubDark : githubLight}
              className="overflow-hidden rounded-lg"
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Matches ({matches.length})</h3>
            {matches.length > 0 ? (
              <div className="space-y-3">
                {matches.map((match, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Match {index + 1}
                        </span>
                        <div className="mt-1 font-mono text-primary-600 dark:text-primary-400">
                          {match.text}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Index: {match.index}
                      </span>
                    </div>
                    
                    {match.groups.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Groups:
                        </span>
                        <div className="mt-1 space-y-1">
                          {match.groups.map((group, groupIndex) => (
                            <div
                              key={groupIndex}
                              className="text-sm font-mono text-secondary-600 dark:text-secondary-400"
                            >
                              Group {groupIndex + 1}: {group}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No matches found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegexTester;