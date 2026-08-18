import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { ShareModal } from '../components/ShareModal';
import type { Candidate, ConversionRate, VoteSubmission } from '../types';
import { 
  Copy, 
  Check, 
  ArrowLeft, 
  Camera, 
  CheckCircle, 
  Info, 
  X, 
  ChevronRight, 
  Search, 
  Share2
} from 'lucide-react';

interface VoteProps {
  candidates: Candidate[];
  onSubmitVote: (submission: VoteSubmission) => void;
}

const CONVERSION_RATES: ConversionRate[] = [
  { usd: 0.5, votes: 1, fc: 1200 },
  { usd: 1, votes: 2, fc: 2400 },
  { usd: 5, votes: 10, fc: 12000 },
  { usd: 10, votes: 20, fc: 24000 },
  { usd: 20, votes: 40, fc: 48000 },
  { usd: 50, votes: 100, fc: 120000 },
  { usd: 100, votes: 200, fc: 240000 },
  { usd: 200, votes: 400, fc: 480000 },
  { usd: 1000, votes: 2000, fc: 2400000 },
];

export const Vote: React.FC<VoteProps> = ({ candidates, onSubmitVote }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRate, setSelectedRate] = useState<ConversionRate>(CONVERSION_RATES[0]);
  const [copiedOperator, setCopiedOperator] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Pre-select candidate from URL query param if present
  useEffect(() => {
    const candidateId = searchParams.get('candidateId');
    if (candidateId) {
      const found = candidates.find(c => c.id === candidateId);
      if (found) {
        setSelectedCandidate(found);
      }
    }
  }, [searchParams, candidates]);

  const [voterName, setVoterName] = useState('');
  const [voterPhone, setVoterPhone] = useState('');
  const [screenshotBase64, setScreenshotBase64] = useState<string>('');
  const [screenshotName, setScreenshotName] = useState('');
  const [operatorSelected, setOperatorSelected] = useState('Airtel Money');
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [customToast, setCustomToast] = useState<string | null>(null);

  const operators = [
    { name: 'Airtel Money', number: '0991855345', class: 'airtel', emoji: '📱' },
    { name: 'M-Pesa', number: '0823673127', class: 'mpesa', emoji: '📱' },
    { name: 'Orange Money', number: '0853259176', class: 'orange', emoji: '🍊' },
  ];

  const handleCopy = (num: string, operatorName: string) => {
    navigator.clipboard.writeText(num);
    setCopiedOperator(operatorName);
    showToast(`Numéro ${operatorName} (${num}) copié !`);
    setTimeout(() => setCopiedOperator(null), 2000);
  };

  const showToast = (msg: string) => {
    setCustomToast(msg);
    setTimeout(() => setCustomToast(null), 3000);
  };

  const handleDropzoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast("Veuillez sélectionner un fichier image valide.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotBase64(reader.result as string);
      setScreenshotName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const proceedToStep2 = () => {
    if (!selectedCandidate) {
      showToast("Veuillez sélectionner votre candidat.");
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToStep1 = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: string[] = [];

    if (!screenshotBase64) {
      validationErrors.push("Une capture d'écran du SMS de confirmation est obligatoire.");
    }
    if (!voterPhone) {
      validationErrors.push("Votre numéro de téléphone payeur est obligatoire.");
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setTimeout(() => setErrors([]), 5000);
      return;
    }

    if (!selectedCandidate) return;

    const newSubmission: VoteSubmission = {
      id: Math.random().toString(36).substr(2, 9),
      candidateId: selectedCandidate.id,
      candidateName: selectedCandidate.name,
      voterName: voterName || 'Anonyme',
      voterPhone: voterPhone,
      screenshotUrl: screenshotBase64,
      status: 'pending',
      timestamp: new Date().toISOString(),
      voteCount: selectedRate.votes,
      operator: operatorSelected,
    };

    onSubmitVote(newSubmission);
    setShowSuccessModal(true);
  };

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.province.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container">
      {/* Page Header */}
      <Header subpageTitle="VOTER" />

      {/* 2-Step Progress Indicator */}
      <div className="w-full flex flex-col gap-2 animate-fade-in mb-2">
        <div className="flex gap-2">
          <div className="h-1.5 flex-1 bg-brand-amber shadow-[0_0_12px_#f59e0b] rounded-full transition-all duration-300" />
          <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-brand-amber shadow-[0_0_12px_#f59e0b]' : 'bg-white/10'}`} />
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest font-bold font-sans">
          <span>{step === 1 ? 'Étape 1 : Choix du candidat & Paiement' : 'Étape 2 : Confirmation & Preuve SMS'}</span>
          <span className="text-brand-amber">Étape {step} sur 2</span>
        </div>
      </div>

      {step === 1 ? (
        /* STEP 1: Candidate Selection & Operators */
        <div className="flex flex-col gap-5 w-full animate-slide-up">
          
          {/* Tarification & Payment operators card */}
          <div className="glass-panel border-brand-amber/25 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-brand-amber/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-white/8 pb-3 mb-4">
              <h3 className="text-xs sm:text-sm font-heading font-black text-brand-amber tracking-wider uppercase flex items-center gap-2">
                <span>💰</span> TARIFS & MODES DE PAIEMENT
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase bg-white/5 px-2 py-0.5 rounded-md">
                1 voix = 0.5$
              </span>
            </div>
            
            <div className="flex flex-col items-center mb-5 text-center">
              <span className="text-3xl sm:text-4xl font-black gold-text font-heading">0.5$ USD</span>
              <span className="text-xs text-slate-300 font-semibold mt-1 uppercase tracking-wider">
                par voix — soit <strong className="text-brand-amber">1 200 FC</strong>
              </span>
            </div>

            {/* Conversion table rate list */}
            <div className="pricing-section">
              <div className="pricing-table-header text-slate-400 pb-2 mb-1.5">
                <div>USD ($)</div>
                <div>Voix</div>
                <div>Francs Congolais</div>
              </div>
              
              <div className="pricing-rows max-h-[190px] overflow-y-auto pr-1 flex flex-col gap-1">
                {CONVERSION_RATES.map((rate, index) => {
                  const isSelected = selectedRate.usd === rate.usd;
                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedRate(rate)}
                      className={`pricing-row rounded-xl py-2.5 px-3 flex items-center transition-all duration-200 border
                        ${isSelected 
                          ? 'bg-brand-amber/15 border-brand-amber text-white font-bold shadow-sm' 
                          : 'bg-white/2 hover:bg-white/5 border-transparent text-slate-300'
                        }
                      `}
                    >
                      <div className="text-xs sm:text-sm font-bold font-mono">{rate.usd}$</div>
                      <div className="text-brand-amber text-xs sm:text-sm font-extrabold font-heading">{rate.votes}</div>
                      <div className="text-slate-300 text-xs font-mono">{rate.fc.toLocaleString()} FC</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-[11px] text-center text-slate-400 font-medium my-3">
              Envoyez le montant correspondant au numéro Mobile Money de votre choix :
            </p>

            {/* Stacked operator cards inside COMMENT VOTER card */}
            <div className="flex flex-col gap-2.5 mt-2">
              {operators.map((op, idx) => {
                const isCopied = copiedOperator === op.name;
                
                return (
                  <div 
                    key={idx}
                    onClick={() => handleCopy(op.number, op.name)}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/8 hover:border-brand-amber/40 transition-all duration-200 cursor-pointer group shadow-sm"
                  >
                    <div className="text-left flex flex-col">
                      <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <span>{op.emoji}</span>
                        <span>{op.name}</span>
                      </div>
                      <div className="text-base sm:text-lg font-black text-white group-hover:text-brand-amber transition-colors font-mono tracking-wider mt-0.5">
                        {op.number}
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/10 group-hover:border-brand-amber/40 rounded-lg text-slate-200 group-hover:text-brand-amber bg-white/5 text-[11px] font-bold uppercase transition-all duration-200 cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check size={13} className="text-emerald-400" />
                          <span>Copié</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copier</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline Steps Card */}
          <div className="glass-panel border-white/8 p-4.5">
            <h3 className="text-xs sm:text-sm font-heading font-black text-brand-amber tracking-wider uppercase mb-4 flex items-center gap-2">
              <span>📋</span> ÉTAPES SIMPLES POUR VOTER
            </h3>

            <div className="timeline">
              <div className="timeline-item completed">
                <div className="timeline-number">1</div>
                <div className="timeline-content">
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Envoyez <strong className="text-brand-amber font-bold">{selectedRate.fc.toLocaleString()} FC ({selectedRate.usd}$)</strong> au numéro Mobile Money ci-dessus.
                  </p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-number">2</div>
                <div className="timeline-content">
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Prenez une <strong className="text-brand-amber font-bold">capture d'écran du SMS de confirmation</strong> reçu après votre transfert.
                  </p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-number">3</div>
                <div className="timeline-content">
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Sélectionnez votre <strong className="text-brand-amber font-bold">créateur favori</strong> ci-dessous et uploadez votre capture pour validation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Candidates Selection section */}
          <div className="glass-panel-gold p-4 sm:p-5 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm sm:text-base font-heading font-black text-brand-amber tracking-wider uppercase">
                  🗳️ CHOISISSEZ VOTRE CRÉATEUR / INFLUENCEUR
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sélectionnez le profil que vous souhaitez propulser au sommet.
                </p>
              </div>

              {/* Search input */}
              <div className="relative min-w-[200px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-brand-amber"
                />
              </div>
            </div>

            <div className="candidates-grid">
              {filteredCandidates.map((candidate) => {
                const isSelected = selectedCandidate?.id === candidate.id;
                const initials = candidate.name.split(' ')
                  .map(n => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();

                return (
                  <div 
                    key={candidate.id}
                    onClick={() => setSelectedCandidate(candidate)}
                    className={`candidate-card border transition-all duration-200
                      ${isSelected 
                        ? 'border-brand-amber bg-brand-amber/5 shadow-amber-glow scale-[1.01]' 
                        : 'border-white/8 bg-black/40 hover:border-white/20'
                      }
                    `}
                  >
                    <div className="candidate-image-container">
                      {candidate.imageUrl && (
                        <img 
                          src={candidate.imageUrl} 
                          alt={candidate.name} 
                          className="candidate-image"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      )}
                      
                      <div 
                        className="candidate-placeholder-art"
                        style={{ 
                          background: candidate.colorGradient || 'linear-gradient(135deg, #181b26 0%, #000000 100%)',
                          display: candidate.imageUrl ? 'none' : 'flex' 
                        }}
                      >
                        <span className="font-heading font-extrabold text-white text-3xl select-none">{initials}</span>
                        <span className="text-[10px] text-brand-amber tracking-widest font-bold uppercase mt-1">K CONSULTING GOMA</span>
                      </div>
                      
                      {isSelected && (
                        <div className="candidate-badge-selected bg-brand-amber text-black font-black shadow-md">
                          ✓ Sélectionné
                        </div>
                      )}
                    </div>
                    
                    <div className="candidate-info text-left">
                      <div className="flex items-center justify-between">
                        <h4 className="candidate-name text-sm sm:text-base font-extrabold text-white uppercase tracking-wider line-clamp-1">
                          {candidate.name}
                        </h4>
                        <span className="text-[10px] font-bold text-brand-amber uppercase bg-brand-amber/10 px-2 py-0.5 rounded border border-brand-amber/20">
                          {candidate.province}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCandidate(candidate);
                          setStep(2);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-full mt-3 py-2.5 px-4 rounded-xl font-heading text-xs font-black tracking-wider uppercase transition-all duration-200 cursor-pointer
                          ${isSelected 
                            ? 'btn-gold shadow-md' 
                            : 'btn-secondary text-slate-200 hover:text-brand-amber'
                          }
                        `}
                      >
                        Voter pour ce candidat →
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredCandidates.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Aucun candidat trouvé pour "{searchQuery}".
                </div>
              )}
            </div>
          </div>

          {/* Floating Action Card when candidate is selected */}
          <div className={`floating-action-card ${selectedCandidate ? 'visible' : ''}`}>
            <div className="floating-candidate-preview">
              <div 
                className="floating-candidate-avatar shrink-0 select-none shadow-md overflow-hidden relative"
                style={{ background: selectedCandidate?.colorGradient || '#f59e0b' }}
              >
                {selectedCandidate?.imageUrl && (
                  <img 
                    src={selectedCandidate.imageUrl} 
                    alt={selectedCandidate.name} 
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <span className="relative z-0 text-black font-extrabold">
                  {selectedCandidate ? selectedCandidate.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : ''}
                </span>
              </div>
              <div className="floating-candidate-details text-left truncate">
                <h4 className="text-white font-extrabold uppercase text-xs sm:text-sm font-heading truncate tracking-wide">
                  {selectedCandidate?.name}
                </h4>
                <p className="text-[10px] text-brand-amber font-bold tracking-wider uppercase">
                  {selectedCandidate?.province} • {selectedRate.votes} voix ({selectedRate.usd}$)
                </p>
              </div>
            </div>
            
            <button 
              onClick={proceedToStep2}
              className="btn-gold py-2 px-4 text-xs font-heading shadow-lg group font-black"
            >
              <span>Continuer</span>
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>
          </div>

        </div>
      ) : (
        /* STEP 2: SMS Capture receipt upload & confirmation details */
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full animate-slide-up">
          
          {/* Selected Candidate Summary Bar */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-brand-amber/10 border border-brand-amber/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-black border border-brand-amber/40 shrink-0">
                {selectedCandidate?.imageUrl ? (
                  <img src={selectedCandidate.imageUrl} alt={selectedCandidate.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-xs text-brand-amber font-heading">
                    {selectedCandidate?.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="text-left">
                <span className="text-[10px] text-brand-amber font-bold uppercase">Candidat Sélectionné :</span>
                <h4 className="text-xs sm:text-sm font-extrabold text-white font-heading uppercase">
                  {selectedCandidate?.name}
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBackToStep1}
              className="text-xs text-slate-400 hover:text-white underline font-bold px-2"
            >
              Changer
            </button>
          </div>

          {/* Capture Upload panel */}
          <div className="glass-panel border-white/8 p-5">
            <h3 className="text-xs sm:text-sm font-heading font-black text-brand-amber tracking-wider uppercase mb-3 flex items-center gap-2">
              <span>📸</span> PREUVE DE PAIEMENT (CAPTURE SMS OBLIGATOIRE)
            </h3>
            
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-brand-amber/10 border border-brand-amber/20 text-slate-200 text-xs leading-relaxed mb-4">
              <Info size={16} className="text-brand-amber mt-0.5 shrink-0" />
              <p>
                Prenez une capture d'écran du message SMS de confirmation de transfert reçu de votre opérateur. C'est votre preuve officielle pour valider le vote.
              </p>
            </div>

            {/* Drop Zone */}
            {!screenshotBase64 ? (
              <div 
                onClick={handleDropzoneClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="upload-dropzone group border-brand-amber/30 hover:border-brand-amber py-8"
              >
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className="upload-icon-container bg-brand-amber/10 group-hover:bg-brand-amber text-brand-amber group-hover:text-black">
                  <Camera size={24} />
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white font-heading">
                  UPLOADER LA CAPTURE D'ÉCRAN
                </h4>
                <p className="text-[11px] text-slate-400 font-medium">
                  Cliquez pour parcourir votre galerie ou glissez-déposez l'image
                </p>
              </div>
            ) : (
              /* Image screenshot preview */
              <div className="preview-container border-brand-amber/40">
                <img 
                  src={screenshotBase64} 
                  alt="SMS Capture Receipt" 
                  className="preview-image"
                />
                <button 
                  type="button"
                  onClick={() => {
                    setScreenshotBase64('');
                    setScreenshotName('');
                  }}
                  className="remove-preview-btn hover:scale-105"
                  title="Supprimer l'image"
                >
                  <X size={16} />
                </button>
                <div className="bg-black/90 p-2 text-center text-xs text-brand-amber font-mono truncate">
                  ✓ {screenshotName || 'Capture_Preuve_Paiement.jpg'}
                </div>
              </div>
            )}
          </div>

          {/* Fields Input Panel */}
          <div className="glass-panel p-5 flex flex-col gap-4 border-white/8">
            <h3 className="text-xs sm:text-sm font-heading font-black text-brand-amber tracking-wider uppercase">
              COORDONNÉES DU PAYEUR
            </h3>

            {/* Operator Selection */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-bold text-slate-300">Opérateur utilisé :</label>
              <div className="grid grid-cols-3 gap-2">
                {['Airtel Money', 'M-Pesa', 'Orange Money'].map((op) => (
                  <button
                    type="button"
                    key={op}
                    onClick={() => setOperatorSelected(op)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border
                      ${operatorSelected === op 
                        ? 'bg-brand-amber text-black border-brand-amber font-extrabold shadow-sm' 
                        : 'bg-black/40 text-slate-300 border-white/10 hover:border-white/20'
                      }
                    `}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1 text-left">
              <label className="text-xs font-bold text-slate-300">
                Numéro de téléphone payeur <span className="text-brand-amber">*</span> :
              </label>
              <input
                type="tel"
                required
                placeholder="Ex: 0991855345 ou 0823673127"
                value={voterPhone}
                onChange={(e) => setVoterPhone(e.target.value)}
                className="w-full bg-black/60 border border-white/12 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-brand-amber font-mono"
              />
            </div>

            {/* Voter Name (Optional) */}
            <div className="flex flex-col gap-1 text-left">
              <label className="text-xs font-bold text-slate-300">
                Votre Nom ou Pseudo <span className="text-slate-500 font-normal">(Optionnel)</span> :
              </label>
              <input
                type="text"
                placeholder="Ex: David Mukendi"
                value={voterName}
                onChange={(e) => setVoterName(e.target.value)}
                className="w-full bg-black/60 border border-white/12 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-brand-amber"
              />
            </div>

            {/* Validation errors */}
            {errors.length > 0 && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-left">
                {errors.map((err, idx) => (
                  <p key={idx}>⚠️ {err}</p>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBackToStep1}
              className="btn-secondary flex-1 py-3 text-xs font-heading font-bold"
            >
              <ArrowLeft size={16} />
              <span>Retour</span>
            </button>

            <button
              type="submit"
              className="btn-gold flex-2 py-3 text-xs sm:text-sm font-heading font-black tracking-wide uppercase shadow-lg"
            >
              <CheckCircle size={18} />
              <span>Valider mon vote ({selectedRate.votes} voix)</span>
            </button>
          </div>
        </form>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="success-modal relative max-w-[440px]">
            <div className="success-icon-container">
              <CheckCircle size={34} />
            </div>

            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-amber bg-brand-amber/10 px-3 py-1 rounded-full border border-brand-amber/30">
              K Consulting • Goma
            </span>

            <h3 className="text-lg sm:text-xl font-black text-white font-heading uppercase">
              VOTE ENREGISTRÉ AVEC SUCCÈS !
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Votre soumission pour <strong className="text-brand-amber font-bold">{selectedCandidate?.name}</strong> ({selectedRate.votes} voix) a été transmise avec succès à l'équipe de vérification de K Consulting à Goma.
            </p>

            <div className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-xs text-left flex flex-col gap-1 text-slate-300 font-mono">
              <div className="flex justify-between">
                <span>Candidat :</span>
                <span className="font-bold text-white">{selectedCandidate?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Montant :</span>
                <span className="text-brand-amber font-bold">{selectedRate.usd}$ ({selectedRate.fc.toLocaleString()} FC)</span>
              </div>
              <div className="flex justify-between">
                <span>Statut :</span>
                <span className="text-amber-400 font-bold">En attente de confirmation</span>
              </div>
            </div>

            {/* Direct Share Button after voting! */}
            <button
              onClick={() => setShowShareModal(true)}
              className="btn-gold w-full py-3 text-xs font-heading font-black uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Share2 size={16} />
              <span>Mobiliser mes proches pour {selectedCandidate?.name}</span>
            </button>

            <div className="flex gap-2 w-full mt-1">
              <button
                onClick={() => navigate('/classement')}
                className="btn-secondary flex-1 py-2.5 text-xs font-heading font-bold"
              >
                Voir le Classement
              </button>
              <button
                onClick={() => navigate('/')}
                className="btn-secondary flex-1 py-2.5 text-xs font-heading font-bold"
              >
                Accueil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        candidateName={selectedCandidate?.name}
      />

      {/* Toast Notification */}
      {customToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black/95 text-white px-4 py-2.5 rounded-full border border-brand-amber shadow-2xl text-xs font-bold font-sans animate-fade-in flex items-center gap-2">
          <Check size={14} className="text-brand-amber" />
          <span>{customToast}</span>
        </div>
      )}
    </div>
  );
};
