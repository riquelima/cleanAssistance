import React from 'react';
import { ClockIcon } from './icons';

// A new component for the Lottie animation icon
const LottieIcon = () => (
    <dotlottie-wc 
        src="https://lottie.host/0ffc67e0-0fdc-4a9d-97a1-a6d79908267c/9AdLC2EdVQ.lottie" 
        style={{ width: '60px', height: '60px' }} 
        speed="1" 
        autoplay 
        loop>
    </dotlottie-wc>
);

export const ChatHeader: React.FC = () => {
  return (
    <div className="p-4 text-white border-b border-white/10 flex-shrink-0 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <LottieIcon />
        <div>
          <h1 className="text-base font-semibold text-gray-100">Orçamento de Limpeza</h1>
          <div className="flex items-center mt-1">
            <span className="h-2 w-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
            <p className="text-sm font-medium text-gray-400">Online - Assistente IA</p>
          </div>
        </div>
      </div>
      <button className="flex items-center space-x-2 px-3 py-1.5 bg-zinc-700/50 hover:bg-zinc-700/80 rounded-md text-sm text-gray-300 transition-colors">
        <ClockIcon className="w-4 h-4" />
        <span>Resposta rápida</span>
      </button>
    </div>
  );
};
