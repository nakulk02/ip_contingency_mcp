import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { processTool } from "../index.js";
import { TOOL_DEFINITIONS } from "./tool-definitions.js";

export const SERVER_NAME = "ip-contingency-mcp";
export const SERVER_VERSION = "1.1.0";

/**
 * Convert a ToolResponse into MCP tool-call content. Successful results are
 * returned both as JSON text (for clients that only read text) and as
 * structuredContent. Failures set isError so the client or model can react.
 */
function toCallToolResult(response: Awaited<ReturnType<typeof processTool>>): CallToolResult {
  if (!response.success) {
    return {
      isError: true,
      content: [{ type: "text", text: response.error ?? "Tool failed" }],
    };
  }
  const payload = {
    data: response.data,
    reasoning: response.reasoning,
    usage: response.usage,
  };
  return {
    content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
    structuredContent: JSON.parse(JSON.stringify(payload)),
  };
}

/**
 * Build an MCP server with all 8 tools registered. The caller connects a
 * transport: stdio in src/server.ts, an in-memory pair in tests.
 */
export function createMcpServer(): McpServer {
  const server = new McpServer({ name: SERVER_NAME, version: SERVER_VERSION });

  for (const def of TOOL_DEFINITIONS) {
    server.registerTool(
      def.name,
      {
        title: def.title,
        description: def.description,
        inputSchema: def.inputShape,
        annotations: { readOnlyHint: true, openWorldHint: true },
      },
      async (args: unknown) => toCallToolResult(await processTool({ tool: def.name, input: args }))
    );
  }

  return server;
}
