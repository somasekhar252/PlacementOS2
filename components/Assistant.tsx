import React, { useState, useRef, useEffect } from 'react';
import { chatWithAssistant } from '../services/geminiService';
import { Message } from '../types';

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Welcome to PlacementOS. I am your career strategist. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await chatWithAssistant(messages, userMsg);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Connection error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-220px)] bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden">
      <div className="p-6 bg-[#0B1224] text-white flex items-center justify-between">
        <h3 className="font-black text-xl">Career Strategy AI</h3>
        <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Gemini 1.5 Flash</span>
      </div>

      <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-6 bg-[#F8FAFC] custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-6 py-4 rounded-3xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 border'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-white border-t border-slate-100 flex gap-3">
        <input 
          className="flex-1 bg-slate-100 p-4 rounded-2xl outline-none font-bold text-sm" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything..."
        />
        <button onClick={handleSend} disabled={isLoading} className="bg-blue-600 text-white px-8 rounded-xl font-black uppercase text-[10px]">
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default Assistant;
