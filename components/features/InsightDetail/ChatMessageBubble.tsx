
import React from 'react';
import { Search, Zap, Cpu } from 'lucide-react';
import { ChatMessage } from '../../../types';
import MarkdownRenderer from '../../ui/MarkdownRenderer';
import { BaconLogo } from '../../ui/Logo';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in space-y-1.5`}>
      <div className={`
        max-w-[92%] p-3 md:p-4 text-[0.9rem] leading-relaxed relative border
        ${isUser 
          ? 'bg-on-surface text-surface border-on-surface rounded-2xl rounded-tr-none shadow-lg' 
          : 'bg-card text-on-surface border-outline-variant/20 rounded-2xl rounded-tl-none shadow-sm'}
      `}>
        {!isUser && (
          <div className="flex items-center justify-between mb-2 gap-4">
             <div className="flex items-center gap-2 opacity-40">
                <BaconLogo className="w-3.5 h-3.5" />
                <span className="text-[7px] font-black uppercase tracking-[0.3em]">Refined Signal</span>
             </div>
          </div>
        )}
        <MarkdownRenderer content={message.text} className="chat-markdown" />
      </div>

      {message.sources && message.sources.length > 0 && (
        <div className="flex flex-wrap gap-1 px-1">
          {message.sources.map((src, idx) => (
            <a 
              key={idx} 
              href={src.uri} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2 py-1 bg-surface-container-high text-[7px] font-black uppercase tracking-widest text-primary border border-primary/20 rounded-md"
            >
              <Search size={8} /> {src.title || 'Source'}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
