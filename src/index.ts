import dotenv from "dotenv";

// quiet: dotenv's banner goes to stdout, which is the MCP protocol channel.
dotenv.config({ quiet: true });

import { TOOLS, listTools, ToolName } from "./tools/index.js";
import { ToolResponse } from "./types/index.js";
import { toToolResponse } from "./utils/tool-response.js";
import { logger } from "./utils/logger.js";
import { withUsageTracking } from "./utils/usage.js";
import { TOOL_DESCRIPTIONS } from "./mcp/tool-definitions.js";

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
export async function processTool(toolCall: ToolCall): Promise<ToolResponse<any>> {
  const { tool, input } = toolCall;
  const start = Date.now();

  const toolFn = TOOLS[tool as ToolName] as
    ((input: any) => Promise<ToolResponse<any>>) | undefined;

  if (!toolFn) {
    logger.warn({ tool }, "Tool not found");
    return {
      success: false,
      error: `Tool not found: ${tool}. Available tools: ${listTools().join(", ")}`,
      timestamp: new Date(),
    };
  }

  try {
    const { result, usage } = await withUsageTracking(() => toolFn(input));
    const durationMs = Date.now() - start;
    logger.info(
      { tool, success: result.success, durationMs, ...usage },
      "Tool execution completed"
    );
    return { ...result, usage: { ...usage, durationMs } };
  } catch (error) {
    logger.error({ tool, err: error, durationMs: Date.now() - start }, "Tool execution failed");
    return toToolResponse(error);
  }
}

/**
 * Get tool descriptions
 */
export function getToolDescriptions() {
  return TOOL_DESCRIPTIONS;
}

export { TOOLS, listTools };

export default { processTool, getToolDescriptions, listTools };
