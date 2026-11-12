import { z } from "zod";

/**
 * Zod schemas for tool inputs and LLM outputs.
 *
 * Input schemas mirror the interfaces in src/types/index.ts and are used by the
 * MCP server to validate `tools/call` arguments. Dates arrive as JSON strings
 * over MCP, so they are parsed into Date objects. Optional fields accept null
 * as well as undefined because the tracker app passes Prisma rows, which use null.
 *
 * Output schemas describe what each tool asks the LLM to return. They are sent
 * to the Messages API as a structured-output JSON schema and used again to
 * validate the parsed response.
 */

/** ISO date string on the wire, Date object in the tool. */
const isoDate = z
  .string()
  .refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid date" })
  .transform((s) => new Date(s));
const optionalDate = isoDate.nullish().transform((v) => v ?? undefined);
const optionalString = z
  .string()
  .nullish()
  .transform((v) => v ?? undefined);

export const RiskLevelSchema = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);

export const AssignmentGapSchema = z.object({
  id: z.string().describe("Unique gap identifier"),
  personId: z.string(),
  personName: z.string(),
  personEmail: optionalString,
  personRole: z.enum(["FOUNDER", "EMPLOYEE", "CONTRACTOR", "ADVISOR"]),
  personStartDate: isoDate.describe("ISO date the person started"),
  personEndDate: optionalDate.describe("ISO date the person left; omit if current"),
  assetId: optionalString,
  assetTitle: optionalString,
  assetType: z.enum(["PATENT", "TRADEMARK"]),
  assetStatus: z.enum(["DRAFT", "FILED", "PUBLISHED", "REGISTERED"]),
  jurisdiction: z.string().describe("Jurisdiction code, e.g. US, CN, DE"),
  filingDate: optionalDate,
  riskScore: z.number().min(0).max(100),
  riskLevel: RiskLevelSchema,
  daysOverdue: z.number(),
});

const gapList = z.array(AssignmentGapSchema).min(1).describe("IP assignment gaps to analyse");

// ---------------------------------------------------------------------------
// Tool input shapes (raw shapes, as the MCP SDK's registerTool expects)
// ---------------------------------------------------------------------------

export const ToolInputShapes = {
  analyzeGaps: { gaps: gapList },
  recommendActions: { gap: AssignmentGapSchema },
  detectAnomalies: {
    gaps: gapList,
    context: z
      .object({
        companyAge: z.number().optional(),
        typicalAssignmentTime: z.number().optional().describe("Typical days to sign an assignment"),
        historicalPatterns: z.record(z.string(), z.unknown()).optional(),
      })
      .optional(),
  },
  generateAdvisory: {
    gaps: gapList,
    companyContext: z
      .object({ name: z.string().optional(), industry: z.string().optional() })
      .optional(),
  },
  rankPriorities: { gaps: gapList },
  queryAssignments: {
    question: z.string().min(1).max(1000).describe("Natural-language question about the gaps"),
    gaps: z.array(AssignmentGapSchema),
  },
  checkCompliance: { gap: AssignmentGapSchema },
  predictRisk: {
    gap: AssignmentGapSchema,
    historicalContext: z
      .object({
        similarGaps: z.array(AssignmentGapSchema).optional(),
        successRate: z.number().optional(),
        avgResolutionDays: z.number().optional(),
      })
      .optional(),
  },
} as const;

// ---------------------------------------------------------------------------
// LLM output schemas
// Kept to features supported by structured outputs: objects, arrays, enums,
// strings, numbers, booleans and optional fields. Numeric ranges are stated
// in descriptions instead of min/max constraints.
// ---------------------------------------------------------------------------

export const AnalysisOutputSchema = z.object({
  patterns: z.array(z.string()),
  riskAreas: z.array(z.string()),
  recommendations: z.array(z.string()),
  summary: z.string(),
});

export const RecommendationOutputSchema = z.object({
  priority: RiskLevelSchema,
  reason: z.string(),
  actions: z.array(z.string()),
  timeline: z.string(),
  jurisdictionNotes: z.string().optional(),
  estimatedEffort: z.string().optional(),
});

export const AnomalyOutputSchema = z.object({
  anomalies: z.array(
    z.object({
      type: z.enum(["unusual_delay", "pattern_deviation", "compliance_violation", "risk_spike"]),
      subject: z.string(),
      description: z.string(),
      severity: RiskLevelSchema,
      evidence: z.string(),
      suggestedAction: z.string(),
    })
  ),
});

export const AdvisoryOutputSchema = z.object({
  executiveSummary: z.string(),
  riskNarrative: z.string(),
  actionItems: z.array(
    z.object({
      priority: z.number().describe("1 = most urgent"),
      action: z.string(),
      owner: z.string().optional(),
      estimatedEffort: z.string().optional(),
    })
  ),
  timeline: z.string(),
  financialImpact: z.string().optional(),
});

export const RankingOutputSchema = z.object({
  ranked: z.array(
    z.object({
      gapId: z.string(),
      priorityScore: z.number().describe("1-100, higher is more urgent"),
      urgencyFactors: z.array(z.string()),
      estimatedResolutionTime: z.string(),
    })
  ),
  methodology: z.string(),
});

export const QueryInterpretationSchema = z.object({
  interpretation: z.string(),
  filters: z.object({
    jurisdiction: z.array(z.string()).optional(),
    assetType: z.array(z.enum(["PATENT", "TRADEMARK"])).optional(),
    riskLevel: z.array(RiskLevelSchema).optional(),
    personStatus: z.enum(["current", "former", "either"]).optional(),
  }),
  explanation: z.string(),
});

export const ComplianceOutputSchema = z.object({
  compliant: z.boolean(),
  severity: z.enum(["OK", "WARNING", "CRITICAL"]),
  issues: z.array(z.string()),
  recommendations: z.array(z.string()),
  references: z.array(z.string()).optional(),
});

export const PredictionOutputSchema = z.object({
  predictedOutcome: z.enum(["likely_success", "at_risk", "likely_failure"]),
  confidence: z.number().describe("0.0-1.0"),
  reasoning: z.string(),
  factors: z.array(
    z.object({
      factor: z.string(),
      weight: z.number().describe("0.0-1.0"),
      direction: z.enum(["positive", "negative"]),
    })
  ),
  recommendedIntervention: z.string().optional(),
});
