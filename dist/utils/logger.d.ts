import pino from "pino";
/**
 * Structured logger for the intelligence tool layer.
 *
 * - In production: emits JSON lines (suitable for log aggregation).
 * - In development, when pino-pretty is available: emits human-readable,
 *   colorized output.
 * - Otherwise: emits plain JSON lines regardless of environment.
 *
 * All output goes to stderr (fd 2). When this package runs as an MCP server
 * over stdio, stdout carries the JSON-RPC protocol and must not be written to.
 *
 * Usage:
 *   logger.info({ tool: "analyzeGaps" }, "tool invoked");
 *   logger.error({ err }, "tool execution failed");
 */
export declare const logger: pino.Logger<never, boolean>;
export default logger;
