import dotenv from "dotenv";

dotenv.config();

import { TOOLS, listTools } from "./tools/index.js";
import { ToolResponse } from "./types/index.js";
import { toToolResponse } from "./utils/tool-response.js";

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
export async function processTool(toolCall: ToolCall): Promise<ToolResponse<any>> {
  const { tool, input } = toolCall;

  const toolFn = TOOLS[tool as keyof typeof TOOLS];

  if (!toolFn) {
    return {
      success: false,
      error: `Tool not found: ${tool}. Available tools: ${listTools().join(", ")}`,
      timestamp: new Date(),
    };
  }

  try {
    return await toolFn(input);
  } catch (error) {
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
  console.log("IP Contingency MCP Server");
  console.log("Available tools:", listTools());
  console.log("\nTool descriptions:");
  console.log(JSON.stringify(getToolDescriptions(), null, 2));
}

export default { processTool, getToolDescriptions, listTools: listTools };
