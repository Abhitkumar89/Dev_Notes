import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext.jsx';

/**
 * Renders markdown with GFM (tables, lists, etc.) and code syntax highlighting
 * for JavaScript, Python, Java, C++, HTML, CSS and more.
 */
const CodeBlock = ({ language, value, isDark }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group relative my-4">
      <div className="flex items-center justify-between rounded-t-lg bg-gray-800 px-4 py-1.5 text-xs text-gray-300">
        <span className="font-mono uppercase tracking-wide">{language || 'text'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-2 py-1 transition hover:bg-gray-700"
          aria-label="Copy code"
        >
          {copied ? <FiCheck className="text-green-400" /> : <FiCopy />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={isDark ? oneDark : oneLight}
        customStyle={{ margin: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        wrapLongLines
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

const MarkdownRenderer = ({ content }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const value = String(children).replace(/\n$/, '');

            if (!inline && match) {
              return <CodeBlock language={match[1]} value={value} isDark={isDark} />;
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          a({ href, children }) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
        }}
      >
        {content || '*Nothing to preview yet. Start writing markdown!*'}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
