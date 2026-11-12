import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
export declare const SERVER_NAME = "ip-contingency-mcp";
export declare const SERVER_VERSION = "1.1.0";
/**
 * Build an MCP server with all 8 tools registered. The caller connects a
 * transport: stdio in src/server.ts, an in-memory pair in tests.
 */
export declare function createMcpServer(): McpServer;
