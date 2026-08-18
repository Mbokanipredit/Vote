import React, { useState } from 'react';
import { X, Copy, Check, Share2, Send } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  candidateName?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title = "Mobilisez vos proches sur les réseaux sociaux !",
  candidateName,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareText = candidateName
    ? `🗳️ Je viens de voter pour ${candidateName} sur la plateforme officielle de K Consulting à Goma ! Soutenez vos créateurs favoris ici : ${currentUrl}`
    : `🗳️ Rejoignez-moi sur la plateforme officielle de vote de K Consulting à Goma pour soutenir et élire vos influenceurs et créateurs de contenu préférés ! ${currentUrl}`;

  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(currentUrl);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'K Consulting Goma — Vote Officiel',
          text: shareText,
          url: currentUrl,
        });
      } catch {
        // User cancelled or failed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="success-modal relative max-w-[460px] p-6 text-left" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/5"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-brand-amber/15 text-brand-amber flex items-center justify-center border border-brand-amber/30">
            <Share2 size={20} />
          </div>
          <div>
            <span className="text-[10px] font-extrabold tracking-widest text-brand-amber uppercase font-sans">
              Partage Officiel • K Consulting
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white font-heading">
              Partager & Mobiliser
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {title}
        </p>

        {/* Share Channels */}
        <div className="grid grid-cols-2 gap-2.5 w-full mb-4">
          {/* WhatsApp */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodedText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 hover:border-[#25D366] hover:bg-[#25D366]/20 transition-all text-white text-xs font-bold"
          >
            <span className="text-lg">💬</span>
            <span>WhatsApp</span>
          </a>

          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#1877F2]/10 border border-[#1877F2]/30 hover:border-[#1877F2] hover:bg-[#1877F2]/20 transition-all text-white text-xs font-bold"
          >
            <span className="text-lg">📘</span>
            <span>Facebook</span>
          </a>

          {/* Twitter / X */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodedText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/15 hover:border-brand-amber/50 hover:bg-brand-amber/10 transition-all text-white text-xs font-bold"
          >
            <span className="text-lg">𝕏</span>
            <span>Twitter / X</span>
          </a>

          {/* Telegram */}
          <a
            href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0088cc]/10 border border-[#0088cc]/30 hover:border-[#0088cc] hover:bg-[#0088cc]/20 transition-all text-white text-xs font-bold"
          >
            <Send size={16} className="text-[#0088cc]" />
            <span>Telegram</span>
          </a>
        </div>

        {/* Copy Link Input Section */}
        <div className="flex items-center gap-2 w-full p-2 bg-black/50 border border-white/10 rounded-xl mb-4">
          <input
            type="text"
            readOnly
            value={currentUrl}
            className="bg-transparent text-xs text-slate-300 px-2 flex-1 outline-none font-mono"
          />
          <button
            onClick={handleCopy}
            className="btn-gold py-1.5 px-3 text-xs shrink-0"
          >
            {copied ? (
              <>
                <Check size={14} className="text-black" />
                <span>Copié !</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copier</span>
              </>
            )}
          </button>
        </div>

        {/* Native Share button (on mobile devices) */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={handleNativeShare}
            className="btn-secondary w-full py-2.5 text-xs text-center justify-center font-bold"
          >
            <Share2 size={15} />
            <span>Partager via d'autres applications</span>
          </button>
        )}
      </div>
    </div>
  );
};
