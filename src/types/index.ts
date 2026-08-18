export interface CandidateSocials {
  tiktok?: string;
  instagram?: string;
  youtube?: string;
}

export interface Candidate {
  id: string;
  name: string;
  province: string;
  votes: number;
  likes?: number;
  bio?: string;
  socials?: CandidateSocials;
  imageUrl?: string;
  colorGradient: string; // fallback visual representation
}

export interface VoteSubmission {
  id: string;
  candidateId: string;
  candidateName: string;
  voterName: string;
  voterPhone: string;
  screenshotUrl: string; // can be base64 or objectUrl
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  voteCount: number; // based on payment amount
  operator: string;
}

export interface ConversionRate {
  usd: number;
  votes: number;
  fc: number;
}
