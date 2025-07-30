import React from 'react';

export const BotAvatarIcon = ({ className }: { className?: string }) => (
    <div className={`flex flex-shrink-0 items-center justify-center rounded-full bg-green-500/20 ${className}`}>
        <img
            src="https://cdn-icons-png.flaticon.com/512/6007/6007820.png"
            alt="Avatar do Robô"
            className="h-6 w-6"
        />
    </div>
);

export const UserAvatarIcon = ({ className }: { className?: string }) => (
    <div className={`flex flex-shrink-0 items-center justify-center rounded-full bg-zinc-700/80 ${className}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
    </div>
);

export const SendIcon = ({ className }: { className?: string }) => (
    <svg 
        className={className}
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor"
    >
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
    </svg>
);

export const ClockIcon = ({ className }: { className?: string }) => (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 10.586V6z"
        clipRule="evenodd"
      />
    </svg>
  );