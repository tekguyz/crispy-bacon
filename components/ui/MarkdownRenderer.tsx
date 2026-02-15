
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
          h1: (props: any) => <h1 className={`${isChat ? 'text-sm font-extrabold mb-1' : isSummary ? 'text-3xl md:text-5xl font-serif mb-6' : 'text-xl font-extrabold mb-3'} uppercase tracking-tighter leading-tight text-on-surface`} {...props} />,
          h2: (props: any) => <h2 className={`${isChat ? 'text-xs font-extrabold mb-1' : 'text-lg font-extrabold mb-2'} uppercase text-on-surface`} {...props} />,
          h3: (props: any) => {
            // GRANOLA LABEL STANDARD v2: Unified across Markdown, Takeaways, and Tasks.
            // Updated to font-serif for Humanist typography stack.
            const h3Class = isSummary 
              ? 'font-serif text-[10px] font-black uppercase tracking-[0.35em] text-on-surface-variant/60 mt-10 mb-6 block' 
              : 'font-serif text-[9px] font-black uppercase tracking-[0.35em] text-on-surface-variant opacity-60 mb-2';
            return <h3 className={h3Class} {...props} />;
          },
          p: (props: any) => {
            const pClass = isChat 
              ? 'text-sm mb-2 leading-relaxed' 
              : isSummary 
                // Summary Body: Serif, Medium weight, Larger text for readability
                ? 'text-lg md:text-xl mb-6 last:mb-0 leading-[1.6] font-medium font-serif text-on-surface' 
                : isInline
                  ? 'mb-0 leading-tight'
                  : 'text-sm mb-3 leading-relaxed text-on-surface';
            return <p className={pClass} {...props} />;
          },
          ul: (props: any) => <ul className={`${isChat ? 'list-disc pl-4 space-y-0.5 mb-2' : 'list-disc pl-6 space-y-2 mb-4'} opacity-90`} {...props} />,
          li: (props: any) => <li className="pl-1" {...props} />,
          strong: (props: any) => <strong className="font-bold text-on-surface" {...props} />,
          em: (props: any) => <em className="italic opacity-80" {...props} />,
          a: (props: any) => <a className="text-primary hover:underline font-extrabold" target="_blank" rel="noopener noreferrer" {...props} />,
          code: (props: any) => <code className="font-mono bg-surface-container-highest px-1.5 py-0.5 rounded text-[0.9em]" {...props} />,
          // Explicitly hide HRs in summary view to clean up "Deep Distill" output
          hr: () => isSummary ? null : <div className="h-px bg-outline-variant/5 my-8" />
        }}
      >
        {safeContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
