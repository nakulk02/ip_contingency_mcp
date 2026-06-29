import analyzeGaps from "./analyze-gaps.js";
import recommendActions from "./recommend-actions.js";
import detectAnomalies from "./detect-anomalies.js";
import generateAdvisory from "./generate-advisory.js";
import rankPriorities from "./rank-priorities.js";
import queryAssignments from "./query-assignments.js";
import checkCompliance from "./check-compliance.js";
import predictRisk from "./predict-risk.js";

export const TOOLS = {
  analyzeGaps,
  recommendActions,
  detectAnomalies,
  generateAdvisory,
  rankPriorities,
  queryAssignments,
  checkCompliance,
  predictRisk,
};

export type ToolName = keyof typeof TOOLS;

/**
 * Get tool by name
 */
export function getTool(name: ToolName) {
  const tool = TOOLS[name];
  if (!tool) {
    throw new Error(`Tool not found: ${name}`);
  }
  return tool;
}

/**
 * List all available tools
 */
export function listTools() {
  return Object.keys(TOOLS);
}

export {
  analyzeGaps,
  recommendActions,
  detectAnomalies,
  generateAdvisory,
  rankPriorities,
  queryAssignments,
  checkCompliance,
  predictRisk,
};
