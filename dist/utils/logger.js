import pino from "pino";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
/**
 * pino-pretty is a devDependency of this package, not a production one,
 * since it's only meant to make this repo's own CLI/dev output readable.
 * When this package is consumed as a library by another app (e.g. the
 * main tracker app importing this as ip-contingency-mcp), pino-pretty
 * won't be installed in the consumer's node_modules, and pointing pino
 * at a transport it can't resolve crashes at import time. Check
 * availability first and fall back to plain JSON logging instead.
 */
function isPinoPrettyAvailable() {
    try {
        require.resolve("pino-pretty");
        return true;
    }
    catch {
        return false;
    }
}
const usePretty = process.env.NODE_ENV !== "production" && isPinoPrettyAvailable();
/**
 * Structured logger for the intelligence tool layer.
 *
 * - In production: emits JSON lines (suitable for log aggregation).
 * - In development, when pino-pretty is available: emits human-readable,
 *   colorized output.
 * - Otherwise: emits plain JSON lines regardless of environment.
 *
 * Usage:
 *   logger.info({ tool: "analyzeGaps" }, "tool invoked");
 *   logger.error({ err }, "tool execution failed");
 */
export const logger = pino({
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug"),
    ...(usePretty
        ? {
            transport: {
                target: "pino-pretty",
                options: {
                    colorize: true,
                    translateTime: "SYS:standard",
                    ignore: "pid,hostname",
                },
            },
        }
        : {}),
    // Never log API keys even if accidentally passed in metadata.
    redact: {
        paths: ["apiKey", "ANTHROPIC_API_KEY", "authorization"],
        censor: "[REDACTED]",
    },
});
export default logger;
