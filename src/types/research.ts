export type ResearchField =
  | 'Computer Science'
  | 'Engineering'
  | 'Medicine'
  | 'Environment'
  | 'Business'
  | 'Other';

export interface ReferenceItem {
  id: string;
  authors: string;
  year: string;
  title: string;
  source: string;
  doiOrUrl?: string;
  verificationStatus: 'verified_landmark' | 'proposed_benchmark_unverified';
  verificationNote: string;
}

export interface ResearchMethodology {
  approach: string;
  dataCollectionOrSetup: string;
  analyticalProcedure: string;
  evaluationMetrics: string;
  ethicalAndValidityConsiderations: string;
}

export interface ExpectedResults {
  hypothesizedOutcomes: string;
  theoreticalSignificance: string;
  prospectiveDistinction: string;
}

export interface ResearchPaper {
  id: string;
  topic: string;
  field: ResearchField;
  customField?: string;
  paperTitle: string;
  createdAt: string;
  abstract: string;
  keywords: string[];
  introduction: string;
  problemStatement: string;
  researchObjectives: string[];
  literatureReview: string;
  researchMethodology: ResearchMethodology;
  expectedResults: ExpectedResults;
  conclusion: string;
  references: ReferenceItem[];
  academicRigorNotice: string;
}

export interface GenerateResearchRequest {
  topic: string;
  field: ResearchField;
  customField?: string;
}
