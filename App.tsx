import React, { useState } from 'react';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessages } from './components/ChatMessages';
import { ChatInput } from './components/ChatInput';
import { LoginScreen } from './components/LoginScreen';
import { type Message, Sender } from './types';
import { getBotResponse } from './services/webhookService';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial-1',
      sender: Sender.Bot,
      text: `Olá! Sou seu assistente virtual para cotação de limpeza. 👋

Para gerar o orçamento, por favor, me informe os seguintes dados: 

🏠 Tipo de Limpeza (Standard, Deep, Move in/out, Pós-construção): 
📏 Área (em sqft):
🛏️ Quartos:
🚽 Banheiros:

Além disso, deseja incluir algum destes itens extras?

🔥 Forno
🧊 Geladeira
👚 Lavanderia
🚗 Garagem
📦 Organização
🧼 Carpet Shampooing
🪟 Janelas

É só me enviar tudo e eu calculo o valor para você! ✨`,
      timestamp: '09:52',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (user: string, pass: string): boolean => {
    if (user === 'admin' && pass === 'North2025') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const timestamp = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: Sender.User,
      text,
      timestamp,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const botText = await getBotResponse(text);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: Sender.Bot,
        text: botText,
        timestamp: new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        sender: Sender.Bot,
        text: 'Desculpe, ocorreu um erro. Tente novamente em alguns instantes.',
        timestamp: new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="bg-black h-screen font-sans">
      <div className="w-full h-full bg-[#1E1E1E] flex flex-col overflow-hidden">
        <ChatHeader />
        <ChatMessages messages={messages} isLoading={isLoading} />
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default App;
