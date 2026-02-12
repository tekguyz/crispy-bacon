
import React from 'react';
import { Search, Bot } from 'lucide-react';
import { ChatMessage } from '../../../types';
import MarkdownRenderer from '../../ui/MarkdownRenderer';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in gap-1`}>
      {!isUser && (
         <div className="flex items-center gap-2 px-1 mb-0.5 opacity-50">
            <Bot size={10} className="text-primary" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Assistant</span>
         </div>
      )}

      <div className={`
        max-w-[94%] px-3.5 py-3 text-[13px] leading-relaxed relative border shadow-sm
        ${isUser 
          ? 'bg-primary text-on-primary border-primary/20 rounded-[1.25rem] rounded-tr-sm' 
          : 'bg-surface-container-low text-on-surface border-outline-variant/10 rounded-[1.25rem] rounded-tl-sm'}
      `}>
        <MarkdownRenderer content={message.text} className={isUser ? "chat-markdown-user" : "chat-markdown"} />
      </div>

      {message.sources && message.sources.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1.5 px-1 max-w-[94%]">
          {message.sources.map((src, idx) => (
            <a 
              key={idx} 
              href={src.uri} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-high hover:bg-surface-container-highest text-[8px] font-black uppercase tracking-widest text-primary border border-outline-variant/20 rounded-lg transition-colors truncate max-w-full"
            >
              <Search size={8} strokeWidth={3} /> 
              <span className="truncate">{src.title || 'Source'}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
