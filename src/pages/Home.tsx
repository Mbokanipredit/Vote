import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ShareModal } from '../components/ShareModal';
import { 
  Vote, 
  Trophy, 
  Lock, 
  Share2, 
  Search, 
  ArrowRight, 
  Download,
  X
} from 'lucide-react';

export const Home: React.FC = () => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  return (
    <div className="app-container">
      {/* App Header with Logos and Official Welcome Message */}
      <Header />

      {/* "Comment Ça Marche ?" Section (How It Works) */}
      <section className="flex flex-col gap-3.5 w-full mt-2 animate-slide-up">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-amber shadow-[0_0_8px_#f59e0b]" />
            <h3 className="text-base sm:text-lg font-black text-white font-heading uppercase tracking-wider">
              Comment Ça Marche ?
            </h3>
          </div>
          <span className="text-[10px] font-extrabold text-brand-amber uppercase tracking-widest bg-brand-amber/10 px-2.5 py-1 rounded-full border border-brand-amber/20">
            Guide Simple
          </span>
        </div>

        {/* 3 Step Interactive Cards */}
        <div className="grid grid-cols-1 gap-3">
          {/* STEP 1: Explorez */}
          <Link
            to="/explore"
            className="group relative flex items-start gap-4 p-4.5 rounded-2xl bg-white/2 border border-white/8 hover:border-brand-amber/40 hover:bg-brand-amber/5 transition-all duration-300 cursor-pointer overflow-hidden shadow-card"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-black bg-gradient-to-br from-amber-300 via-brand-amber to-amber-600 shadow-md shadow-brand-amber/20 group-hover:scale-105 transition-transform duration-300 shrink-0 font-extrabold text-lg">
              <Search size={22} />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm sm:text-base font-extrabold text-white group-hover:text-brand-amber transition-colors font-heading">
                  1. Explorez
                </h4>
                <span className="text-[11px] font-bold text-slate-400 group-hover:text-white flex items-center gap-1">
                  Voir <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-snug">
                Découvrez les profils des candidats en lice.
              </p>
            </div>
          </Link>

          {/* STEP 2: Votez */}
          <Link
            to="/vote"
            className="group relative flex items-start gap-4 p-4.5 rounded-2xl bg-white/2 border border-white/8 hover:border-brand-amber/40 hover:bg-brand-amber/5 transition-all duration-300 cursor-pointer overflow-hidden shadow-card"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-black bg-gradient-to-br from-amber-300 via-brand-amber to-orange-500 shadow-md shadow-brand-amber/20 group-hover:scale-105 transition-transform duration-300 shrink-0 font-extrabold text-lg">
              <Vote size={22} />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm sm:text-base font-extrabold text-white group-hover:text-brand-amber transition-colors font-heading">
                  2. Votez
                </h4>
                <span className="text-[11px] font-bold text-slate-400 group-hover:text-white flex items-center gap-1">
                  Participer <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-snug">
                Soutenez vos créateurs favoris de manière sécurisée.
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-brand-amber font-bold font-mono">
                <span>0.5$ (1 200 FC) / voix</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 font-sans">Airtel, M-Pesa, Orange</span>
              </div>
            </div>
          </Link>

          {/* STEP 3: Partagez */}
          <button
            onClick={() => setShowShareModal(true)}
            className="group relative flex items-start gap-4 p-4.5 rounded-2xl bg-white/2 border border-white/8 hover:border-brand-amber/40 hover:bg-brand-amber/5 transition-all duration-300 cursor-pointer overflow-hidden shadow-card text-left w-full outline-none"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-black bg-gradient-to-br from-amber-300 via-brand-amber to-amber-600 shadow-md shadow-brand-amber/20 group-hover:scale-105 transition-transform duration-300 shrink-0 font-extrabold text-lg">
              <Share2 size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm sm:text-base font-extrabold text-white group-hover:text-brand-amber transition-colors font-heading">
                  3. Partagez
                </h4>
                <span className="text-[11px] font-bold text-slate-400 group-hover:text-white flex items-center gap-1">
                  Mobiliser <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-snug">
                Mobilisez vos proches sur les réseaux sociaux.
              </p>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                <span>WhatsApp, Facebook, 𝕏, Telegram</span>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* Main Navigation Actions (Prominent CTAs) */}
      <main className="flex flex-col gap-3 w-full mt-2 animate-slide-up">
        {/* Explore Option Card */}
        <Link 
          to="/explore" 
          className="group relative flex items-center justify-between p-4.5 rounded-2xl bg-white/2 border border-white/8 hover:border-brand-amber/35 hover:bg-brand-amber/5 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden shadow-card"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-brand-amber bg-brand-amber/10 border border-brand-amber/25 shadow-md group-hover:scale-105 transition-transform duration-300">
              <Search size={22} />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white group-hover:text-brand-amber transition-colors duration-200 font-heading">
                  Explorer les Profils & Réseaux
                </h3>
                <span className="bg-brand-amber/15 text-brand-amber text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase border border-brand-amber/30">
                  TikTok • Insta • YouTube
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Découvrez les artistes, envoyez des cœurs ❤️ et suivez-les
              </p>
            </div>
          </div>
          <span className="text-slate-400 group-hover:text-brand-amber group-hover:translate-x-1.5 transition-all duration-300 font-extrabold text-lg">
            &rarr;
          </span>
        </Link>

        {/* Voter Option Main Card */}
        <Link 
          to="/vote" 
          className="group relative flex items-center justify-between p-4.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-black to-amber-500/5 border border-brand-amber/35 hover:border-brand-amber hover:shadow-amber-glow hover:-translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden shadow-card"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-black bg-gradient-to-br from-amber-300 via-brand-amber to-orange-500 shadow-lg shadow-brand-amber/30 group-hover:scale-105 transition-transform duration-300">
              <Vote size={24} />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white group-hover:text-brand-amber transition-colors duration-200 font-heading">
                  Voter Maintenant
                </h3>
                <span className="bg-brand-amber text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                  Direct
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Choisir et voter pour votre créateur de contenu
              </p>
            </div>
          </div>
          <span className="text-brand-amber group-hover:translate-x-1.5 transition-all duration-300 font-extrabold text-lg">
            &rarr;
          </span>
        </Link>

        {/* Classement Option Card */}
        <Link 
          to="/classement" 
          className="group relative flex items-center justify-between p-4.5 rounded-2xl bg-white/2 border border-white/8 hover:border-brand-amber/35 hover:bg-brand-amber/5 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer overflow-hidden shadow-card"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white bg-white/8 border border-white/12 shadow-lg group-hover:scale-105 transition-transform duration-300">
              <Trophy size={22} className="text-brand-amber" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white group-hover:text-brand-amber transition-colors duration-200 font-heading">
                  Classement en Direct
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Résultats officiels en temps réel & podium
              </p>
            </div>
          </div>
          <span className="text-slate-400 group-hover:text-brand-amber group-hover:translate-x-1.5 transition-all duration-300 font-extrabold text-lg">
            &rarr;
          </span>
        </Link>

        {/* Espace Administrateur Access */}
        <div className="flex justify-center mt-3">
          <Link 
            to="/admin" 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/8 hover:border-brand-amber/30 hover:bg-brand-amber/5 text-slate-400 hover:text-brand-amber text-xs font-heading font-bold uppercase tracking-widest transition-all duration-300"
          >
            <Lock size={13} />
            <span>Espace Administrateur</span>
          </Link>
        </div>
      </main>

      {/* Footer credits */}
      <Footer />

      {/* Persistent Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-white/10 p-3 flex justify-center items-center gap-3 z-40 backdrop-blur-lg">
        <Link
          to="/vote"
          className="btn-gold py-2 px-6 text-xs sm:text-sm font-heading font-extrabold tracking-wide uppercase shadow-lg"
        >
          <Vote size={16} />
          <span>Voter (0.5$)</span>
        </Link>

        <button 
          onClick={() => setShowShareModal(true)}
          className="btn-secondary py-2 px-4 text-xs font-heading font-bold tracking-wide uppercase"
        >
          <Share2 size={15} />
          <span>Partager</span>
        </button>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />

      {/* Install App Dialog Helper Modal */}
      {showInstallHelp && (
        <div className="modal-overlay" onClick={() => setShowInstallHelp(false)}>
          <div className="success-modal relative max-w-[400px]" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowInstallHelp(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="success-icon-container">
              <Download size={30} />
            </div>
            <h3 className="text-lg font-bold text-white font-heading">Comment Installer l'Application ?</h3>
            
            <div className="text-left text-xs sm:text-sm text-slate-300 flex flex-col gap-3 w-full my-2">
              <div className="flex gap-2.5 items-start">
                <span className="bg-brand-amber text-black rounded-full w-5 h-5 flex items-center justify-center font-black text-xs shrink-0">1</span>
                <p>Appuyez sur le menu de partage de votre navigateur (ex: <strong>Partager</strong> ou <strong>Options</strong> <span className="text-slate-500">···</span>).</p>
              </div>
              <div className="flex gap-2.5 items-start">
                <span className="bg-brand-amber text-black rounded-full w-5 h-5 flex items-center justify-center font-black text-xs shrink-0">2</span>
                <p>Sélectionnez <strong>"Sur l'écran d'accueil"</strong> ou <strong>"Ajouter à l'écran d'accueil"</strong>.</p>
              </div>
              <div className="flex gap-2.5 items-start">
                <span className="bg-brand-amber text-black rounded-full w-5 h-5 flex items-center justify-center font-black text-xs shrink-0">3</span>
                <p>Accédez instantanément à la plateforme de vote K Consulting Goma d'un simple clic !</p>
              </div>
            </div>

            <button 
              onClick={() => setShowInstallHelp(false)}
              className="btn-gold mt-2 w-full"
            >
              Compris !
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
