// Assignment Gap
export interface AssignmentGap {
  id: string;
  personId: string;
  personName: string;
  personEmail?: string;
  personRole: "FOUNDER" | "EMPLOYEE" | "CONTRACTOR" | "ADVISOR";
  personStartDate: Date;
  personEndDate?: Date;
  assetId?: string;
  assetTitle?: string;
  assetType: "PATENT" | "TRADEMARK";
  assetStatus: "DRAFT" | "FILED" | "PUBLISHED" | "REGISTERED";
  jurisdiction: string;
  filingDate?: Date;
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  daysOverdue: number;
}

// Analysis Result
export interface AnalysisResult {
  patterns: string[];
  riskAreas: string[];
  recommendations: string[];
  summary: string;
  metadata?: Record<string, any>;
}

// Recommendation
export interface Recommendation {
  gapId: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  reason: string;
  actions: string[];
  timeline: string;
  jurisdictionNotes?: string;
  estimatedEffort?: string;
}

// Anomaly
export interface Anomaly {
  id: string;
  type: "unusual_delay" | "pattern_deviation" | "compliance_violation" | "risk_spike";
  subject: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  evidence: string;
  suggestedAction: string;
}

// Advisory Report
export interface AdvisoryReport {
  generatedAt: Date;
  title: string;
  executiveSummary: string;
  riskNarrative: string;
  actionItems: ActionItem[];
  timeline: string;
  financialImpact?: string;
  keyMetrics: Record<string, any>;
}

// Action Item
export interface ActionItem {
  priority: number;
  action: string;
  owner?: string;
  dueDate?: Date;
  estimatedEffort?: string;
}

// Priority Ranked Gap
export interface RankedGap extends AssignmentGap {
  priorityScore: number;
  priorityRank: number;
  urgencyFactors: string[];
  estimatedResolutionTime: string;
}

// Tool Response (generic wrapper)
export interface ToolResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  reasoning?: string;
  timestamp: Date;
}

// Query Result
export interface QueryResult {
  count: number;
  results: AssignmentGap[];
  explanation: string;
}

// Compliance Check Result
export interface ComplianceCheckResult {
  compliant: boolean;
  severity: "OK" | "WARNING" | "CRITICAL";
  jurisdiction: string;
  issues: string[];
  recommendations: string[];
  references?: string[];
}

// Prediction
export interface Prediction {
  gapId: string;
  predictedOutcome: "likely_success" | "at_risk" | "likely_failure";
  confidence: number;
  reasoning: string;
  factors: {
    factor: string;
    weight: number;
    direction: "positive" | "negative";
  }[];
  recommendedIntervention?: string;
}
