import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronDown, Copy, Check } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import { useTheme } from '../../../context/ThemeContext';

interface JsonNode {
  key: string;
  value: any;
  type: string;
  depth: number;
}

const JsonViewer: React.FC = () => {
  const [jsonInput, setJsonInput] = useState('{\n  "example": "Paste your JSON here"\n}');
  const [parsedJson, setParsedJson] = useState<JsonNode[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  const parseJson = (input: string) => {
    try {
      const parsed = JSON.parse(input);
      const nodes: JsonNode[] = [];
      
      const traverse = (obj: any, path: string = '', depth: number = 0) => {
        if (Array.isArray(obj)) {
          obj.forEach((item, index) => {
            const currentPath = `${path}[${index}]`;
            const type = typeof item;
            
            if (type === 'object' && item !== null) {
              nodes.push({ key: `[${index}]`, value: item, type, depth });
              traverse(item, currentPath, depth + 1);
            } else {
              nodes.push({ key: `[${index}]`, value: item, type, depth });
            }
          });
        } else {
          Object.entries(obj).forEach(([key, value]) => {
            const currentPath = path ? `${path}.${key}` : key;
            const type = typeof value;
            
            if (type === 'object' && value !== null) {
              nodes.push({ key, value, type, depth });
              traverse(value, currentPath, depth + 1);
            } else {
              nodes.push({ key, value, type, depth });
            }
          });
        }
      };
      
      traverse(parsed);
      setParsedJson(nodes);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      setParsedJson([]);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleNode = (path: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedNodes(newExpanded);
  };

  const renderValue = (node: JsonNode) => {
    switch (typeof node.value) {
      case 'string':
        return <span className="text-green-600 dark:text-green-400">"{node.value}"</span>;
      case 'number':
        return <span className="text-blue-600 dark:text-blue-400">{node.value}</span>;
      case 'boolean':
        return <span className="text-purple-600 dark:text-purple-400">{node.value.toString()}</span>;
      case 'object':
        if (node.value === null) {
          return <span className="text-gray-500 dark:text-gray-400">null</span>;
        }
        return Array.isArray(node.value) ? 
          <span className="text-gray-500 dark:text-gray-400">[...]</span> : 
          <span className="text-gray-500 dark:text-gray-400">{'{...}'}</span>;
      default:
        return <span className="text-gray-500 dark:text-gray-400">{String(node.value)}</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">JSON Viewer</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Visualize and explore JSON data with an interactive tree view
        </p>

        <div className="glass-panel p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium">Input JSON</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="icon-btn"
            >
              {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
            </motion.button>
          </div>

          <CodeMirror
            value={jsonInput}
            height="200px"
            extensions={[javascript({ jsx: true })]}
            onChange={(value) => {
              setJsonInput(value);
              parseJson(value);
            }}
            theme={theme === 'dark' ? githubDark : githubLight}
            className="mb-4 overflow-hidden rounded-lg"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => parseJson(jsonInput)}
            className="btn-primary w-full"
          >
            Parse JSON
          </motion.button>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg"
            >
              {error}
            </motion.div>
          )}
        </div>

        {parsedJson.length > 0 && (
          <div className="glass-panel p-4">
            <h2 className="text-lg font-medium mb-4">JSON Tree View</h2>
            <div className="space-y-1">
              {parsedJson.map((node, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{ marginLeft: `${node.depth * 20}px` }}
                  className="flex items-center py-1"
                >
                  {typeof node.value === 'object' && node.value !== null && (
                    <button
                      onClick={() => toggleNode(`${node.depth}-${node.key}`)}
                      className="mr-1 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    >
                      {expandedNodes.has(`${node.depth}-${node.key}`) ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>
                  )}
                  <span className="font-mono">
                    <span className="text-primary-600 dark:text-primary-400">{node.key}</span>
                    <span className="mx-2">:</span>
                    {renderValue(node)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JsonViewer;