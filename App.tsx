import React, { useState, useEffect, useRef } from 'react';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessages } from './components/ChatMessages';
import { ChatInput } from './components/ChatInput';
import { type Message, Sender } from './types';
import { getBotResponse } from './services/webhookService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial-1',
      sender: Sender.Bot,
      text: 'Olá! Sou seu assistente virtual para orçamentos de faxina. Como posso ajudar você hoje?',
    },
    {
      id: 'initial-2',
      sender: Sender.Bot,
      text: 'Para criar um orçamento personalizado, preciso de algumas informações. Pode me contar sobre o tipo de faxina que você precisa?',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: Sender.User,
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const botText = await getBotResponse(text);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: Sender.Bot,
        text: botText,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        sender: Sender.Bot,
        text: 'Desculpe, ocorreu um erro. Tente novamente em alguns instantes.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen p-2 flex items-center justify-center font-sans">
      <div className="w-full max-w-6xl h-[95vh] max-h-[950px] bg-gray-800/30 backdrop-blur-2xl border border-white/10 rounded-lg shadow-2xl flex flex-col overflow-hidden">
        <ChatHeader />
        <ChatMessages messages={messages} isLoading={isLoading} />
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default App;