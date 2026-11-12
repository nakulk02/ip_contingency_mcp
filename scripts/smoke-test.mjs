#!/usr/bin/env node
/**
 * End-to-end check of the built MCP server over stdio.
 *
 *   npm run build && npm run smoke
 *
 * Starts `node dist/server.js` as a child process, lists its tools and, when
 * ANTHROPIC_API_KEY is set, calls analyzeGaps on examples/sample-gaps.json.
 */
import { readFileSync } from "node:fs";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: process.execPath,
  args: ["dist/server.js"],
  env: { ...process.env, LOG_LEVEL: process.env.LOG_LEVEL ?? "warn" },
  stderr: "inherit",
});
const client = new Client({ name: "smoke-test", version: "1.0.0" });
await client.connect(transport);

const { tools } = await client.listTools();
console.log(`tools/list returned ${tools.length} tools: ${tools.map((t) => t.name).join(", ")}`);
if (tools.length !== 8) {
  console.error("Expected 8 tools");
  process.exitCode = 1;
}

if (process.env.ANTHROPIC_API_KEY) {
  const sample = JSON.parse(readFileSync("examples/sample-gaps.json", "utf8"));
  const result = await client.callTool({ name: "analyzeGaps", arguments: sample });
  if (result.isError) {
    console.error("analyzeGaps failed:", result.content?.[0]?.text);
    process.exitCode = 1;
  } else {
    const { data, usage } = result.structuredContent;
    console.log("analyzeGaps summary:", data.summary);
    console.log("usage:", usage);
  }
} else {
  console.log("ANTHROPIC_API_KEY not set: skipped the analyzeGaps call.");
}

await client.close();
