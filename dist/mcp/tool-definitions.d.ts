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
export declare const TOOL_DEFINITIONS: ToolDefinition[];
export declare const TOOL_DESCRIPTIONS: Record<ToolName, {
    description: string;
    input: Record<string, string>;
}>;
