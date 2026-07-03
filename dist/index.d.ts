import { listTools } from "./tools/index.js";
import { ToolResponse } from "./types/index.js";
/**
 * MCP Server for IP Contingency Intelligence
 *
 * Provides intelligent analysis tools for IP assignment compliance
 */
interface ToolCall {
    tool: string;
    input: any;
}
/**
 * Process a tool call
 */
export declare function processTool(toolCall: ToolCall): Promise<ToolResponse<any>>;
/**
 * Get tool descriptions
 */
export declare function getToolDescriptions(): {
    analyzeGaps: {
        description: string;
        input: {
            gaps: string;
        };
    };
    recommendActions: {
        description: string;
        input: {
            gap: string;
        };
    };
    detectAnomalies: {
        description: string;
        input: {
            gaps: string;
            context: string;
        };
    };
    generateAdvisory: {
        description: string;
        input: {
            gaps: string;
            companyContext: string;
        };
    };
    rankPriorities: {
        description: string;
        input: {
            gaps: string;
        };
    };
    queryAssignments: {
        description: string;
        input: {
            question: string;
            gaps: string;
        };
    };
    checkCompliance: {
        description: string;
        input: {
            gap: string;
        };
    };
    predictRisk: {
        description: string;
        input: {
            gap: string;
            historicalContext: string;
        };
    };
};
declare const _default: {
    processTool: typeof processTool;
    getToolDescriptions: typeof getToolDescriptions;
    listTools: typeof listTools;
};
export default _default;
