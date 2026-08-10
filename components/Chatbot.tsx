import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, Bot, User, HelpCircle, FileText, Zap } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const PRESET_QUERIES = [
  { text: "How does VibeShift extract fields?", icon: FileText },
  { text: "What forms are supported?", icon: HelpCircle },
  { text: "How do I trigger custom business rules?", icon: Zap },
  { text: "Can I test the extracted forms?", icon: Sparkles }
];

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hi! I am your VibeShift AI Assistant. Ask me anything about document ingestion, OCR extraction, form generation, or business logic rules!",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const generateBotResponse = (userText: string): string => {
    const text = userText.toLowerCase();

    if (text.includes('extract') || text.includes('ocr') || text.includes('image') || text.includes('scan')) {
      return "VibeShift runs an advanced visual-structural OCR analysis. When you upload/capture any image (e.g., invoice, intake form, checklist), our engine parses the key-value alignment, categorizes the form elements (inputs, checkboxes, numbers, textareas), and maps them into an interactive digital form interface.";
    }
    if (text.includes('support') || text.includes('format') || text.includes('type') || text.includes('checklist')) {
      return "We support any single or multi-page documents containing form layouts! The engine has optimized built-in presets for Medical Patient Intake Forms, Café/Restaurant Product Catalogs, and Daily Operations or Store Audit Checklists.";
    }
    if (text.includes('rule') || text.includes('threshold') || text.includes('business') || text.includes('condition')) {
      return "VibeShift supports advanced custom business logic! During extraction, any text or audio detailing conditional structures is parsed (e.g. 'Orders over $20 get 15% off' or 'priority is triggered under threshold'). This generates fully reactive client-side triggers in the preview engine!";
    }
    if (text.includes('test') || text.includes('preview') || text.includes('interactive')) {
      return "Yes, completely! Once your form is extracted, click any project from your Dashboard to open the Live Interactive Form Editor. You can fill out inputs, toggle checkboxes, trigger business rule benefits, and click 'Submit' to run real-time validations.";
    }
    if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
      return "Hello there! How can I assist you with your document workflows or interactive forms today?";
    }
    if (text.includes('creator') || text.includes('vaibhav') || text.includes('who built')) {
      return "VibeShift was crafted by Vaibhav Kanojia, a professional Full-Stack Engineer and UX specialist, with the absolute highest standards of performance, visual identity, and premium user experience.";
    }
    if (text.includes('database') || text.includes('firestore') || text.includes('save') || text.includes('project')) {
      return "Your projects are instantly stored in a high-performance cloud database. Any changes you make or forms you create are fully persisted and retrievable upon your next session.";
    }

    return "That's a great question! VibeShift is built to automate documents-to-apps workflows completely. You can scan forms using your device camera, extract fields instantly, and preview ready-to-use reactive UI elements right in your workspace. Try uploading an image in the Dashboard to see it in action!";
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Realistic typing dynamic effect
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 800));

    const botMsg: Message = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: generateBotResponse(textToSend),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-[90]">
        <motion.button
          id="chatbot-trigger-btn"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(prev => !prev)}
          className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white shadow-[0_8px_30px_rgba(45,212,191,0.25)] border border-white/20 cursor-pointer relative group"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -45, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <MessageSquare size={24} />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0a0a0c] animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-window"
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: 'spring', damping: 22, stiffness: 220 }}
            className="fixed bottom-24 right-6 w-[360px] sm:w-[400px] h-[520px] max-w-[calc(100vw-32px)] max-h-[calc(100vh-120px)] bg-[#0d0d0f]/95 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-[90] backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-gradient-to-r from-teal-500/10 via-teal-500/5 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-zinc-950 border border-white/15">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">VibeShift AI Partner</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] text-zinc-500 font-medium">Always Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Conversation Flow */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/[0.05]">
              {messages.map(msg => {
                const isBot = msg.sender === 'bot';
                return (
                  <div key={msg.id} className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}>
                    {isBot && (
                      <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
                        <Bot size={14} />
                      </div>
                    )}
                    <div className="max-w-[75%] space-y-1">
                      <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        isBot 
                          ? 'bg-white/[0.04] border border-white/5 text-zinc-300 rounded-tl-none' 
                          : 'bg-teal-500 text-zinc-950 rounded-tr-none'
                      }`}>
                        {msg.text}
                      </div>
                      <p className={`text-[8px] text-zinc-600 font-medium ${!isBot && 'text-right'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {!isBot && (
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-zinc-950 text-[10px] font-bold shrink-0 mt-0.5">
                        <User size={13} />
                      </div>
                    )}
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
                    <Bot size={14} />
                  </div>
                  <div className="bg-white/[0.04] border border-white/5 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions Box */}
            {messages.length === 1 && !isTyping && (
              <div className="p-3 border-t border-white/5 bg-white/[0.01]">
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-2 px-1">Quick Help suggestions</p>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_QUERIES.map((q, idx) => {
                    const Icon = q.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSend(q.text)}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-teal-500/20 hover:bg-teal-500/[0.02] text-[10px] text-zinc-400 hover:text-teal-400 transition-all text-left cursor-pointer"
                      >
                        <Icon size={12} className="shrink-0 text-zinc-500" />
                        <span className="line-clamp-2 leading-tight">{q.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Input Panel */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputValue);
              }}
              className="p-3 border-t border-white/5 bg-[#050505]"
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask VibeShift Partner..."
                  className="w-full bg-zinc-900/60 hover:bg-zinc-900/90 focus:bg-zinc-900 border border-white/5 focus:border-teal-500/30 rounded-xl py-2.5 pl-3 pr-10 text-xs text-white placeholder-zinc-500 outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute right-1 w-8 h-8 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 flex items-center justify-center transition-all disabled:opacity-40 disabled:hover:bg-teal-500 cursor-pointer"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
