"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@/frontend/context/auth-context';
import { useJob } from '@/frontend/context/job-context';
import api from '@/frontend/utils/api-client';
import { Bot, Send, X, Sparkles, MessageSquare, Loader2 } from 'lucide-react';

// --- MessageItem Helper ---
const MessageItem = ({ msg }) => (
  <div className={`flex w-full mb-5 ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
    {msg.role === 'assistant' && (
      <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 flex-shrink-0 mr-3 mt-1">
        <Bot size={16} />
      </div>
    )}
    <div className={`p-3.5 px-4 rounded-2xl text-[14px] leading-relaxed max-w-[85%] shadow-sm ${msg.role === 'assistant' ? 'bg-[#0f172a] border border-slate-800 text-slate-300 rounded-tl-sm' : 'bg-blue-600 text-white rounded-tr-sm'}`}>
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

  useEffect(() => { setMounted(true); }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, scrollToBottom]);

  const fetchHistory = useCallback(async () => {
    try {
      const data = await api.getChatHistory();
      if (Array.isArray(data) && data.length > 0) setMessages(data);
    } catch (error) { console.error("Failed to fetch history:", error); }
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0 && user) fetchHistory();
  }, [isOpen, messages.length, fetchHistory, user]);

  const handleSend = useCallback(async (e) => {
    e?.preventDefault();
    const messageText = input.trim();
    if (!messageText || isLoading) return;

    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const data = await api.sendMessage(messageText, currentJobContext);
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to AI. Please try again later." }]);
    } finally { setIsLoading(false); }
  }, [input, isLoading, currentJobContext]);

  if (!mounted) return null;

  return (
    <>
      <button 
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] z-[1001] transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-slate-800 rotate-90 shadow-none' : 'bg-gradient-to-tr from-blue-600 to-indigo-600'}`} 
        onClick={() => setIsOpen(prev => !prev)}
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </button>

      <div className={`fixed bottom-24 right-6 w-[380px] h-[550px] max-h-[calc(100vh-120px)] bg-[#0b1120]/95 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl z-[1000] flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
        <div className="p-4 border-b border-slate-800 bg-[#0f172a]/50 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
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

        </div>

        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-slate-700">
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
                <MessageSquare size={28} />
              </div>
              <h4 className="text-white font-bold text-lg mb-2">How can I help?</h4>
              <p className="text-slate-400 text-[13px] leading-relaxed">
                I'm your JobScan AI Assistant. Ask me to explain red flags, analyze sentences, or clarify why a job was flagged.
              </p>
            </div>
          )}
          {messages.map((msg, index) => <MessageItem key={index} msg={msg} />)}
          {isLoading && (
            <div className="flex w-full mb-5 justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 flex-shrink-0 mr-3 mt-1">
                <Bot size={16} />
              </div>
              <div className="bg-[#0f172a] border border-slate-800 p-3.5 px-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-slate-800 bg-[#0f172a]/80">
          <form className="relative flex items-center" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Ask anything..." 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              disabled={isLoading} 
              className="w-full bg-[#0b1120] border border-slate-700 text-white rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button 
              type="submit" 
              className="absolute right-2 w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white disabled:opacity-50 disabled:bg-slate-700 transition-colors" 
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          </form>
          <div className="text-center mt-3">
            <span className="text-slate-500 text-[10px] font-medium tracking-wide uppercase">Powered by Gemini 3.1 Flash-Lite</span>
          </div>
        </div>
      </div>
    </>
  );
}
