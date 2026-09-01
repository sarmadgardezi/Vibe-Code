'use client';

import React, { useState } from 'react';
import { Sparkles, MessageSquare, X, Send, Bot, Zap, MapPin, Ticket } from 'lucide-react';
import Image from 'next/image';

export function GeminiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'ai',
      text: 'Hi! I am your GDG Islamabad AI Assistant. Ask me anything about the GDG Cloud Summit 2026, schedule, CNIC ticket verification, or carpool pin drops!'
    }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setChatHistory((prev) => [...prev, { sender: 'user', text: userText }]);
    setInputMsg('');

    // Dynamic simulated Gemini AI responses
    setTimeout(() => {
      let reply = "That's a great question! GDG Cloud Summit 2026 is taking place at Pak-China Friendship Centre on Sept 26. Make sure to present your CNIC QR ticket at entry!";
      const lower = userText.toLowerCase();

      if (lower.includes('carpool') || lower.includes('map') || lower.includes('ride')) {
        reply = "You can offer or request a carpool ride using our interactive Leaflet Carpool Map! Drop a pin at your neighborhood in Islamabad/Rawalpindi with your departure time and seats available.";
      } else if (lower.includes('cnic') || lower.includes('login') || lower.includes('ticket')) {
        reply = "Our portal enforces security with CNIC verification (Format: XXXXX-XXXXXXX-X). Once logged in, your free pass generates a digital QR ticket saved directly in your dashboard.";
      } else if (lower.includes('venue') || lower.includes('where') || lower.includes('location')) {
        reply = "Pak-China Friendship Centre, Garden Avenue, Shakarparian, Islamabad. Pin drops are visible directly on our Carpool Map page.";
      }

      setChatHistory((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen ? (
        <div className="w-80 md:w-96 bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
          {/* AI Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-amber-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-none flex items-center gap-1">
                  Gemini Community AI
                </h4>
                <span className="text-[10px] text-blue-100">Powered by Google AI Studio</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-blue-100 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => setInputMsg('How does the carpool pin drop work?')}
              className="bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-full hover:border-blue-400 shrink-0"
            >
              🚗 Carpool Info
            </button>
            <button
              onClick={() => setInputMsg('Where is Pak-China Centre?')}
              className="bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-full hover:border-blue-400 shrink-0"
            >
              📍 Venue Map
            </button>
          </div>

          {/* Chat Messages */}
          <div className="p-4 h-72 overflow-y-auto space-y-3 text-xs">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-[#4285F4] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#4285F4] text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 border-t border-gray-100 flex items-center gap-2 bg-white">
            <input
              type="text"
              placeholder="Ask Gemini AI..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-full border border-gray-200 text-xs focus:ring-2 focus:ring-[#4285F4] focus:outline-none"
            />
            <button
              type="submit"
              className="p-2 rounded-full bg-[#4285F4] hover:bg-blue-600 text-white transition-all shadow-md shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-[#4285F4] hover:bg-[#3367D6] text-white px-5 py-3 rounded-full shadow-2xl transition-all hover:scale-105 font-medium text-xs border border-white/30 group"
        >
          <Sparkles className="w-4 h-4 text-[#FBBC05] animate-pulse" />
          <span>Ask Gemini AI</span>
        </button>
      )}
    </div>
  );
}
