import pino from "pino";
/**
 * Structured logger for the intelligence tool layer.
 *
 * - In production: emits JSON lines (suitable for log aggregation).
 * - In development: emits human-readable, colorized output via pino-pretty.
 *
 * Usage:
 *   logger.info({ tool: "analyzeGaps" }, "tool invoked");
 *   logger.error({ err }, "tool execution failed");
 */
export const logger = pino({
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug"),
    ...(process.env.NODE_ENV !== "production"
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
