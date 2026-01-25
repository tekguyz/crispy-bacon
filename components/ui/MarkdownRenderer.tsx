
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const isChat = className.includes('chat-markdown');
  const isSummary = className.includes('prose-summary');
  const isInline = className.includes('inline-markdown');

  // Ensure content is a string
  const safeContent = typeof content === 'string' ? content : '';

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        components={{
          h1: (props: any) => <h1 className={`${isChat ? 'text-sm font-extrabold mb-2' : isSummary ? 'text-4xl md:text-6xl font-serif mb-10' : 'text-2xl font-extrabold mb-4'} uppercase tracking-tighter leading-none text-on-surface`} {...props} />,
          h2: (props: any) => <h2 className={`${isChat ? 'text-xs font-extrabold mb-1' : 'text-xl font-extrabold mb-3'} uppercase text-on-surface`} {...props} />,
          h3: (props: any) => {
            const h3Class = isSummary 
              ? 'font-mono text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] text-on-surface/40 mt-14 mb-6 block border-b border-outline-variant/10 pb-2' 
              : 'text-lg font-extrabold mb-2 uppercase text-on-surface';
            return <h3 className={h3Class} {...props} />;
          },
          p: (props: any) => {
            const pClass = isChat 
              ? 'text-sm mb-3 leading-relaxed' 
              : isSummary 
                ? 'text-xl md:text-2xl mb-8 last:mb-0 leading-[1.8] font-medium text-on-surface/90' 
                : isInline
                  ? 'mb-0 leading-tight'
                  : 'text-lg mb-6 leading-relaxed';
            return <p className={pClass} {...props} />;
          },
          ul: (props: any) => <ul className={`${isChat ? 'list-disc pl-4 space-y-1 mb-3' : 'list-disc pl-8 space-y-4 mb-8'} opacity-90`} {...props} />,
          li: (props: any) => <li className="pl-2" {...props} />,
          strong: (props: any) => <strong className="font-black text-on-surface" {...props} />,
          em: (props: any) => <em className="italic opacity-80" {...props} />,
          a: (props: any) => <a className="text-primary hover:underline font-extrabold" target="_blank" rel="noopener noreferrer" {...props} />,
          code: (props: any) => <code className="font-mono bg-surface-container-highest px-1.5 py-0.5 rounded text-[0.9em]" {...props} />,
        }}
      >
        {safeContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
