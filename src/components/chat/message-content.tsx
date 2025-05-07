'use client';

import React, { Suspense, useState, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button, message, Spin } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = memo(({ language, code, onCopy, isCopied, isDarkMode = true }: {
  language: string;
  code: string;
  onCopy: (code: string) => void;
  isCopied: boolean;
  isDarkMode?: boolean;
}) => (
  <div className="relative group my-2">
    <div className="flex justify-between items-center bg-[#1e1e1e] px-4 py-1 rounded-t-lg">
      <span className="text-xs text-gray-400">{language}</span>
      <Button
        type="text"
        size="small"
        className="opacity-70 hover:opacity-100 transition-opacity"
        icon={isCopied ? <CheckOutlined className="text-green-500" /> : <CopyOutlined />}
        onClick={() => onCopy(code)}
      />
    </div>
    <SyntaxHighlighter
      language={language}
      style={isDarkMode ? vscDarkPlus : tomorrow}
      customStyle={{ 
        margin: 0,
        borderRadius: '0 0 8px 8px',
        padding: '16px !important',
      }}
    >
      {code}
    </SyntaxHighlighter>
  </div>
));

interface MessageContentProps {
  content: string;
  isDarkMode?: boolean;
}

export const MessageContent = memo(({ content, isDarkMode = true }: MessageContentProps) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      message.success('代码已复制');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      message.error('复制失败');
    }
  };

  return (
    <Suspense fallback={<Spin />}>
      <ReactMarkdown
        components={{
          code: ({ inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const code = String(children).replace(/\n$/, '');

            if (!inline && match) {
              return (
                <CodeBlock
                  language={match[1]}
                  code={code}
                  onCopy={handleCopyCode}
                  isCopied={copiedCode === code}
                  isDarkMode={isDarkMode}
                />
              );
            }
            return (
              <code 
                className="bg-gray-100 px-1 py-0.5 rounded text-pink-600 font-mono text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </Suspense>
  );
});
