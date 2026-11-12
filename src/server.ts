#!/usr/bin/env node
import dotenv from "dotenv";

// quiet: dotenv's banner goes to stdout, which is the MCP protocol channel.
dotenv.config({ quiet: true });

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createMcpServer } from "./mcp/create-server.js";
import { TOOL_DEFINITIONS } from "./mcp/tool-definitions.js";
import { logger } from "./utils/logger.js";

/**
 * MCP server entry point (stdio transport).
 *
 *   node dist/server.js
 *   npx @modelcontextprotocol/inspector node dist/server.js
 *
 * stdout carries the JSON-RPC protocol, so all logging goes to stderr
 * (see src/utils/logger.ts).
 */
async function main() {
  const server = createMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info(
    { tools: TOOL_DEFINITIONS.map((t) => t.name), transport: "stdio" },
    "IP Contingency MCP server running"
  );

  const shutdown = async () => {
    await server.close();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  logger.error({ err }, "MCP server failed to start");
  process.exit(1);
});
