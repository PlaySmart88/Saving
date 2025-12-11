import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`relative overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-6 text-white ${className}`}>
      {/* Decorative gradient blob inside card for extra depth */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl pointer-events-none"></div>
      
      {title && (
        <h2 className="text-2xl font-bold mb-6 text-white/90 relative z-10 border-b border-white/10 pb-2">
          {title}
        </h2>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};