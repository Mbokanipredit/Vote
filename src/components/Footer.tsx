import React, { useState } from 'react';
import { Phone, Copy, Check, ShieldCheck, MapPin } from 'lucide-react';
import { DRCFlagIcon, KLogo1, KLogo2 } from './Logos';

export const Footer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const phoneNumber = '+243 837 168 481';
  const cleanNumber = phoneNumber.replace(/\s+/g, '');

  const copyPhone = () => {
    navigator.clipboard.writeText(cleanNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="mt-12 pt-8 border-t border-white/8 text-center flex flex-col items-center gap-4 animate-fade-in">
      {/* Logos & Brand */}
      <div className="flex items-center gap-3">
        <KLogo1 size={36} />
        <div className="h-4 w-[1px] bg-brand-amber/30" />
        <KLogo2 size={36} />
      </div>

      <div className="flex flex-col gap-1">
        <h4 className="text-sm sm:text-base text-white font-heading font-extrabold tracking-wider">
          K CONSULTING • GOMA
        </h4>
        <span className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
          <MapPin size={13} className="text-brand-amber" />
          <span>Goma, Nord-Kivu — RDC</span>
          <DRCFlagIcon size={14} />
        </span>
      </div>

      {/* Official Support Hotline */}
      <div className="flex flex-col items-center gap-1.5 mt-1">
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          Assistance & Support Officiel
        </span>
        <button
          onClick={copyPhone}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-amber/25 hover:border-brand-amber bg-white/3 hover:bg-brand-amber/10 text-slate-200 hover:text-brand-amber text-xs sm:text-sm font-mono cursor-pointer transition-all duration-300 outline-none shadow-sm"
        >
          <Phone size={14} className="text-brand-amber" />
          <span>{phoneNumber}</span>
          {copied ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-sans font-bold text-emerald-400">
              <Check size={13} /> Copié
            </span>
          ) : (
            <Copy size={13} className="opacity-60" />
          )}
        </button>
      </div>

      {/* Trust & Transparency */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
        <ShieldCheck size={14} className="text-brand-amber" />
        <span>Scrutin sécurisé et certifié en toute transparence</span>
      </div>

      <span className="text-[10px] sm:text-xs text-slate-400 mt-2 border-t border-white/5 pt-4 w-full">
        &copy; {new Date().getFullYear()} K Consulting Goma. Tous droits réservés.
      </span>
    </footer>
  );
};
