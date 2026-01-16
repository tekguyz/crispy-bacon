
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
  const usage = message.usage;

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
             {usage && (
                <div className="flex items-center gap-2 group/telemetry">
                   <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-surface-container-highest border border-outline-variant/10 rounded-md shadow-inner">
                      <Cpu size={8} className="text-primary opacity-40" />
                      <span className="text-[6px] font-mono font-black text-on-surface-variant uppercase tracking-tighter tabular-nums">
                        {usage.model.replace('gemini-', '').toUpperCase()} :: {usage.totalTokens.toLocaleString()}t
                      </span>
                   </div>
                </div>
             )}
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