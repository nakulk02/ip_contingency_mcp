import analyzeGaps from "./analyze-gaps.js";
import recommendActions from "./recommend-actions.js";
import detectAnomalies from "./detect-anomalies.js";
import generateAdvisory from "./generate-advisory.js";
import rankPriorities from "./rank-priorities.js";
import queryAssignments from "./query-assignments.js";
import checkCompliance from "./check-compliance.js";
import predictRisk from "./predict-risk.js";
export declare const TOOLS: {
    analyzeGaps: typeof analyzeGaps;
    recommendActions: typeof recommendActions;
    detectAnomalies: typeof detectAnomalies;
    generateAdvisory: typeof generateAdvisory;
    rankPriorities: typeof rankPriorities;
    queryAssignments: typeof queryAssignments;
    checkCompliance: typeof checkCompliance;
    predictRisk: typeof predictRisk;
};
export type ToolName = keyof typeof TOOLS;
/**
 * Get tool by name
 */
export declare function getTool(name: ToolName): typeof analyzeGaps | typeof recommendActions | typeof detectAnomalies | typeof generateAdvisory | typeof rankPriorities | typeof queryAssignments | typeof checkCompliance | typeof predictRisk;
/**
 * List all available tools
 */
export declare function listTools(): string[];
export { analyzeGaps, recommendActions, detectAnomalies, generateAdvisory, rankPriorities, queryAssignments, checkCompliance, predictRisk, };
