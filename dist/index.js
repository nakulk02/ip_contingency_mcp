import dotenv from "dotenv";
dotenv.config();
import { TOOLS, listTools } from "./tools/index.js";
import { toToolResponse } from "./utils/tool-response.js";
import { logger } from "./utils/logger.js";
/**
 * Process a tool call
 */
export async function processTool(toolCall) {
    const { tool, input } = toolCall;
    const start = Date.now();
    const toolFn = TOOLS[tool];
    if (!toolFn) {
        logger.warn({ tool }, "Tool not found");
        return {
            success: false,
            error: `Tool not found: ${tool}. Available tools: ${listTools().join(", ")}`,
            timestamp: new Date(),
        };
    }
    try {
        const result = await toolFn(input);
        logger.debug({ tool, success: result.success, durationMs: Date.now() - start }, "Tool execution completed");
        return result;
    }
    catch (error) {
        logger.error({ tool, err: error, durationMs: Date.now() - start }, "Tool execution failed");
        return toToolResponse(error);
    }
}
/**
 * Get tool descriptions
 */
export function getToolDescriptions() {
    return {
        analyzeGaps: {
            description: "Analyze IP ownership gaps to identify patterns and risk areas",
            input: { gaps: "AssignmentGap[]" },
        },
        recommendActions: {
            description: "Generate specific recommendations for resolving an IP assignment gap",
            input: { gap: "AssignmentGap" },
        },
        detectAnomalies: {
            description: "Detect unusual patterns and red flags in IP assignment data",
            input: { gaps: "AssignmentGap[]", context: "optional context object" },
        },
        generateAdvisory: {
            description: "Generate executive advisory report on IP assignment compliance",
            input: { gaps: "AssignmentGap[]", companyContext: "optional company info" },
        },
        rankPriorities: {
            description: "Rank gaps by strategic priority and urgency",
            input: { gaps: "AssignmentGap[]" },
        },
        queryAssignments: {
            description: "Search and filter gaps using natural language",
            input: { question: "string", gaps: "AssignmentGap[]" },
        },
        checkCompliance: {
            description: "Check compliance of a gap against jurisdiction-specific rules",
            input: { gap: "AssignmentGap" },
        },
        predictRisk: {
            description: "Predict likely outcome and risk for a gap",
            input: { gap: "AssignmentGap", historicalContext: "optional context" },
        },
    };
}
// Main entry point
if (import.meta.url === `file://${process.argv[1]}`) {
    logger.info({ tools: listTools() }, "IP Contingency MCP Server starting");
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(getToolDescriptions(), null, 2));
}
export default { processTool, getToolDescriptions, listTools: listTools };
