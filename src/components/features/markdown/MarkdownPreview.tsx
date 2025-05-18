import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { useTheme } from '../../../context/ThemeContext';

interface MarkdownPreviewProps {
  markdown: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ markdown }) => {
  const { theme } = useTheme();
  
  return (
    <div className="markdown-preview prose dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 
              className="text-3xl font-bold mt-6 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700" 
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2 
              className="text-2xl font-bold mt-5 mb-3" 
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3 
              className="text-xl font-semibold mt-4 mb-3" 
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul 
              className="list-disc pl-6 my-4 space-y-2" 
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol 
              className="list-decimal pl-6 my-4 space-y-2" 
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li 
              className="my-1" 
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p 
              className="my-3 leading-relaxed" 
              {...props}
            />
          ),
          a: ({ node, ...props }) => (
            <a 
              className="text-primary-600 dark:text-primary-400 hover:underline" 
              target="_blank" 
              rel="noopener noreferrer" 
              {...props}
            />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote 
              className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-1 my-4 italic text-gray-600 dark:text-gray-400" 
              {...props}
            />
          ),
          img: ({ node, ...props }) => (
            <img 
              className="max-w-full rounded-lg my-4 border border-gray-200 dark:border-gray-700" 
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table 
                className="w-full border-collapse border border-gray-300 dark:border-gray-700" 
                {...props}
              />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead 
              className="bg-gray-100 dark:bg-gray-800" 
              {...props}
            />
          ),
          th: ({ node, ...props }) => (
            <th 
              className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left" 
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td 
              className="border border-gray-300 dark:border-gray-700 px-4 py-2" 
              {...props}
            />
          ),
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-md my-4 overflow-hidden"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code
                className={`${inline ? 'bg-gray-200 dark:bg-gray-700 rounded px-1 py-0.5' : ''} ${className}`}
                {...props}
              >
                {children}
              </code>
            );
          },
          hr: ({ node, ...props }) => (
            <hr 
              className="my-6 border-t border-gray-300 dark:border-gray-700" 
              {...props}
            />
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;