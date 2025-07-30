import React from 'react';

export const HeaderIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M4.5 3.75a.75.75 0 01.75-.75h13.5a.75.75 0 01.75.75v16.5a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V3.75zM9 6a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008A.75.75 0 019 6.75V6zm.002 3.002a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z"
      clipRule="evenodd"
    />
  </svg>
);

export const BotAvatarIcon = ({ className }: { className?: string }) => (
  <div className={`flex items-center justify-center rounded-full bg-gray-600 ${className}`}>
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm3 4a1 1 0 011-1h6a1 1 0 110 2H8a1 1 0 01-1-1zm-1 4a1 1 0 100 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
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