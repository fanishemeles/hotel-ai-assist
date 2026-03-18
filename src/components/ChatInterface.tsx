import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Globe, Calendar, Users, CheckCircle2, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export const ChatInterface = () => {
  const { hotels, setBookings } = useApp();
  const [selectedHotel, setSelectedHotel] = useState(hotels[0]);
  const [messages, setMessages] = useState<{sender: 'guest' | 'ai', text: string, lang: 'en' | 'am'}[]>([
    { sender: 'ai', text: 'Hello! I am your Aura AI concierge for Abyssinia Grand. How can I help you today?', lang: 'en' }
  ]);
  const [input, setInput] = useState('');
  const [lang, setLang] = useState<'en' | 'am'>('en');
  const [bookingStep, setBookingStep] = useState<'none' | 'checkin' | 'checkout' | 'guests' | 'confirm'>('none');
  const [tempBooking, setTempBooking] = useState({ checkIn: '', checkOut: '', guests: 1 });

  const responses = {
    en: {
      greeting: "Hello! I am your Aura AI concierge for ${hotel}. How can I help you today?",
      bookingPrompt: "I'd be happy to help you with a booking. What is your check-in date?",
      checkoutPrompt: "Great! And what is your check-out date?",
      guestsPrompt: "How many guests will be staying?",
      confirmPrompt: "Excellent. I have noted your request for ${hotel} from ${in} to ${out} for ${g} guests. Should I proceed?",
      success: "Your booking request has been sent! The hotel will confirm shortly.",
      unknown: "Let me confirm that for you.",
      complaint: "I am very sorry for the inconvenience. I will escalate this to our management immediately."
    },
    am: {
      greeting: "ጤና ይስጥልኝ! የ ${hotel} Aura AI ረዳት ነኝ። ዛሬ እንዴት ልረዳዎ እችላለሁ?",
      bookingPrompt: "ቦታ ለማስያዝ መርዳት እችላለሁ። መቼ ነው የሚገቡት (Check-in date)?",
      checkoutPrompt: "በጣም ጥሩ! መቼ ነው የሚወጡት (Check-out date)?",
      guestsPrompt: "ስንት እንግዶች ይሆናሉ?",
      confirmPrompt: "በጣም ጥሩ። ለ ${hotel} ከ ${in} እስከ ${out} ለ ${g} እንግዶች ጥያቄዎን መዝግቤያለሁ። ልቀጥል?",
      success: "የቦታ ማስያዣ ጥያቄዎ ተልኳል! ሆቴሉ በቅርቡ ያረጋግጥልዎታል።",
      unknown: "ይህንን አረጋግጬ እነግርዎታለሁ።",
      complaint: "ለተፈጠረው ችግር በጣም ይቅርታ እንጠይቃለን። ጉዳዩን ወዲያውኑ ለኃላፊዎች አሳውቃለሁ።"
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const guestMsg = { sender: 'guest' as const, text: input, lang };
    setMessages(prev => [...prev, guestMsg]);
    setInput('');

    // Simulate AI response logic
    setTimeout(() => {
      let aiText = '';
      const lowerInput = input.toLowerCase();

      if (bookingStep === 'none') {
        if (lowerInput.includes('book') || lowerInput.includes('ቦታ')) {
          setBookingStep('checkin');
          aiText = responses[lang].bookingPrompt;
        } else if (lowerInput.includes('problem') || lowerInput.includes('bad') || lowerInput.includes('ችግር')) {
          aiText = responses[lang].complaint;
        } else {
          aiText = responses[lang].greeting.replace('${hotel}', selectedHotel.name);
        }
      } else if (bookingStep === 'checkin') {
        setTempBooking(prev => ({ ...prev, checkIn: input }));
        setBookingStep('checkout');
        aiText = responses[lang].checkoutPrompt;
      } else if (bookingStep === 'checkout') {
        setTempBooking(prev => ({ ...prev, checkOut: input }));
        setBookingStep('guests');
        aiText = responses[lang].guestsPrompt;
      } else if (bookingStep === 'guests') {
        const g = parseInt(input) || 1;
        setTempBooking(prev => ({ ...prev, guests: g }));
        setBookingStep('confirm');
        aiText = responses[lang].confirmPrompt
          .replace('${hotel}', selectedHotel.name)
          .replace('${in}', tempBooking.checkIn)
          .replace('${out}', input)
          .replace('${g}', g.toString());
      } else if (bookingStep === 'confirm') {
        if (lowerInput.includes('yes') || lowerInput.includes('ok') || lowerInput.includes('እሺ') || lowerInput.includes('አዎ')) {
          const newBooking = {
            id: Math.random().toString(36).substr(2, 9),
            hotelId: selectedHotel.id,
            guestName: 'WhatsApp Guest',
            checkIn: tempBooking.checkIn,
            checkOut: tempBooking.checkOut,
            guests: tempBooking.guests,
            status: 'pending' as const,
            timestamp: new Date().toISOString()
          };
          setBookings(prev => [...prev, newBooking]);
          aiText = responses[lang].success;
          setBookingStep('none');
          toast.success("Booking Request Sent!");
        } else {
          aiText = "No problem. Let me know if you need anything else.";
          setBookingStep('none');
        }
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiText, lang }]);
    }, 1000);
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
        {messages.map((m, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={idx}
            className={`flex ${m.sender === 'guest' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-3 rounded-lg shadow-sm text-sm ${
              m.sender === 'guest' 
                ? 'bg-[#dcf8c6] rounded-tr-none' 
                : 'bg-white rounded-tl-none'
            }`}>
              <p className="whitespace-pre-wrap">{m.text}</p>
              <p className="text-[9px] text-slate-400 mt-1 text-right">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
          placeholder={lang === 'en' ? "Type a message..." : "መልእክት ይጻፉ..."}
          className="bg-white border-none rounded-full h-10"
        />
        <Button 
          onClick={handleSend}
          className="rounded-full w-10 h-10 p-0 bg-[#00a884] hover:bg-[#008f72]"
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
};