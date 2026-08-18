import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '../components/Header';
import { ShareModal } from '../components/ShareModal';
import type { Candidate } from '../types';
import { 
  RefreshCw, 
  Trophy, 
  Crown, 
  Search, 
  Share2, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface LiveRankingProps {
  candidates: Candidate[];
  onRefresh?: () => void;
}

export const LiveRanking: React.FC<LiveRankingProps> = ({ candidates, onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [countdown, setCountdown] = useState(60);
  const [searchQuery, setSearchQuery] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCandidate, setShareCandidate] = useState<string | undefined>(undefined);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleAutoRefresh();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAutoRefresh = () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdateTime(new Date());
    }, 800);
  };

  const handleManualRefresh = () => {
    handleAutoRefresh();
    setCountdown(60);
  };

  const sortedCandidates = useMemo(() => {
    return [...candidates].sort((a, b) => b.votes - a.votes);
  }, [candidates]);

  const totalVotes = useMemo(() => {
    return candidates.reduce((acc, curr) => acc + curr.votes, 0);
  }, [candidates]);

  const formatNum = (num: number) => {
    return num.toLocaleString('fr-FR');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const firstPlace = sortedCandidates[0] || null;
  const secondPlace = sortedCandidates[1] || null;
  const thirdPlace = sortedCandidates[2] || null;

  const filteredRanking = sortedCandidates.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.province.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-[1080px] mx-auto px-4 sm:px-6 py-4 mb-24 flex flex-col gap-5 animate-fade-in">
      {/* Subpage Header with Title */}
      <Header subpageTitle="CLASSEMENT LIVE" />

      {/* Live Ticker Banner */}
      <div className="w-full flex items-center bg-black/80 border border-brand-amber/30 rounded-xl overflow-hidden text-xs py-2 px-3.5 gap-3 animate-fade-in shadow-md">
        <div className="flex items-center gap-1.5 shrink-0 select-none bg-brand-amber/20 px-2 py-0.5 rounded-full border border-brand-amber/40">
          <span className="w-2 h-2 bg-brand-amber rounded-full animate-pulse inline-block" />
          <span className="font-extrabold text-brand-amber tracking-wider uppercase font-heading text-[10px]">LIVE DIRECT</span>
        </div>
        
        {/* Horizontal Ticker */}
        <div className="flex-1 overflow-hidden relative">
          {React.createElement('marquee', {
            className: "text-slate-200 font-medium whitespace-nowrap text-xs",
            scrollamount: "4"
          }, `🏆 EN TÊTE : ${firstPlace ? `${firstPlace.name.toUpperCase()} avec ${formatNum(firstPlace.votes)} voix` : '—'} • 🗳️ K Consulting à Goma — Plateforme Officielle de Vote des Influenceurs & Créateurs de Contenu • ⚡ Résultats certifiés en temps réel`)}
        </div>
      </div>

      {/* Statistics dashboard */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 animate-slide-up">
        {/* Total Votes */}
        <div className="glass-panel p-4 text-center flex flex-col items-center justify-center gap-1 border-brand-amber/15">
          <span className="text-xl sm:text-2xl font-black text-brand-amber font-heading">{formatNum(totalVotes)}</span>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total Voix</span>
        </div>
        {/* Candidates Count */}
        <div className="glass-panel p-4 text-center flex flex-col items-center justify-center gap-1 border-white/8">
          <span className="text-xl sm:text-2xl font-black text-white font-heading">{candidates.length}</span>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Candidats</span>
        </div>
        {/* Leader Margin */}
        <div className="glass-panel p-4 text-center flex flex-col items-center justify-center gap-1 border-white/8">
          <span className="text-xl sm:text-2xl font-black text-emerald-400 font-heading">
            {firstPlace && secondPlace ? `+${formatNum(firstPlace.votes - secondPlace.votes)}` : '—'}
          </span>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Écart 1er/2e</span>
        </div>
        {/* Auto-Refresh Timer */}
        <div 
          onClick={handleManualRefresh}
          className="glass-panel p-4 text-center flex flex-col items-center justify-center gap-1 border-brand-amber/20 hover:border-brand-amber/50 cursor-pointer group transition-all"
        >
          <span className="text-xl sm:text-2xl font-black text-brand-amber font-heading flex items-center gap-1.5 justify-center">
            {countdown}s
            <RefreshCw size={15} className={`text-slate-400 group-hover:text-brand-amber transition-transform ${isRefreshing ? 'animate-spin' : ''}`} />
          </span>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest group-hover:text-brand-amber">Actualiser</span>
        </div>
      </section>

      {/* Podium Top 3 Section */}
      <section className="w-full text-left animate-slide-up mt-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs sm:text-sm font-heading font-black text-brand-amber tracking-wider uppercase flex items-center gap-2">
            <Trophy size={16} /> PODIUM DES TALENTS • TOP 3
          </h3>
          <span className="text-[10px] text-slate-400 font-bold uppercase">K Consulting Goma</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 items-end">
          
          {/* Rank 2 (Left) */}
          <div className="flex flex-col rounded-2xl bg-black/60 border border-white/10 overflow-hidden shadow-lg transition-all hover:scale-[1.02] duration-300">
            <div className="relative bg-gradient-to-b from-slate-700/40 to-black p-4 text-center flex flex-col items-center justify-center border-b border-white/8 min-h-[110px] sm:min-h-[140px]">
              <span className="text-xl sm:text-2xl mb-1">🥈</span>
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-slate-300 shadow-md bg-black relative">
                {secondPlace?.imageUrl ? (
                  <img src={secondPlace.imageUrl} alt={secondPlace.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-extrabold text-sm sm:text-lg">
                    {secondPlace ? getInitials(secondPlace.name) : '—'}
                  </div>
                )}
              </div>
            </div>
            <div className="p-2.5 sm:p-3.5 text-center flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase">2e Position</span>
              <h4 className="text-xs sm:text-sm font-extrabold text-white uppercase truncate font-heading">
                {secondPlace ? secondPlace.name : '—'}
              </h4>
              <span className="text-xs sm:text-sm font-black text-brand-amber font-heading">
                {secondPlace ? formatNum(secondPlace.votes) : '0'} voix
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {secondPlace && totalVotes > 0 ? ((secondPlace.votes / totalVotes) * 100).toFixed(1) : '0.0'}%
              </span>
            </div>
          </div>

          {/* Rank 1 (Center Tall) */}
          <div className="flex flex-col rounded-2xl bg-black/80 border-2 border-brand-amber overflow-hidden shadow-2xl shadow-brand-amber/15 transition-all hover:scale-[1.03] duration-300 relative">
            {/* Crown Header */}
            <div className="absolute top-2 right-2 bg-brand-amber text-black font-black text-[9px] px-2 py-0.5 rounded-full tracking-wider uppercase font-heading z-10 shadow-sm">
              LEADER
            </div>
            <div className="relative bg-gradient-to-b from-brand-amber/20 via-black to-black p-5 text-center flex flex-col items-center justify-center border-b border-brand-amber/30 min-h-[140px] sm:min-h-[170px]">
              <Crown size={26} className="text-brand-amber mb-1 animate-bounce" />
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-brand-amber shadow-amber-glow bg-black relative">
                {firstPlace?.imageUrl ? (
                  <img src={firstPlace.imageUrl} alt={firstPlace.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-amber font-extrabold text-base sm:text-2xl">
                    {firstPlace ? getInitials(firstPlace.name) : '—'}
                  </div>
                )}
              </div>
            </div>
            <div className="p-3 sm:p-4 text-center flex flex-col gap-1 bg-brand-amber/5">
              <span className="text-[10px] text-brand-amber font-extrabold uppercase tracking-wider">🏆 1ère Place</span>
              <h4 className="text-xs sm:text-base font-black text-white uppercase truncate font-heading">
                {firstPlace ? firstPlace.name : '—'}
              </h4>
              <span className="text-sm sm:text-base font-black text-brand-amber font-heading">
                {firstPlace ? formatNum(firstPlace.votes) : '0'} voix
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">
                {firstPlace && totalVotes > 0 ? ((firstPlace.votes / totalVotes) * 100).toFixed(1) : '0.0'}% des voix
              </span>
            </div>
          </div>

          {/* Rank 3 (Right) */}
          <div className="flex flex-col rounded-2xl bg-black/60 border border-white/10 overflow-hidden shadow-lg transition-all hover:scale-[1.02] duration-300">
            <div className="relative bg-gradient-to-b from-amber-900/30 to-black p-4 text-center flex flex-col items-center justify-center border-b border-white/8 min-h-[110px] sm:min-h-[140px]">
              <span className="text-xl sm:text-2xl mb-1">🥉</span>
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-amber-700 shadow-md bg-black relative">
                {thirdPlace?.imageUrl ? (
                  <img src={thirdPlace.imageUrl} alt={thirdPlace.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-extrabold text-sm sm:text-lg">
                    {thirdPlace ? getInitials(thirdPlace.name) : '—'}
                  </div>
                )}
              </div>
            </div>
            <div className="p-2.5 sm:p-3.5 text-center flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase">3e Position</span>
              <h4 className="text-xs sm:text-sm font-extrabold text-white uppercase truncate font-heading">
                {thirdPlace ? thirdPlace.name : '—'}
              </h4>
              <span className="text-xs sm:text-sm font-black text-brand-amber font-heading">
                {thirdPlace ? formatNum(thirdPlace.votes) : '0'} voix
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {thirdPlace && totalVotes > 0 ? ((thirdPlace.votes / totalVotes) * 100).toFixed(1) : '0.0'}%
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Complete classement list */}
      <section className="w-full text-left animate-slide-up mt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <h3 className="text-xs sm:text-sm font-heading font-black text-brand-amber tracking-wider uppercase flex items-center gap-2">
            <span>📊</span> CLASSEMENT COMPLET DES CANDIDATS
          </h3>

          {/* Search bar */}
          <div className="relative min-w-[220px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Chercher un candidat..."
              className="w-full bg-black/50 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-brand-amber"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {filteredRanking.map((candidate, index) => {
            const rank = index + 1;
            const percentage = totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0;
            const initials = getInitials(candidate.name);

            // Winner score for progress offset
            const winnerScore = firstPlace && firstPlace.votes > 0 ? firstPlace.votes : 1;
            const relativeWidth = (candidate.votes / winnerScore) * 100;

            return (
              <div 
                key={candidate.id}
                className="flex items-center justify-between p-3 sm:p-3.5 bg-black/40 border border-white/6 hover:border-brand-amber/30 rounded-xl relative overflow-hidden transition-all duration-200"
              >
                {/* Left side details */}
                <div className="flex items-center gap-3 flex-1 text-left relative z-10 min-w-0 pr-2">
                  {/* Rank Badge */}
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-heading font-black text-xs shrink-0
                    ${rank === 1 ? 'bg-brand-amber text-black' : rank === 2 ? 'bg-slate-300 text-black' : rank === 3 ? 'bg-amber-700 text-white' : 'bg-white/5 text-slate-400'}
                  `}>
                    #{rank}
                  </span>

                  {/* Avatar circle */}
                  <div 
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-extrabold text-xs border border-white/10 select-none overflow-hidden shrink-0 relative bg-black"
                  >
                    {candidate.imageUrl ? (
                      <img 
                        src={candidate.imageUrl} 
                        alt={candidate.name} 
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : null}
                    <span className="relative z-0">{initials}</span>
                  </div>

                  {/* Name and Province */}
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wide truncate font-heading">
                      {candidate.name}
                    </span>
                    <span className="text-[10px] text-brand-amber tracking-wider font-semibold">
                      {candidate.province}
                    </span>
                  </div>
                </div>

                {/* Progress bar line at the bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white/2">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-600 via-brand-amber to-amber-300 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${Math.max(relativeWidth, 2)}%` }}
                  />
                </div>

                {/* Right side metrics and Quick Action */}
                <div className="flex items-center gap-3 relative z-10 shrink-0">
                  <div className="text-right flex flex-col">
                    <span className="text-xs sm:text-sm font-black text-brand-amber font-heading">
                      {formatNum(candidate.votes)} voix
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>

                  <Link
                    to="/vote"
                    className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg btn-gold text-[11px] font-heading font-extrabold uppercase shadow-sm"
                  >
                    <span>Voter</span>
                    <ArrowUpRight size={13} />
                  </Link>

                  <button
                    onClick={() => {
                      setShareCandidate(candidate.name);
                      setShowShareModal(true);
                    }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-brand-amber/15 text-slate-400 hover:text-brand-amber transition-colors"
                    title="Partager pour ce candidat"
                  >
                    <Share2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredRanking.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs bg-black/30 rounded-xl border border-white/5">
              Aucun candidat trouvé pour "{searchQuery}".
            </div>
          )}
        </div>
      </section>

      {/* Official Time Footer bar */}
      <footer className="w-full flex flex-col sm:flex-row items-center justify-between border-t border-white/8 mt-6 pt-4 text-[10px] text-slate-400 font-medium select-none animate-fade-in uppercase tracking-wider font-mono gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-brand-amber" />
          <span>K Consulting Goma • Horodatage certifié : {currentTime.toLocaleTimeString('fr-FR')}</span>
        </div>
        <div>
          <span>Dernière synchronisation : {lastUpdateTime.toLocaleTimeString('fr-FR')}</span>
        </div>
      </footer>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => {
          setShowShareModal(false);
          setShareCandidate(undefined);
        }}
        candidateName={shareCandidate}
      />
    </div>
  );
};
