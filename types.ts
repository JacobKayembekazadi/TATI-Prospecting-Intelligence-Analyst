
export enum TargetScore {
  HOT = 'HOT 🔥',
  WARM = 'WARM 🟡',
  COLD = 'COLD 🔵',
  SKIP = 'SKIP ⛔'
}

export interface ProspectAnalysis {
  prospect: {
    company: string;
    type: string;
    location: string;
    signal: string;
    source: string;
  };
  qualification: {
    score: TargetScore;
    positives: string[];
    concerns: string[];
    timing: string;
  };
  productNeeds: {
    immediate: Array<{ product: string; why: string }>;
    future: Array<{ product: string; whenWhy: string }>;
    estimatedVolume: 'Small' | 'Medium' | 'Large';
  };
  outreach: {
    subject: string;
    body: string;
  };
  nextSteps: string[];
}

export interface AnalysisEntry {
  id: string;
  timestamp: Date;
  rawInput: string;
  analysis: string; // Storing as raw text to preserve the requested "════" format
}
