import React from 'react';
import { type User } from '../types';
import { SettingsIcon, LogoutIcon, LeadsIcon } from './icons';

interface ChatHeaderProps {
  currentUser: User | null;
  onToggleSettings: () => void;
  onLogout: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ currentUser, onToggleSettings, onLogout }) => {
  const handleLeadsClick = () => {
    window.open('https://docs.google.com/spreadsheets/d/14qkYLP4Q_BKz7reN28nnT_Qp9fdlmnj-j8td6r1lfJg/edit?usp=sharing', '_blank', 'noopener,noreferrer');
  };

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
      <div className="flex items-center space-x-4">
        <button 
          onClick={handleLeadsClick}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-gray-200 bg-white/5 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Abrir planilha de leads"
        >
          <LeadsIcon className="w-5 h-5" />
          <span>Leads</span>
        </button>
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
