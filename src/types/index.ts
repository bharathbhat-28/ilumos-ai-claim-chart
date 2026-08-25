export type EvidenceStrength = 'direct' | 'indirect' | 'insufficient';

export interface Evidence {
  id: string;
  documentName: string;
  page: number;
  excerpt: string;
  highlightText: string;
  sourceType?: string;
}

export interface ClaimElement {
  id: string;
  elementNum: number;
  claimText: string;
  accusedFeature: string;
  reasoning: string;
  evidence: Evidence[];
  evidenceStrength: EvidenceStrength;
  version: number;
  isUpdated?: boolean;
}

export interface RefinementProposal {
  proposedReasoning: string;
  evidence: Evidence[];
  strength: EvidenceStrength;
  gapExplanation?: string;
}

export interface ChatMessage {
  id: string;
  role: 'analyst' | 'ai';
  content: string;
  timestamp: string;
  elementId?: string;
  proposal?: RefinementProposal;
  isRefinementProposal?: boolean;
  isWrongEvidenceCorrection?: boolean;
  isNoEvidenceState?: boolean;
  status?: 'proposed' | 'accepted' | 'rejected' | 'edited';
}

export interface UploadedFile {
  id: string;
  name: string;
  type: 'claim_chart' | 'product_doc' | 'tech_spec';
  size: string;
  pages?: number;
}

export type AppStep = 'upload' | 'processing' | 'workspace';
