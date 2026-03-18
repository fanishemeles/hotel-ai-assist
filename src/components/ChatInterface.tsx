import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const ChatInterface = () => {
  const { hotels, messages, sendMessage } = useApp();
  const selectedHotel = hotels[0] || { id: 'default', name: 'Hotel' };
  const [input, setInput] = useState('');
  const [lang, setLang] = useState<'en' | 'am'>('en');
  const [loading, setLoading] = useState(false);

  const guestId = 'guest_session_123';

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    setLoading(true);
    const text = input;
    setInput('');
    
    try {
      await sendMessage(selectedHotel.id, guestId, text);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-md mx-auto bg-slate-50 rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
      {/* WhatsApp Header */}
      <div className="bg-[#075E54] p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-bold text-sm">{selectedHotel.name} AI</h3>
            <p className="text-[10px] opacity-80">Online Concierge</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/10"
            onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
          >
            <Globe size={18} />
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#e5ddd5]">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 text-sm mt-10">
            Welcome! Ask anything in English or Amharic.
          </div>
        )}
        {messages.map((m, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={m.id || idx}
            className={`flex ${m.sender === 'guest' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-3 rounded-lg shadow-sm text-sm ${
              m.sender === 'guest' 
                ? 'bg-[#dcf8c6] rounded-tr-none' 
                : 'bg-white rounded-tl-none'
            }`}>
              <p className="whitespace-pre-wrap">{m.text}</p>
              <p className="text-[9px] text-slate-400 mt-1 text-right">
                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-[#f0f2f5] p-3 flex items-center gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={lang === 'en' ? "Type a message..." : "\u1218\u120d\u12a5\u12ad\u1275 \u12ed\u133b\u1349..."}
          className="bg-white border-none rounded-full h-10"
          disabled={loading}
        />
        <Button 
          onClick={handleSend}
          disabled={loading}
          className="rounded-full w-10 h-10 p-0 bg-[#00a884] hover:bg-[#008f72]"
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
};