/**
 * Token usage collected across every LLM call made while one tool runs.
 * A tool can make more than one call (queryAssignments does, and a failed
 * structured-output validation triggers a retry), so usage is accumulated
 * per tool invocation rather than per request.
 */
export interface ToolUsage {
    llmCalls: number;
    inputTokens: number;
    outputTokens: number;
    llmLatencyMs: number;
}
export declare function emptyUsage(): ToolUsage;
/** Run `fn` with a fresh usage accumulator and return its result together with the usage. */
export declare function withUsageTracking<T>(fn: () => Promise<T>): Promise<{
    result: T;
    usage: ToolUsage;
}>;
/** Called by the LLM client after each API call. No-op outside a tracked scope. */
export declare function recordUsage(inputTokens: number, outputTokens: number, latencyMs: number): void;
