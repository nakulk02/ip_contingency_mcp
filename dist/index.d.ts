import { TOOLS, listTools } from "./tools/index.js";
import { ToolResponse } from "./types/index.js";
/**
 * IP Contingency Intelligence: library entry point.
 *
 * `processTool()` runs one of the 8 tools in-process. The tracker app imports
 * it directly. The same tools are exposed over the Model Context Protocol
 * by src/server.ts.
 */
export interface ToolCall {
    tool: string;
    input: any;
}
/**
 * Run a tool by name. Logs the tool's duration and the total token usage of
 * the LLM calls it made, and attaches that usage to the response.
 */
export declare function processTool(toolCall: ToolCall): Promise<ToolResponse<any>>;
/**
 * Get tool descriptions
 */
export declare function getToolDescriptions(): Record<"analyzeGaps" | "recommendActions" | "detectAnomalies" | "generateAdvisory" | "rankPriorities" | "queryAssignments" | "checkCompliance" | "predictRisk", {
    description: string;
    input: Record<string, string>;
}>;
export { TOOLS, listTools };
declare const _default: {
    processTool: typeof processTool;
    getToolDescriptions: typeof getToolDescriptions;
    listTools: typeof listTools;
};
export default _default;
