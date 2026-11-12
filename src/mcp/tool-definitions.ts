import { ToolInputShapes } from "../schemas/index.js";
import type { ToolName } from "../tools/index.js";

/**
 * One place that describes every tool: its MCP title, the description shown to
 * clients (and to the model choosing a tool), and its Zod input shape.
 */
export interface ToolDefinition {
  name: ToolName;
  title: string;
  description: string;
  inputShape: (typeof ToolInputShapes)[ToolName];
  /** Short human-readable input summary, kept for getToolDescriptions(). */
  inputSummary: Record<string, string>;
}

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    name: "analyzeGaps",
    title: "Analyze IP gaps",
    description:
      "Find patterns, root causes and risk areas across a set of IP assignment gaps (missing invention or trademark assignments). Use for portfolio-wide questions such as 'what is going wrong overall?'.",
    inputShape: ToolInputShapes.analyzeGaps,
    inputSummary: { gaps: "AssignmentGap[]" },
  },
  {
    name: "recommendActions",
    title: "Recommend actions for a gap",
    description:
      "Produce a priority, concrete next steps, a timeline and jurisdiction notes for resolving one specific IP assignment gap.",
    inputShape: ToolInputShapes.recommendActions,
    inputSummary: { gap: "AssignmentGap" },
  },
  {
    name: "detectAnomalies",
    title: "Detect anomalies",
    description:
      "Flag unusual delays, pattern deviations, compliance violations and risk spikes in a set of gaps, each with evidence and a suggested action.",
    inputShape: ToolInputShapes.detectAnomalies,
    inputSummary: { gaps: "AssignmentGap[]", context: "optional context object" },
  },
  {
    name: "generateAdvisory",
    title: "Generate executive advisory",
    description:
      "Write an executive advisory report (summary, risk narrative, prioritised action items, timeline, financial impact) for a set of gaps.",
    inputShape: ToolInputShapes.generateAdvisory,
    inputSummary: { gaps: "AssignmentGap[]", companyContext: "optional company info" },
  },
  {
    name: "rankPriorities",
    title: "Rank gaps by priority",
    description:
      "Rank gaps by strategic priority (legal urgency, financial impact, deadline proximity, complexity), returning a 1-100 score, urgency factors and an estimated resolution time for each.",
    inputShape: ToolInputShapes.rankPriorities,
    inputSummary: { gaps: "AssignmentGap[]" },
  },
  {
    name: "queryAssignments",
    title: "Query gaps in natural language",
    description:
      "Translate a natural-language question (e.g. 'former contractors with high-risk Chinese patents') into filters and return the matching gaps.",
    inputShape: ToolInputShapes.queryAssignments,
    inputSummary: { question: "string", gaps: "AssignmentGap[]" },
  },
  {
    name: "checkCompliance",
    title: "Check jurisdiction compliance",
    description:
      "Check one gap against the IP assignment requirements of its jurisdiction and return compliance status, severity, issues and recommendations.",
    inputShape: ToolInputShapes.checkCompliance,
    inputSummary: { gap: "AssignmentGap" },
  },
  {
    name: "predictRisk",
    title: "Predict resolution risk",
    description:
      "Predict whether one gap is likely to be resolved, at risk, or likely to fail, with a confidence score and weighted factors.",
    inputShape: ToolInputShapes.predictRisk,
    inputSummary: { gap: "AssignmentGap", historicalContext: "optional context" },
  },
];

export const TOOL_DESCRIPTIONS = Object.fromEntries(
  TOOL_DEFINITIONS.map((t) => [t.name, { description: t.description, input: t.inputSummary }])
) as Record<ToolName, { description: string; input: Record<string, string> }>;
