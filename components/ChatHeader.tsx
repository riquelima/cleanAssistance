import React from 'react';
import { type User } from '../types';
import { SettingsIcon, LogoutIcon } from './icons';

interface ChatHeaderProps {
  currentUser: User | null;
  onToggleSettings: () => void;
  onLogout: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ currentUser, onToggleSettings, onLogout }) => {
  return (
    <div className="p-4 text-white border-b border-white/10 flex-shrink-0 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <img
          src="https://raw.githubusercontent.com/riquelima/cleanAssistance/refs/heads/main/NorthLogo.png"
          alt="Logo"
          className="w-24 h-auto"
        />
        <div>
          <h1 className="text-base font-semibold text-gray-100">💰Orçamento de Limpeza | 🧾 Procedimentos | 📚 Material Didático</h1>
          <div className="flex items-center mt-1">
            <span className="h-2 w-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
            <p className="text-sm font-medium text-gray-400">Online - Assistente IA</p>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {currentUser?.username === 'admin' && (
            <button 
              onClick={onToggleSettings}
              className="p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Abrir configurações"
            >
              <SettingsIcon className="w-6 h-6 text-gray-400" />
            </button>
        )}
        <button 
          onClick={onLogout}
          className="p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Sair"
        >
          <LogoutIcon className="w-6 h-6 text-gray-400" />
        </button>
      </div>
    </div>
  );
};
