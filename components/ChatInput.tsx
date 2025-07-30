import React, { useState } from 'react';
import { SendIcon } from './icons';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="p-4 bg-transparent border-t border-white/10 flex-shrink-0">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 w-full px-4 py-3 bg-[#2A2A2A] text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow disabled:opacity-50 placeholder-gray-500"
          disabled={isLoading}
          aria-label="Digite sua mensagem"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="p-3 rounded-full text-white bg-green-600 hover:bg-green-500 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1E1E1E] focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          aria-label="Enviar mensagem"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};