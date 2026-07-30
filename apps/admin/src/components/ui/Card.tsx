import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`bg-[#1A3328] rounded-xl border border-[#1A4731] shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
};
