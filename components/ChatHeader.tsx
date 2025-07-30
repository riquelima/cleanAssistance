import React from 'react';
import { HeaderIcon } from './icons';

export const ChatHeader: React.FC = () => {
  return (
    <div className="p-4 text-white border-b border-white/10 flex-shrink-0 flex items-center space-x-4">
      <HeaderIcon className="w-7 h-7 text-gray-400" />
      <div>
        <h1 className="text-base font-semibold text-gray-100">Orçamento Faxina</h1>
        <p className="text-sm text-gray-400">Assistente Inteligente para Orçamentos</p>
        <div className="flex items-center mt-1.5">
          <span className="h-2 w-2 bg-green-500 rounded-full mr-1.5"></span>
          <p className="text-xs font-medium text-gray-400">Online</p>
        </div>
      </div>
    </div>
  );
};