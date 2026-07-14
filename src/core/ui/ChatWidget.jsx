"use client";

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@/core/providers/auth-provider';
import { useJob } from '@/core/providers/providers';
import api from '@/core/lib/api-client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/lib/query-keys';
import { Bot, Send, X, Sparkles, MessageSquare, Loader2, Trash2 } from 'lucide-react';

const MessageItem = ({ msg }) => (
  <div className={`flex w-full mb-5 ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'} group`}>
    {msg.role === 'assistant' && (
      <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 flex-shrink-0 mr-3 mt-1 group-hover:scale-110 transition-transform duration-300">
        <Bot size={16} />
      </div>
    )}
    <div className={`p-3.5 px-4 rounded-2xl text-[14px] leading-relaxed max-w-[85%] shadow-sm transition duration-300 hover:shadow-md hover:scale-[1.01] ${msg.role === 'assistant' ? 'bg-[var(--surface-elevated)] border border-[var(--hairline)] text-[var(--on-dark)] rounded-tl-sm' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-sm hover:shadow-blue-500/20'}`}>
      {msg.role === 'assistant' ? (
        <ReactMarkdown 
          components={{
            p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
            ul: ({node, ...props}) => <ul className="mb-2 pl-4 list-disc space-y-1 marker:text-slate-500" {...props} />,
            ol: ({node, ...props}) => <ol className="mb-2 pl-4 list-decimal space-y-1 marker:text-slate-500" {...props} />,
            li: ({node, ...props}) => <li className="" {...props} />,
            strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />
          }}
        >
          {msg.content}
        </ReactMarkdown>
      ) : (
        msg.content
      )}
    </div>
  </div>
);

// --- ChatWidget Component ---
export function ChatWidget() {
  const { user } = useAuth();
  const { currentJobContext } = useJob();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const queryClient = useQueryClient();

  const { data: chatHistory, isSuccess } = useQuery({
    queryKey: queryKeys.chat.history,
    queryFn: api.getChatHistory,
    enabled: isOpen && !!user,
  });

  useEffect(() => {
    if (isSuccess && Array.isArray(chatHistory) && chatHistory.length > 0 && messages.length === 0) {
      setMessages(chatHistory);
    }
  }, [isSuccess, chatHistory, messages.length]);

  const sendMessageMutation = useMutation({
    mutationFn: (messageText) => api.sendMessage(messageText, currentJobContext),
    onSuccess: (data) => {
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      // Optionally invalidate chat history so it's fresh on next reload
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.history });
    },
    onError: (error) => {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to AI. Please try again later." }]);
    }
  });

  const clearChatMutation = useMutation({
    mutationFn: () => api.clearChatHistory(),
    onSuccess: () => {
      setMessages([{ role: 'assistant', content: 'Chat history cleared. How can I help you?' }]);
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.history });
    },
    onError: (error) => {
      console.error("Failed to clear chat:", error);
    }
  });

  const handleSend = (e) => {
    e?.preventDefault();
    const messageText = input.trim();
    if (!messageText || sendMessageMutation.isPending) return;

    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    sendMessageMutation.mutate(messageText);
  };

  const handleClearChat = () => {
    clearChatMutation.mutate();
  };

  if (!mounted || !user) return null;

  const isChatLoading = sendMessageMutation.isPending;

  return (
    <>
      <button type="button" className={`fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] z-[1001] transition duration-300 hover:scale-110 ${isOpen ? 'bg-slate-800 rotate-90 shadow-none' : 'bg-gradient-to-tr from-blue-600 to-indigo-600'}`} 
        onClick={() => setIsOpen(prev => !prev)}
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </button>

      <div className={`fixed bottom-24 right-6 w-[380px] h-[550px] max-h-[calc(100vh-120px)] bg-[var(--surface)]/95 backdrop-blur-3xl border border-[var(--hairline)] glass-card rounded-3xl shadow-2xl z-[1000] flex flex-col overflow-hidden transition duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
        <div className="p-4 border-b border-[var(--hairline)] bg-[rgba(var(--primary-rgb),0.02)] flex justify-between items-center relative overflow-hidden group/header">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none transition-colors duration-500 group-hover/header:bg-blue-500/20"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover/header:scale-110 transition-transform duration-300">
              <Bot size={20} />
            </div>
            <div>
              <h5 className="mb-0 text-[15px] font-bold text-white tracking-tight">JobScan AI</h5>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>
                <span className="text-emerald-500 text-[11px] font-bold tracking-wider uppercase">Online</span>
              </div>
            </div>
          </div>
          <button 
            type="button" 
            onClick={handleClearChat}
            className="w-8 h-8 rounded-lg bg-[var(--surface)] text-[var(--muted)] flex items-center justify-center border border-[var(--hairline)] hover:text-red-400 hover:border-red-500/30 transition-colors z-10"
            title="Clear Chat"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-slate-700">
          {messages.length === 0 && !isChatLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-in fade-in zoom-in duration-500 group/empty">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 border border-blue-500/20 group-hover/empty:scale-110 group-hover/empty:bg-blue-500/20 transition duration-500">
                <MessageSquare size={28} />
              </div>
              <h4 className="text-[var(--on-dark)] font-bold text-lg mb-2">How can I help?</h4>
              <p className="text-[var(--muted)] text-[13px] leading-relaxed">
                I'm your JobScan AI Assistant. Ask me to explain red flags, analyze sentences, or clarify why a job was flagged.
              </p>
            </div>
          )}
          {messages.map((msg, index) => <MessageItem key={index} msg={msg} />)}
          {isChatLoading && (
            <div className="flex w-full mb-5 justify-start group">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 flex-shrink-0 mr-3 mt-1 group-hover:scale-110 transition-transform duration-300">
                <Bot size={16} />
              </div>
              <div className="bg-[var(--surface-elevated)] border border-[var(--hairline)] p-3.5 px-4 rounded-2xl rounded-tl-sm flex items-center gap-2 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 animate-pulse" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 animate-pulse" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 animate-pulse" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-[var(--hairline)] bg-[rgba(var(--surface-rgb),0.8)]">
          <form className="relative flex items-center group/input" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Ask anything..." 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              disabled={isChatLoading} 
              className="w-full bg-[rgba(0,0,0,0.2)] border border-[var(--hairline-strong)] text-[var(--on-dark)] rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:bg-[var(--surface-elevated)] focus:border-blue-500 hover:border-blue-500/50 transition placeholder-[var(--muted)]"
            />
            <button 
              type="submit" 
              className="absolute right-2 w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white disabled:opacity-50 disabled:from-slate-700 disabled:to-slate-700 transition hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95" 
              disabled={isChatLoading || !input.trim()}
            >
              {isChatLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          </form>
          <div className="text-center mt-3">
            <span className="text-[var(--muted)] text-[10px] font-medium tracking-wide uppercase opacity-70">Powered by Gemini 3.1 Flash-Lite</span>
          </div>
        </div>
      </div>
    </>
  );
}
