import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { KLogo1, KLogo2, DRCFlagIcon } from './Logos';
import { ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

interface HeaderProps {
  subpageTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ subpageTitle }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  if (!isHome) {
    return (
      <header className="relative w-full flex items-center justify-between py-3 border-b border-white/8 mb-6 animate-fade-in">
        {/* Left: circular back button */}
        <div className="w-20 flex justify-start">
          <Link 
            to="/" 
            className="w-10 h-10 rounded-full border border-brand-amber/30 bg-black/60 flex items-center justify-center text-brand-amber hover:bg-brand-amber hover:text-black hover:shadow-amber-glow transition-all duration-300 cursor-pointer shadow-md"
            title="Retour à l'accueil"
          >
            <ArrowLeft size={18} />
          </Link>
        </div>

        {/* Center: compact two logos with separator */}
        <div className="flex items-center gap-2.5">
          <KLogo1 size={38} />
          <div className="h-5 w-[1px] bg-brand-amber/30" />
          <KLogo2 size={38} />
        </div>

        {/* Right: Subpage title pill */}
        <div className="w-24 flex justify-end">
          {subpageTitle && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-brand-amber/10 border border-brand-amber/30 font-heading text-[10px] sm:text-[11px] text-brand-amber font-extrabold uppercase tracking-widest text-right">
              {subpageTitle}
            </span>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className="flex flex-col items-center gap-4 text-center mb-4 animate-fade-in">
      {/* Official Top Banner Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/4 border border-brand-amber/25 backdrop-blur-md shadow-inner">
        <span className="w-2 h-2 rounded-full bg-brand-amber animate-pulse" />
        <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[2px] text-brand-amber">
          K Consulting • Goma
        </span>
        <DRCFlagIcon size={15} />
      </div>

      {/* Dual Logos Row */}
      <div className="flex items-center justify-center gap-3 my-1">
        <KLogo1 size={64} />
        <div className="h-10 w-[1.5px] bg-gradient-to-b from-transparent via-brand-amber/50 to-transparent" />
        <KLogo2 size={64} />
      </div>

      {/* Main Title Group */}
      <div className="flex flex-col gap-1.5 px-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight gold-text font-heading leading-tight">
          PLATEFORME DE VOTE OFFICIELLE
        </h1>
        <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-[3px] opacity-90 font-heading flex items-center justify-center gap-2">
          <Sparkles size={14} className="text-brand-amber" />
          <span>Influenceurs & Créateurs de Contenu</span>
          <Sparkles size={14} className="text-brand-amber" />
        </h2>
      </div>

      {/* Official Welcome Text requested by user */}
      <div className="glass-panel p-4 sm:p-5 border-brand-amber/20 text-left sm:text-center mt-1">
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
          Bienvenue sur la plateforme de vote officielle de <strong className="text-brand-amber font-bold">K Consulting à Goma</strong>, l'espace de référence pour soutenir et élire vos influenceurs et créateurs de contenu préférés. Faites entendre votre voix en un clic et propulsez les meilleurs talents de notre communauté vers le sommet, en toute transparence et sécurité.
        </p>
        <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-white/8 text-[11px] text-slate-400 font-semibold flex-wrap">
          <span className="inline-flex items-center gap-1 text-emerald-400">
            <ShieldCheck size={14} /> 100% Sécurisé & Transparent
          </span>
          <span className="text-slate-600">•</span>
          <span className="inline-flex items-center gap-1 text-brand-amber">
            ⚡ Validation Express
          </span>
        </div>
      </div>
    </header>
  );
};
