import { AsyncLocalStorage } from "node:async_hooks";
const storage = new AsyncLocalStorage();
export function emptyUsage() {
    return { llmCalls: 0, inputTokens: 0, outputTokens: 0, llmLatencyMs: 0 };
}
/** Run `fn` with a fresh usage accumulator and return its result together with the usage. */
export async function withUsageTracking(fn) {
    const usage = emptyUsage();
    const result = await storage.run(usage, fn);
    return { result, usage };
}
/** Called by the LLM client after each API call. No-op outside a tracked scope. */
export function recordUsage(inputTokens, outputTokens, latencyMs) {
    const usage = storage.getStore();
    if (!usage)
        return;
    usage.llmCalls += 1;
    usage.inputTokens += inputTokens;
    usage.outputTokens += outputTokens;
    usage.llmLatencyMs += latencyMs;
}
