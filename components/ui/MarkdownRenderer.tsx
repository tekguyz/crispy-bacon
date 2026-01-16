
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const isChat = className.includes('chat-markdown');
  const isSummary = className.includes('prose-summary');

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        components={{
          h1: (props: any) => <h1 className={`${isChat ? 'text-sm font-extrabold mb-2' : isSummary ? 'text-5xl md:text-7xl font-serif mb-10' : 'text-3xl font-extrabold mb-4'} uppercase tracking-tighter leading-none`} {...props} />,
          h2: (props: any) => <h2 className={`${isChat ? 'text-xs font-extrabold mb-1' : 'text-2xl font-extrabold mb-3'} uppercase`} {...props} />,
          p: (props: any) => <p className={`${isChat ? 'text-sm mb-3 leading-relaxed' : isSummary ? 'text-xl md:text-2xl mb-8 last:mb-0 leading-[1.8] font-medium text-on-surface/90' : 'text-lg mb-6 leading-relaxed'}`} {...props} />,
          ul: (props: any) => <ul className={`${isChat ? 'list-disc pl-4 space-y-1 mb-3' : 'list-disc pl-8 space-y-4 mb-8'} opacity-90`} {...props} />,
          li: (props: any) => <li className="pl-2" {...props} />,
          strong: (props: any) => <strong className="font-black text-on-surface" {...props} />,
          em: (props: any) => <em className="italic opacity-80" {...props} />,
          a: (props: any) => <a className="text-primary hover:underline font-extrabold" target="_blank" rel="noopener noreferrer" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
