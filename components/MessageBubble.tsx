import React from 'react';
import { type Message, Sender } from '../types';
import { BotAvatarIcon, UserAvatarIcon } from './icons';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.User;

  return (
    <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <BotAvatarIcon className="w-9 h-9" />}
      
      <div 
        className={`relative max-w-xs md:max-w-md lg:max-w-xl px-3.5 py-2.5 shadow-md ${
          isUser
            ? 'bg-green-600 text-white rounded-xl rounded-br-sm'
            : 'bg-[#2A2A2A] text-gray-200 rounded-xl rounded-bl-sm'
        }`}
      >
        <p className="text-base whitespace-pre-wrap pb-3">{message.text}</p>
        <span className={`absolute bottom-1.5 right-3 text-xs ${isUser ? 'text-green-200/70' : 'text-gray-500'}`}>
          {message.timestamp}
        </span>
      </div>

      {isUser && <UserAvatarIcon className="w-8 h-8" />}
    </div>
  );
};