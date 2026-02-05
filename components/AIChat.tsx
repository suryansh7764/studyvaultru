import { GoogleGenAI } from "@google/genai";
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Loader2, RotateCcw } from 'lucide-react';
import { generateStudyHelp } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Call service without history to ensure fresh response every time
    const responseText = await generateStudyHelp(input);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 bg-university-900 dark:bg-slate-800 text-white px-5 py-3 rounded-full shadow-2xl hover:bg-university-800 dark:hover:bg-slate-700 hover:scale-105 transition-all duration-300"
        >
          <div className="relative">
            <Sparkles className="h-5 w-5 text-university-accent" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-university-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-university-accent"></span>
            </span>
          </div>
          <span className="font-medium">Academic Help</span>
        </button>
      )}

      {isOpen && (
        <div className="bg-white dark:bg-slate-900 w-[90vw] sm:w-[400px] h-[550px] rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-university-900 dark:bg-slate-800 p-4 flex justify-between items-center text-white border-b border-white/5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-university-accent" />
              <h3 className="font-semibold font-serif text-lg">Study Assistant</h3>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleClearChat}
                className="text-gray-400 hover:text-white transition-colors p-1"
                title="Clear Session"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-950">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                 <div className="bg-university-accent/10 p-4 rounded-full mb-4">
                    <Sparkles className="h-8 w-8 text-university-accent" />
                 </div>
                 <h4 className="text-gray-900 dark:text-white font-bold mb-2">How can I assist you?</h4>
                 <p className="text-gray-500 dark:text-gray-400 text-xs">Ask about Ranchi University syllabus, clarify complex concepts, or request summaries of your notes.</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm
                    ${msg.role === 'user' 
                      ? 'bg-university-900 dark:bg-university-accent text-white rounded-br-none' 
                      : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                    }
                  `}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                 <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-3 rounded-2xl rounded-bl-none shadow-sm">
                   <Loader2 className="h-5 w-5 animate-spin text-university-accent" />
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question..."
                className="flex-1 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-university-accent focus:ring-1 focus:ring-university-accent transition-all dark:text-white"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-university-accent text-white p-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;