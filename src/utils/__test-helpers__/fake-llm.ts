import type { MessagesClient } from "../llm-client.js";

export interface FakeCall {
  kind: "create" | "parse";
  params: any;
}

/**
 * A stand-in for the Anthropic client. Each queued response is returned by
 * the next messages.parse / messages.create call, in order.
 */
export function makeFakeLLM(
  responses: Array<Partial<{ parsed_output: unknown; text: string; stop_reason: string }>>
) {
  const calls: FakeCall[] = [];
  const queue = [...responses];

  const next = (kind: FakeCall["kind"], params: any) => {
    calls.push({ kind, params });
    const r = queue.shift();
    if (!r) throw new Error("Fake LLM: no more queued responses");
    return Promise.resolve({
      id: `msg_${calls.length}`,
      type: "message",
      role: "assistant",
      model: params.model,
      content: r.text !== undefined ? [{ type: "text", text: r.text }] : [],
      stop_reason: r.stop_reason ?? "end_turn",
      usage: { input_tokens: 120, output_tokens: 40 },
      parsed_output: r.parsed_output ?? null,
    });
  };

  const client = {
    messages: {
      create: (params: any) => next("create", params),
      parse: (params: any) => next("parse", params),
    },
  } as unknown as MessagesClient;

  return { client, calls };
}
