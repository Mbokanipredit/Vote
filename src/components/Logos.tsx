import React, { useState } from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  alt?: string;
}

export const KLogo1: React.FC<LogoProps> = ({ size = 52, className = '', alt = 'K Consulting Logo 1' }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div 
        style={{ width: size, height: size }}
        className={`rounded-2xl bg-black border border-brand-amber/30 flex items-center justify-center font-black text-brand-amber font-heading shadow-md ${className}`}
      >
        <span style={{ fontSize: size * 0.38 }}>K1</span>
      </div>
    );
  }

  return (
    <div 
      style={{ width: size, height: size }}
      className={`relative shrink-0 rounded-2xl overflow-hidden bg-black/60 p-1 border border-brand-amber/25 hover:border-brand-amber/60 shadow-lg shadow-black/60 transition-all duration-300 ${className}`}
    >
      <img
        src="/logo1.png"
        alt={alt}
        className="w-full h-full object-contain rounded-xl"
        onError={() => setError(true)}
      />
    </div>
  );
};

export const KLogo2: React.FC<LogoProps> = ({ size = 52, className = '', alt = 'K Consulting Logo 2' }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div 
        style={{ width: size, height: size }}
        className={`rounded-2xl bg-black border border-brand-amber/30 flex items-center justify-center font-black text-brand-amber font-heading shadow-md ${className}`}
      >
        <span style={{ fontSize: size * 0.38 }}>K2</span>
      </div>
    );
  }

  return (
    <div 
      style={{ width: size, height: size }}
      className={`relative shrink-0 rounded-2xl overflow-hidden bg-black/60 p-1 border border-brand-amber/25 hover:border-brand-amber/60 shadow-lg shadow-black/60 transition-all duration-300 ${className}`}
    >
      <img
        src="/logo2.png"
        alt={alt}
        className="w-full h-full object-contain rounded-xl"
        onError={() => setError(true)}
      />
    </div>
  );
};

export const KConsultingDualLogo: React.FC<{ size?: number; showBadge?: boolean }> = ({
  size = 56,
  showBadge = true,
}) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center justify-center gap-3">
        <KLogo1 size={size} />
        <div className="h-7 w-[1px] bg-gradient-to-b from-transparent via-brand-amber/40 to-transparent" />
        <KLogo2 size={size} />
      </div>

      {showBadge && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-amber/10 border border-brand-amber/30 text-brand-amber text-[10px] font-extrabold uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-amber animate-pulse" />
          <span>K Consulting • Goma</span>
        </div>
      )}
    </div>
  );
};

export const DRCFlagIcon: React.FC<{ size?: number }> = ({ size = 18 }) => {
  return (
    <svg 
      width={size} 
      height={size * 0.7} 
      viewBox="0 0 800 600" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className="inline-block rounded-xs shadow-xs align-middle"
    >
      <rect width="800" height="600" fill="#007FFF" />
      <path d="M 0 600 L 800 0 L 800 120 L 160 600 Z" fill="#D21034" />
      <path d="M 0 600 L 800 0 L 800 25 L 33 600 Z" fill="#FDD017" />
      <path d="M 127 600 L 800 95 L 800 120 L 160 600 Z" fill="#FDD017" />
      <path
        d="M 150 70 L 163 110 L 205 110 L 171 135 L 184 175 L 150 150 L 116 175 L 129 135 L 95 110 L 137 110 Z"
        fill="#FDD017"
      />
    </svg>
  );
};
