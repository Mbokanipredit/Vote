import React, { useState, useMemo } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import type { Candidate, VoteSubmission } from '../types';
import { 
  Unlock, 
  Eye, 
  Check, 
  X, 
  Shield, 
  Database, 
  Trash2, 
  Plus, 
  Clock, 
  Users
} from 'lucide-react';

interface AdminDashboardProps {
  candidates: Candidate[];
  submissions: VoteSubmission[];
  onApproveSubmission: (id: string) => void;
  onRejectSubmission: (id: string) => void;
  onAddCandidate: (name: string, province: string, imageUrl?: string) => void;
  onDeleteCandidate: (id: string) => void;
  onUpdateCandidateVotes: (id: string, votes: number) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  candidates,
  submissions,
  onApproveSubmission,
  onRejectSubmission,
  onAddCandidate,
  onDeleteCandidate,
  onUpdateCandidateVotes,
}) => {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);

  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

  const [newCandName, setNewCandName] = useState('');
  const [newCandProv, setNewCandProv] = useState('');
  const [newCandImageUrl, setNewCandImageUrl] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '2430') {
      setIsAuthenticated(true);
      setAuthError(false);
      if (submissions.length > 0) {
        setSelectedSubmissionId(submissions[0].id);
      }
    } else {
      setAuthError(true);
      setPasscode('');
      setTimeout(() => setAuthError(false), 3000);
    }
  };

  const stats = useMemo(() => {
    const total = submissions.length;
    const pending = submissions.filter(s => s.status === 'pending').length;
    const approved = submissions.filter(s => s.status === 'approved').length;
    const rejected = submissions.filter(s => s.status === 'rejected').length;
    
    const approvedVotes = submissions
      .filter(s => s.status === 'approved')
      .reduce((acc, curr) => acc + curr.voteCount, 0);

    const totalUSD = approvedVotes * 0.5;
    const totalFC = approvedVotes * 1200;

    return { total, pending, approved, rejected, approvedVotes, totalUSD, totalFC };
  }, [submissions]);

  const selectedSubmission = useMemo(() => {
    return submissions.find(s => s.id === selectedSubmissionId) || null;
  }, [submissions, selectedSubmissionId]);

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCandName.trim() && newCandProv.trim()) {
      onAddCandidate(
        newCandName.trim(), 
        newCandProv.trim(), 
        newCandImageUrl.trim() || undefined
      );
      setNewCandName('');
      setNewCandProv('');
      setNewCandImageUrl('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="app-container">
        <Header subpageTitle="ADMIN" />
        
        <div className="max-w-[400px] w-full mx-auto my-8 animate-slide-up">
          <form onSubmit={handleAuth} className="glass-panel text-center flex flex-col gap-4 p-7 border-brand-amber/30">
            <div className="w-14 h-14 rounded-2xl bg-brand-amber/15 text-brand-amber flex items-center justify-center mx-auto border border-brand-amber/30 shadow-md">
              <Shield size={28} />
            </div>
            
            <div className="flex flex-col gap-1">
              <h3 className="text-base sm:text-lg font-black font-heading text-white uppercase">
                Accès Administrateur
              </h3>
              <p className="text-xs text-slate-400">
                Portail de validation — K Consulting Goma
              </p>
            </div>

            <div className="my-2">
              <input
                type="password"
                maxLength={6}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••"
                className="w-full text-center text-2xl tracking-[10px] font-mono py-2.5 bg-black/60 border border-white/15 rounded-xl text-white outline-none focus:border-brand-amber"
                autoFocus
              />
            </div>

            {authError && (
              <span className="text-xs text-red-400 font-medium block animate-bounce">
                ❌ Code d'accès incorrect !
              </span>
            )}

            <button type="submit" className="btn-gold w-full py-3 text-xs font-heading font-black uppercase">
              <Unlock size={15} />
              <span>Se Connecter</span>
            </button>
            
            <p className="text-[10px] text-slate-500 mt-1">
              Code de démonstration par défaut : <span className="font-mono text-brand-amber font-bold">2430</span>
            </p>
          </form>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="app-container admin-wide">
      {/* Admin Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/8 pb-4 mb-4 gap-3 animate-fade-in">
        <div className="text-left">
          <span className="text-[10px] text-brand-amber uppercase tracking-widest font-extrabold block">
            Espace de Contrôle & Validation
          </span>
          <h1 className="text-xl sm:text-2xl font-black font-heading gold-text uppercase">
            PANEL ADMIN • K CONSULTING GOMA
          </h1>
        </div>
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="self-start sm:self-auto px-4 py-2 border border-red-500/30 hover:border-red-500 rounded-xl text-red-400 hover:bg-red-500/10 text-xs font-bold transition-all"
        >
          Déconnexion
        </button>
      </header>

      {/* Stats Summary cards */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full animate-slide-up">
        {/* Total SMS submissions */}
        <div className="glass-panel p-4 flex flex-col gap-1 items-center text-center border-white/8">
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">SMS Reçus</span>
          <span className="text-xl sm:text-2xl font-black text-white font-heading">{stats.total}</span>
          <span className="text-[9px] text-slate-400">
            {stats.pending} en attente • {stats.approved} validés
          </span>
        </div>
        {/* Approved votes counts */}
        <div className="glass-panel p-4 flex flex-col gap-1 items-center text-center border-white/8">
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Votes Validés</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400 font-heading">+{stats.approvedVotes}</span>
          <span className="text-[9px] text-slate-400">Voix confirmées</span>
        </div>
        {/* Estimated USD funds */}
        <div className="glass-panel p-4 flex flex-col gap-1 items-center text-center border-brand-amber/20">
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Fonds Validés (USD)</span>
          <span className="text-xl sm:text-2xl font-black text-brand-amber font-heading">${stats.totalUSD.toLocaleString()}</span>
          <span className="text-[9px] text-slate-400">0.5$ / vote</span>
        </div>
        {/* Estimated Congolese Franc funds */}
        <div className="glass-panel p-4 flex flex-col gap-1 items-center text-center border-brand-amber/20">
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Fonds Validés (FC)</span>
          <span className="text-xl sm:text-2xl font-black text-brand-amber font-heading">{stats.totalFC.toLocaleString()} FC</span>
          <span className="text-[9px] text-slate-400">1 200 FC / vote</span>
        </div>
      </section>

      {/* Submissions verification grid */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-5 w-full mt-4 animate-slide-up">
        
        {/* Left Column: Submissions checklist list */}
        <div className="glass-panel md:col-span-6 flex flex-col gap-3 p-4 sm:p-5 border-white/8">
          <div className="flex items-center justify-between border-b border-white/8 pb-2">
            <h3 className="text-xs sm:text-sm font-heading font-black text-brand-amber tracking-wider uppercase flex items-center gap-2">
              <Clock size={16} /> Preuves de Paiement Reçues
            </h3>
            <span className="text-[10px] text-slate-400 font-mono font-bold">
              {submissions.length} total
            </span>
          </div>
          
          <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1 pricing-rows">
            {submissions.length > 0 ? (
              [...submissions].reverse().map(sub => {
                const isActive = selectedSubmissionId === sub.id;
                const date = new Date(sub.timestamp).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubmissionId(sub.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200
                      ${isActive 
                        ? 'bg-brand-amber/10 border-brand-amber shadow-sm' 
                        : 'bg-black/40 border-white/6 hover:border-white/15'
                      }
                    `}
                  >
                    <div className="text-left flex flex-col gap-0.5 min-w-0 pr-2">
                      <span className="text-xs font-bold text-white uppercase truncate">
                        {sub.voterName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {sub.voterPhone} • {sub.operator} • {date}
                      </span>
                      <span className="text-[10px] text-brand-amber font-heading font-bold truncate mt-0.5">
                        Cible: {sub.candidateName}
                      </span>
                    </div>

                    <div className="text-right flex flex-col items-end gap-1 shrink-0">
                      <span className="text-xs font-black text-white font-heading">
                        +{sub.voteCount} Voix
                      </span>
                      
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full
                        ${sub.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : ''}
                        ${sub.status === 'pending' ? 'bg-amber-500/20 text-brand-amber border border-amber-500/40' : ''}
                        ${sub.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : ''}
                      `}>
                        {sub.status === 'pending' && 'En attente'}
                        {sub.status === 'approved' && 'Validé'}
                        {sub.status === 'rejected' && 'Rejeté'}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 text-slate-500">
                <Database size={24} className="mx-auto opacity-40 mb-2 text-brand-amber" />
                <p className="text-xs">Aucune preuve de paiement soumise pour l'instant.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Screenshot details verification and controls */}
        <div className="glass-panel md:col-span-6 flex flex-col gap-3 p-4 sm:p-5 border-white/8">
          <h3 className="text-xs sm:text-sm font-heading font-black text-brand-amber tracking-wider uppercase border-b border-white/8 pb-2">
            🔍 Détails & Validation de la Preuve
          </h3>

          {selectedSubmission ? (
            <div className="flex flex-col gap-4 text-left">
              
              {/* Image capture display */}
              <div className="border border-brand-amber/20 rounded-xl overflow-hidden bg-black p-2 flex justify-center max-h-[220px]">
                <img 
                  src={selectedSubmission.screenshotUrl} 
                  alt="SMS receipt"
                  className="max-h-[200px] object-contain rounded"
                />
              </div>

              {/* Data list details */}
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-xs bg-black/40 p-3 rounded-xl border border-white/6 font-sans">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Nom Votant</span>
                  <span className="font-bold text-white">{selectedSubmission.voterName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Numéro Payeur</span>
                  <span className="font-bold text-white font-mono">{selectedSubmission.voterPhone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Opérateur</span>
                  <span className="font-bold text-brand-amber">{selectedSubmission.operator}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Candidat Cible</span>
                  <span className="font-bold text-white uppercase">{selectedSubmission.candidateName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Nombre de Voix</span>
                  <span className="font-black text-brand-amber font-heading">+{selectedSubmission.voteCount} Voix</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Date & Heure</span>
                  <span className="font-mono text-slate-300 text-[11px]">
                    {new Date(selectedSubmission.timestamp).toLocaleString('fr-FR')}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {selectedSubmission.status === 'pending' ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => onApproveSubmission(selectedSubmission.id)}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold rounded-xl font-heading flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md text-xs sm:text-sm uppercase"
                  >
                    <Check size={16} />
                    <span>Valider (+{selectedSubmission.voteCount} voix)</span>
                  </button>
                  
                  <button
                    onClick={() => onRejectSubmission(selectedSubmission.id)}
                    className="flex-1 py-3 border border-red-500/30 hover:border-red-500 text-red-400 hover:bg-red-500/10 rounded-xl font-extrabold font-heading flex items-center justify-center gap-2 cursor-pointer transition-all text-xs sm:text-sm uppercase"
                  >
                    <X size={16} />
                    <span>Rejeter</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 text-center rounded-xl bg-white/3 border border-white/5 text-xs text-slate-400">
                  Statut de la preuve :{' '}
                  <strong className={`uppercase ${selectedSubmission.status === 'approved' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {selectedSubmission.status === 'approved' ? '✓ Validée avec succès' : '✗ Rejetée'}
                  </strong>
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-16 text-slate-500">
              <Eye size={24} className="mx-auto opacity-40 mb-2 text-brand-amber" />
              <p className="text-xs">Sélectionnez une soumission dans la liste pour l'analyser.</p>
            </div>
          )}
        </div>

      </section>

      {/* Editor list: Manage Candidates */}
      <section className="glass-panel w-full mt-5 p-4 sm:p-5 animate-slide-up text-left border-white/8">
        <h3 className="text-xs sm:text-sm font-heading font-black text-brand-amber tracking-wider uppercase border-b border-white/8 pb-2 mb-4 flex items-center gap-2">
          <Users size={16} /> GESTION DES CANDIDATS & CRÉATEURS
        </h3>

        {/* Add Candidate Form */}
        <form onSubmit={handleAddCandidate} className="flex flex-col sm:flex-row gap-3 items-end mb-5 bg-black/40 p-4 rounded-xl border border-white/6 w-full">
          <div className="flex-1 w-full">
            <label className="text-[10px] tracking-wider uppercase font-bold text-slate-400 mb-1 block">Nom du Créateur / Influenceur</label>
            <input
              type="text"
              required
              placeholder="Ex: GRACE LA STAR"
              value={newCandName}
              onChange={(e) => setNewCandName(e.target.value)}
              className="py-2.5 w-full bg-black/60 border border-white/10 rounded-xl px-3 text-white text-xs sm:text-sm outline-none focus:border-brand-amber"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="text-[10px] tracking-wider uppercase font-bold text-slate-400 mb-1 block">Catégorie / Ville</label>
            <input
              type="text"
              required
              placeholder="Ex: GOMA • COMÉDIE"
              value={newCandProv}
              onChange={(e) => setNewCandProv(e.target.value)}
              className="py-2.5 w-full bg-black/60 border border-white/10 rounded-xl px-3 text-white text-xs sm:text-sm outline-none focus:border-brand-amber"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="text-[10px] tracking-wider uppercase font-bold text-slate-400 mb-1 block">Image URL (Optionnel)</label>
            <input
              type="url"
              placeholder="Ex: https://images.unsplash.com/..."
              value={newCandImageUrl}
              onChange={(e) => setNewCandImageUrl(e.target.value)}
              className="py-2.5 w-full bg-black/60 border border-white/10 rounded-xl px-3 text-white text-xs sm:text-sm outline-none focus:border-brand-amber"
            />
          </div>
          <button 
            type="submit"
            className="btn-gold py-2.5 px-5 text-xs font-heading font-black shrink-0 cursor-pointer h-[42px] uppercase w-full sm:w-auto"
          >
            <Plus size={15} />
            <span>Ajouter</span>
          </button>
        </form>

        {/* Candidate List Table */}
        <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1 pricing-rows">
          {candidates.map(candidate => (
            <div 
              key={candidate.id}
              className="flex items-center justify-between p-3 bg-black/30 border border-white/6 rounded-xl hover:border-white/15 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-white font-black overflow-hidden shrink-0 relative bg-black border border-brand-amber/30"
                >
                  {candidate.imageUrl && (
                    <img 
                      src={candidate.imageUrl} 
                      alt={candidate.name} 
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <span className="relative z-0">{candidate.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}</span>
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-extrabold uppercase font-heading text-white">{candidate.name}</h5>
                  <span className="text-[10px] text-brand-amber uppercase tracking-wider font-semibold">{candidate.province}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Votes :</span>
                  <input
                    type="number"
                    value={candidate.votes}
                    onChange={(e) => onUpdateCandidateVotes(candidate.id, parseInt(e.target.value) || 0)}
                    className="w-20 bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-xs text-brand-amber text-center font-bold outline-none focus:border-brand-amber font-mono"
                  />
                </div>

                <button
                  onClick={() => onDeleteCandidate(candidate.id)}
                  className="p-2 border border-red-500/20 hover:border-red-500 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                  title="Supprimer candidat"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};
