import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Vote } from './pages/Vote';
import { Explore } from './pages/Explore';
import { LiveRanking } from './pages/LiveRanking';
import { AdminDashboard } from './pages/AdminDashboard';
import type { Candidate, VoteSubmission } from './types';

// Default mock candidates representing influencers & content creators in Goma
const DEFAULT_CANDIDATES: Candidate[] = [
  {
    id: '1',
    name: 'TATIANA LA STAR',
    province: 'GOMA • MODE & INFLUENCE',
    votes: 45458,
    likes: 1840,
    bio: 'Icône de la mode urbaine et créatrice de tendances à Goma. Engagée pour le rayonnement des talents féminins.',
    socials: {
      tiktok: '@tatiana_la_star',
      instagram: '@tatiana_lastar_official',
      youtube: 'Tatiana La Star Show',
    },
    colorGradient: 'linear-gradient(135deg, #f59e0b 0%, #78350f 100%)',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: '2',
    name: 'JONATHAN ELIE',
    province: 'GOMA • CRÉATEUR DIGITAL',
    votes: 31930,
    likes: 1420,
    bio: 'Humoriste et créateur de sketchs digitaux à succès. Fait rire des millions d’abonnés à travers toute la RDC.',
    socials: {
      tiktok: '@jonathan_elie_off',
      instagram: '@jonathan_elie_dr',
      youtube: 'Jonathan Elie Comédie',
    },
    colorGradient: 'linear-gradient(135deg, #ea580c 0%, #431407 100%)',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: '3',
    name: 'MIMI MERVEILLE',
    province: 'GOMA • LIFESTYLE & BEAUTÉ',
    votes: 23163,
    likes: 980,
    bio: 'Passionnée de bien-être, cosmétique naturelle et lifestyle congolais. Ambassadrice de la beauté authentique.',
    socials: {
      tiktok: '@mimi_merveille_goma',
      instagram: '@mimi_merveille_lifestyle',
      youtube: 'Mimi Merveille Tips',
    },
    colorGradient: 'linear-gradient(135deg, #fbbf24 0%, #b45309 100%)',
    imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: '4',
    name: 'PATRICK KABONGO',
    province: 'GOMA • CULTURE & PODCAST',
    votes: 16423,
    likes: 760,
    bio: 'Animateur de podcasts culturels et promoteur des initiatives de la jeunesse engagée du Nord-Kivu.',
    socials: {
      tiktok: '@patrick_kabongo_talk',
      instagram: '@patrick_kabongo_live',
      youtube: 'Patrick Kabongo Podcast',
    },
    colorGradient: 'linear-gradient(135deg, #d97706 0%, #451a03 100%)',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
  },
];

// Pre-populated demo submission proofs for the admin panel
const DEFAULT_SUBMISSIONS: VoteSubmission[] = [
  {
    id: 'sub-demo-1',
    candidateId: '1',
    candidateName: 'TATIANA LA STAR',
    voterName: 'Michel Kalonda',
    voterPhone: '0991855345',
    screenshotUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%230b0c10"/><text x="50%" y="35%" dominant-baseline="middle" text-anchor="middle" fill="%23f59e0b" font-size="14" font-family="sans-serif" font-weight="bold">TRANSACTION Airtel Money REÇU</text><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff" font-size="12" font-family="sans-serif">Dépôt Réussi: 2 400 FC (1.00 USD)</text><text x="50%" y="75%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="11" font-family="monospace">ID: TXN-AIRTEL-827189</text></svg>',
    status: 'approved',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    voteCount: 2,
    operator: 'Airtel Money',
  },
  {
    id: 'sub-demo-2',
    candidateId: '2',
    candidateName: 'JONATHAN ELIE',
    voterName: 'Sarah Mwanza',
    voterPhone: '0823673127',
    screenshotUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%230b0c10"/><text x="50%" y="35%" dominant-baseline="middle" text-anchor="middle" fill="%233b82f6" font-size="14" font-family="sans-serif" font-weight="bold">TRANSACTION M-Pesa CONFIRMÉE</text><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff" font-size="12" font-family="sans-serif">Dépôt Réussi: 12 000 FC (5.00 USD)</text><text x="50%" y="75%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="11" font-family="monospace">ID: TXN-MPESA-923180</text></svg>',
    status: 'pending',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    voteCount: 10,
    operator: 'M-Pesa',
  },
];

function App() {
  // Initialize state from LocalStorage or use defaults
  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem('kconsulting_candidates');
    if (!saved) return DEFAULT_CANDIDATES;
    try {
      const parsed = JSON.parse(saved) as Candidate[];
      if (!parsed || parsed.length === 0) return DEFAULT_CANDIDATES;
      // Ensure all candidates have socials and likes
      return parsed.map((cand, i) => ({
        ...cand,
        likes: cand.likes ?? DEFAULT_CANDIDATES[i]?.likes ?? 100,
        bio: cand.bio ?? DEFAULT_CANDIDATES[i]?.bio,
        socials: cand.socials ?? DEFAULT_CANDIDATES[i]?.socials,
      }));
    } catch {
      return DEFAULT_CANDIDATES;
    }
  });

  const [submissions, setSubmissions] = useState<VoteSubmission[]>(() => {
    const saved = localStorage.getItem('kconsulting_submissions');
    return saved ? JSON.parse(saved) : DEFAULT_SUBMISSIONS;
  });

  useEffect(() => {
    localStorage.setItem('kconsulting_candidates', JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem('kconsulting_submissions', JSON.stringify(submissions));
  }, [submissions]);

  const handleSubmitVote = (newSubmission: VoteSubmission) => {
    setSubmissions((prev) => [...prev, newSubmission]);
  };

  const handleLikeCandidate = (candidateId: string) => {
    setCandidates((prev) =>
      prev.map((cand) => {
        if (cand.id === candidateId) {
          const currentLikes = cand.likes || 0;
          return { ...cand, likes: currentLikes + 1 };
        }
        return cand;
      })
    );
  };

  const handleApproveSubmission = (submissionId: string) => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id === submissionId && sub.status === 'pending') {
          setCandidates((prevCandidates) =>
            prevCandidates.map((cand) => {
              if (cand.id === sub.candidateId) {
                return { ...cand, votes: cand.votes + sub.voteCount };
              }
              return cand;
            })
          );
          return { ...sub, status: 'approved' };
        }
        return sub;
      })
    );
  };

  const handleRejectSubmission = (submissionId: string) => {
    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id === submissionId && sub.status === 'pending') {
          return { ...sub, status: 'rejected' };
        }
        return sub;
      })
    );
  };

  const handleAddCandidate = (name: string, province: string, imageUrl?: string) => {
    const gradients = [
      'linear-gradient(135deg, #f59e0b 0%, #78350f 100%)',
      'linear-gradient(135deg, #fbbf24 0%, #b45309 100%)',
      'linear-gradient(135deg, #ea580c 0%, #431407 100%)',
      'linear-gradient(135deg, #d97706 0%, #451a03 100%)',
    ];
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

    const newCandidate: Candidate = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      province: province,
      votes: 0,
      likes: 0,
      bio: `Créateur de contenu dynamique à Goma.`,
      socials: {
        tiktok: `@${name.toLowerCase().replace(/\s+/g, '')}`,
        instagram: `@${name.toLowerCase().replace(/\s+/g, '_')}`,
        youtube: `${name} Official`,
      },
      colorGradient: randomGradient,
      imageUrl: imageUrl || undefined,
    };
    setCandidates((prev) => [...prev, newCandidate]);
  };

  const handleDeleteCandidate = (id: string) => {
    setCandidates((prev) => prev.filter((cand) => cand.id !== id));
    setSubmissions((prev) => prev.filter((sub) => sub.candidateId !== id));
  };

  const handleUpdateCandidateVotes = (id: string, votesCount: number) => {
    setCandidates((prev) =>
      prev.map((cand) => {
        if (cand.id === id) {
          return { ...cand, votes: Math.max(0, votesCount) };
        }
        return cand;
      })
    );
  };

  const handleRefresh = () => {
    // Refresh handler
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route 
          path="/explore" 
          element={
            <Explore 
              candidates={candidates} 
              onLikeCandidate={handleLikeCandidate} 
            />
          } 
        />
        <Route 
          path="/explorez" 
          element={
            <Explore 
              candidates={candidates} 
              onLikeCandidate={handleLikeCandidate} 
            />
          } 
        />
        
        <Route 
          path="/vote" 
          element={
            <Vote 
              candidates={candidates} 
              onSubmitVote={handleSubmitVote} 
            />
          } 
        />
        
        <Route 
          path="/classement" 
          element={
            <LiveRanking 
              candidates={candidates} 
              onRefresh={handleRefresh} 
            />
          } 
        />
        
        <Route 
          path="/admin" 
          element={
            <AdminDashboard 
              candidates={candidates}
              submissions={submissions}
              onApproveSubmission={handleApproveSubmission}
              onRejectSubmission={handleRejectSubmission}
              onAddCandidate={handleAddCandidate}
              onDeleteCandidate={handleDeleteCandidate}
              onUpdateCandidateVotes={handleUpdateCandidateVotes}
            />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
