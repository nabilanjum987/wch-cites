'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { City } from '@/types/city';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_BUTTONS = [
  { label: 'Prayer Times', icon: '🕌', query: 'What are the prayer times today?' },
  { label: 'Weather', icon: '🌤️', query: 'What is the current weather?' },
  { label: 'Gold Rate', icon: '🥇', query: 'What is the gold rate today?' },
  { label: 'Emergency', icon: '🆘', query: 'What are the emergency contacts?' },
  { label: 'Events', icon: '🎉', query: 'What events are happening today?' },
];

function getRuleBasedResponse(query: string, city: City): string {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('prayer') || lowerQuery.includes('namaz')) {
    return `Prayer times for ${city.name}:\n\nFajr: 5:15 AM\nDhuhr: 12:30 PM\nAsr: 4:45 PM\nMaghrib: 6:30 PM\nIsha: 8:00 PM\n\nThese times may vary slightly. Please check the Prayer Times section for accurate timings.`;
  }

  if (lowerQuery.includes('weather') || lowerQuery.includes('temperature')) {
    return `Current weather in ${city.name}:\n\nTemperature: 32°C\nCondition: Clear sky\nHumidity: 45%\nWind: 12 km/h\n\nCheck the Weather Snapshot section for detailed forecast.`;
  }

  if (lowerQuery.includes('gold') || lowerQuery.includes('rate') || lowerQuery.includes('price')) {
    return `Gold rates in ${city.name}:\n\n24K Gold: PKR 225,000/tola\n22K Gold: PKR 206,000/tola\n18K Gold: PKR 169,000/tola\n\nSilver: PKR 2,850/tola\n\nSee the Rates section for live updates.`;
  }

  if (lowerQuery.includes('emergency') || lowerQuery.includes('police') || lowerQuery.includes('ambulance')) {
    return `Emergency contacts for ${city.country}:\n\n🚔 Police: 15\n🚑 Ambulance: 1122\n🚒 Fire: 16\n\nWomen's Helpline: 1091\nChild Helpline: 1123\n\nTap the Emergency section for one-click calling.`;
  }

  if (lowerQuery.includes('event') || lowerQuery.includes('happen')) {
    return `Events in ${city.name} today:\n\n🎭 Cultural Festival at 6 PM\n🏏 Cricket Match at Gaddafi Stadium\n🎵 Music Night at MM Alam Road\n\nCheck the Events section for details and tickets.`;
  }

  if (lowerQuery.includes('famous') || lowerQuery.includes('visit') || lowerQuery.includes('place')) {
    return `Famous places in ${city.name}:\n\n🏛️ Lahore Fort (UNESCO World Heritage)\n🕌 Badshahi Mosque\n🌳 Shalimar Gardens\n🗼 Minar-e-Pakistan\n\nVisit the Famous Places section for more.`;
  }

  if (lowerQuery.includes('food') || lowerQuery.includes('eat') || lowerQuery.includes('restaurant')) {
    return `Popular food in ${city.name}:\n\n🍛 Nihari - MM Alam Road\n🍖 Seekh Kabab - Fort Road\n🥘 Paye - Lakshmi Chowk\n🍵 Lassi - Mozang\n\nExplore the Street Food section for best spots.`;
  }

  if (lowerQuery.includes('population') || lowerQuery.includes('people')) {
    return `${city.name} quick facts:\n\n👥 Population: 11+ million\n📐 Area: 1,772 km²\n🏔️ Elevation: 217 m\n🕒 Timezone: PKT (UTC+5)\n\nSee City Facts for more details.`;
  }

  if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
    return `Hello! I'm your ${city.name} assistant. I can help you with:\n\n🕌 Prayer times\n🌤️ Weather updates\n💰 Gold/Currency rates\n📍 Famous places\n🍜 Food recommendations\n🆘 Emergency contacts\n\nWhat would you like to know?`;
  }

  return `Thank you for your question about ${city.name}!\n\nI can help you with:\n• Prayer times & religious info\n• Weather & air quality\n• Gold rates & currency\n• Famous places & events\n• Food & shopping\n• Emergency contacts\n\nPlease try asking about one of these topics, or use the quick buttons below.`;
}

export function Chatbot({ city }: { city: City }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I'm your ${city.name} assistant. How can I help you today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (query?: string) => {
    const messageText = query || input.trim();
    if (!messageText) return;

    const userMessage: Message = { role: 'user', content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsOpen(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const response = getRuleBasedResponse(messageText, city);
    const assistantMessage: Message = { role: 'assistant', content: response };

    setMessages((prev) => [...prev, assistantMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-colors z-50 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? (
          <span className="text-xl">✕</span>
        ) : (
          <span className="text-2xl">🤖</span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-80 max-w-[calc(100vw-48px)] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-200"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-emerald-600 text-white p-4">
              <h3 className="font-bold text-lg">{city.name} Assistant</h3>
              <p className="text-xs opacity-80">Ask me anything about the city</p>
            </div>

            <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 text-sm ${
                      msg.role === 'user'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    {msg.content.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? 'mt-1' : ''}>
                        {line || '\u00A0'}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 py-2 border-t border-gray-100 bg-white">
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {QUICK_BUTTONS.map((btn) => (
                  <button
                    key={btn.label}
                    onClick={() => handleSend(btn.query)}
                    className="flex-shrink-0 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors flex items-center gap-1"
                  >
                    <span>{btn.icon}</span>
                    <span>{btn.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your question..."
                  className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
