import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { ShareModal } from '../components/ShareModal';
import { TikTokIcon, InstagramIcon, YouTubeIcon } from '../components/SocialIcons';
import type { Candidate } from '../types';
import { 
  Heart, 
  Search, 
  Share2, 
  Vote, 
  Sparkles, 
  Check, 
  TrendingUp, 
  Users
} from 'lucide-react';

interface ExploreProps {
  candidates: Candidate[];
  onLikeCandidate: (candidateId: string) => void;
}

export const Explore: React.FC<ExploreProps> = ({ candidates, onLikeCandidate }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCandidateName, setShareCandidateName] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Read liked candidates from localStorage
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('kconsulting_user_likes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const categories = useMemo(() => {
    const set = new Set<string>();
    candidates.forEach(c => {
      const parts = c.province.split('•');
      if (parts.length > 1) {
        set.add(parts[1].trim());
      } else {
        set.add(c.province);
      }
    });
    return ['Tous', ...Array.from(set)];
  }, [candidates]);

  const handleLike = (candidate: Candidate) => {
    const isLiked = !!likedMap[candidate.id];
    const newLikedMap = { ...likedMap, [candidate.id]: !isLiked };
    setLikedMap(newLikedMap);
    localStorage.setItem('kconsulting_user_likes', JSON.stringify(newLikedMap));

    onLikeCandidate(candidate.id);

    if (!isLiked) {
      showToast(`❤️ Vous avez aimé le profil de ${candidate.name} !`);
    } else {
      showToast(`Mention J'aime retirée pour ${candidate.name}`);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleVoteForCandidate = (candidateId: string) => {
    navigate(`/vote?candidateId=${candidateId}`);
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (candidate.bio && candidate.bio.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = 
      selectedCategory === 'Tous' || 
      candidate.province.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const totalLikes = candidates.reduce((acc, curr) => acc + (curr.likes || 0), 0);

  return (
    <div className="w-full max-w-[1080px] mx-auto px-4 sm:px-6 py-4 mb-24 flex flex-col gap-6 animate-fade-in">
      {/* Page Header */}
      <Header subpageTitle="EXPLOREZ" />

      {/* Hero Banner Section */}
      <section className="glass-panel p-5 sm:p-7 text-left relative overflow-hidden border-brand-amber/25">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-amber/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-amber/10 border border-brand-amber/30 text-brand-amber text-[10px] font-extrabold uppercase tracking-widest mb-3">
          <Sparkles size={13} />
          <span>Talents & Créateurs Officiels • Goma</span>
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white font-heading tracking-tight">
          PROFILS DES ARTISTES & INFLUENCEURS
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-[650px] leading-relaxed mt-1.5 font-normal">
          Découvrez les profils des candidats en lice à Goma, accédez à leurs réseaux sociaux officiels (TikTok, Instagram, YouTube), envoyez-leur des cœurs ❤️ et votez pour les propulser au sommet !
        </p>

        {/* Quick Stats bar */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/8 text-xs">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-brand-amber" />
            <span className="text-slate-300 font-bold">
              <strong className="text-white">{candidates.length}</strong> Créateurs
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-red-500 fill-red-500" />
            <span className="text-slate-300 font-bold">
              <strong className="text-white">{totalLikes.toLocaleString('fr-FR')}</strong> Cœurs enregistrés
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-400" />
            <span className="text-slate-300 font-bold">Vote 100% sécurisé</span>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 pricing-rows">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-heading whitespace-nowrap transition-all cursor-pointer border
                ${selectedCategory === cat
                  ? 'bg-brand-amber text-black border-brand-amber font-extrabold shadow-sm'
                  : 'bg-black/50 text-slate-300 border-white/10 hover:border-white/25 hover:text-white'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un artiste..."
            className="w-full bg-black/60 border border-white/12 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-brand-amber"
          />
        </div>
      </section>

      {/* Artist Profiles Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
        {filteredCandidates.map((candidate) => {
          const isLiked = !!likedMap[candidate.id];
          const likesCount = (candidate.likes || 0) + (isLiked ? 1 : 0);
          const initials = candidate.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

          const tiktokHandle = candidate.socials?.tiktok || `@${candidate.name.toLowerCase().replace(/\s+/g, '')}`;
          const instaHandle = candidate.socials?.instagram || `@${candidate.name.toLowerCase().replace(/\s+/g, '_')}`;
          const youtubeHandle = candidate.socials?.youtube || `${candidate.name} Official`;

          return (
            <div
              key={candidate.id}
              className="glass-panel p-4 sm:p-5 flex flex-col justify-between border-white/8 hover:border-brand-amber/35 transition-all duration-300 shadow-card relative overflow-hidden group"
            >
              {/* Top Section: Photo with Floating Heart / Love button & Category */}
              <div>
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-black mb-4 border border-white/10">
                  {candidate.imageUrl ? (
                    <img 
                      src={candidate.imageUrl} 
                      alt={candidate.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}

                  <div 
                    className="w-full h-full items-center justify-center font-heading font-black text-4xl text-white select-none"
                    style={{ 
                      background: candidate.colorGradient || '#0b0d14',
                      display: candidate.imageUrl ? 'none' : 'flex'
                    }}
                  >
                    {initials}
                  </div>

                  {/* Category badge over image */}
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-brand-amber border border-brand-amber/30 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg tracking-wider">
                    {candidate.province}
                  </div>

                  {/* IN-APP LOVE / HEART RECORD BUTTON */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(candidate);
                    }}
                    className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md font-bold text-xs transition-all duration-200 cursor-pointer shadow-lg active:scale-90
                      ${isLiked 
                        ? 'bg-red-600/90 text-white border border-red-400 shadow-red-500/30' 
                        : 'bg-black/75 text-slate-200 hover:text-white border border-white/20 hover:border-red-400/60'
                      }
                    `}
                    title="Aimer ce profil d'artiste"
                  >
                    <Heart 
                      size={15} 
                      className={`transition-transform duration-200 ${isLiked ? 'fill-white scale-110 text-white' : 'text-red-400 hover:scale-110'}`} 
                    />
                    <span className="font-mono text-xs font-bold">
                      {likesCount.toLocaleString('fr-FR')}
                    </span>
                  </button>

                  {/* Official Votes Count badge bottom right */}
                  <div className="absolute bottom-3 right-3 bg-black/85 backdrop-blur-md text-white border border-white/15 text-[11px] font-bold px-2.5 py-1 rounded-lg font-heading">
                    <span className="text-brand-amber font-extrabold">{candidate.votes.toLocaleString('fr-FR')}</span> votes
                  </div>
                </div>

                {/* Name Below Photo */}
                <div className="text-left mb-2">
                  <h3 className="text-base sm:text-lg font-black text-white font-heading uppercase tracking-wide group-hover:text-brand-amber transition-colors">
                    {candidate.name}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1 font-sans">
                    {candidate.bio || `Créateur de contenu dynamique à Goma, inspirant la jeunesse et valorisant les talents de notre communauté.`}
                  </p>
                </div>

                {/* SOCIAL MEDIA ACCESS SECTION (TikTok, Instagram, YouTube) */}
                <div className="my-3.5 p-2.5 rounded-xl bg-black/50 border border-white/8 text-left">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
                    Plateformes & Réseaux Sociaux :
                  </span>

                  <div className="grid grid-cols-3 gap-2">
                    {/* TikTok */}
                    <a
                      href={`https://tiktok.com/@${tiktokHandle.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white/4 hover:bg-white/10 border border-white/10 hover:border-white/30 text-white text-[11px] font-bold transition-all group/soc"
                      title={`Visiter TikTok : ${tiktokHandle}`}
                    >
                      <TikTokIcon size={14} className="text-white group-hover/soc:text-brand-amber transition-colors" />
                      <span className="truncate">TikTok</span>
                    </a>

                    {/* Instagram */}
                    <a
                      href={`https://instagram.com/${instaHandle.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white/4 hover:bg-pink-600/15 border border-white/10 hover:border-pink-500/40 text-white text-[11px] font-bold transition-all group/soc"
                      title={`Visiter Instagram : ${instaHandle}`}
                    >
                      <InstagramIcon size={14} className="text-pink-400 group-hover/soc:scale-110 transition-transform" />
                      <span className="truncate">Instagram</span>
                    </a>

                    {/* YouTube */}
                    <a
                      href={`https://youtube.com/results?search_query=${encodeURIComponent(youtubeHandle)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white/4 hover:bg-red-600/15 border border-white/10 hover:border-red-500/40 text-white text-[11px] font-bold transition-all group/soc"
                      title={`Visiter YouTube : ${youtubeHandle}`}
                    >
                      <YouTubeIcon size={14} className="text-red-500 group-hover/soc:scale-110 transition-transform" />
                      <span className="truncate">YouTube</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Vote Direct & Share */}
              <div className="flex items-center gap-2.5 mt-2 pt-3 border-t border-white/8">
                <button
                  type="button"
                  onClick={() => handleVoteForCandidate(candidate.id)}
                  className="btn-gold flex-1 py-2.5 px-4 text-xs font-heading font-black tracking-wider uppercase shadow-md flex items-center justify-center gap-1.5"
                >
                  <Vote size={15} />
                  <span>Voter pour {candidate.name.split(' ')[0]}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShareCandidateName(candidate.name);
                    setShowShareModal(true);
                  }}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-brand-amber/15 border border-white/10 hover:border-brand-amber/30 text-slate-300 hover:text-brand-amber transition-colors"
                  title="Partager ce profil d'artiste"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          );
        })}

        {filteredCandidates.length === 0 && (
          <div className="col-span-full glass-panel p-10 text-center text-slate-400 text-xs border-white/8">
            Aucun profil d'artiste trouvé pour votre recherche.
          </div>
        )}
      </section>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => {
          setShowShareModal(false);
          setShareCandidateName(undefined);
        }}
        candidateName={shareCandidateName}
      />

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black/95 text-white px-4 py-2.5 rounded-full border border-brand-amber shadow-2xl text-xs font-bold font-sans animate-fade-in flex items-center gap-2">
          <Check size={14} className="text-brand-amber" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
