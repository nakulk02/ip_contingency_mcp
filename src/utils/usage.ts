import { AsyncLocalStorage } from "node:async_hooks";

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

const storage = new AsyncLocalStorage<ToolUsage>();

export function emptyUsage(): ToolUsage {
  return { llmCalls: 0, inputTokens: 0, outputTokens: 0, llmLatencyMs: 0 };
}

/** Run `fn` with a fresh usage accumulator and return its result together with the usage. */
export async function withUsageTracking<T>(
  fn: () => Promise<T>
): Promise<{ result: T; usage: ToolUsage }> {
  const usage = emptyUsage();
  const result = await storage.run(usage, fn);
  return { result, usage };
}

/** Called by the LLM client after each API call. No-op outside a tracked scope. */
export function recordUsage(inputTokens: number, outputTokens: number, latencyMs: number): void {
  const usage = storage.getStore();
  if (!usage) return;
  usage.llmCalls += 1;
  usage.inputTokens += inputTokens;
  usage.outputTokens += outputTokens;
  usage.llmLatencyMs += latencyMs;
}
