
export interface AlternativeSite {
  siteName: string;
  description: string;
  mechanism: string;
}

export interface InteractionAnalysis {
  proteinName: string;
  proteinFunction: string;
  drugName: string;
  bindingSiteDescription: string;
  residuesInvolved: string[];
  structuralChanges: string;
  bindingAffinityPrediction: string;
  clinicalSignificance: string;
  pdbId?: string; // PDB ID for 3D visualization
  alternativeBindingSites: AlternativeSite[]; // New feature: Recommended active sites
  isPredictedTarget?: boolean; // Flag to indicate if the protein was AI-predicted
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export interface HistoryItem {
  id: string;
  date: string;
  drug: string;
  protein: string;
  summary: string;
}

export type AnalysisMode = 'existing' | 'custom';

export interface CustomDrugParams {
  moleculeType: string;
  targetSystem: string; // e.g., CNS, Cardiovascular
  molecularWeight: string; // e.g., <300, 300-500
  hydrophobicity: string; // LogP related
  charge: string;
  functionalGroups: string[];
}
