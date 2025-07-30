import React from 'react';
import { type Message, Sender } from '../types';
import { BotAvatarIcon } from './icons';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.User;

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-xs md:max-w-md lg:max-w-lg bg-blue-600 text-white p-3 rounded-l-xl rounded-t-xl shadow-md">
          <p className="text-sm whitespace-pre-line">{message.text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start items-end space-x-3">
      <BotAvatarIcon className="w-8 h-8 flex-shrink-0 mb-1" />
      <div className="max-w-xs md:max-w-md lg:max-w-lg bg-gray-700/60 text-gray-200 p-3 rounded-r-xl rounded-t-xl shadow-md">
        <p className="text-sm whitespace-pre-line">{message.text}</p>
      </div>
    </div>
  );
};