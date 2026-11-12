import { z } from "zod";
import { callLLMJSON, callLLM, setLLMClient } from "../llm-client.js";
import { LLMResponseError } from "../errors.js";
import { withUsageTracking } from "../usage.js";
import { makeFakeLLM } from "../__test-helpers__/fake-llm.js";

const Schema = z.object({ answer: z.string(), score: z.number() });

describe("callLLMJSON", () => {
  afterEach(() => setLLMClient(undefined));

  it("returns validated structured output", async () => {
    const fake = makeFakeLLM([{ parsed_output: { answer: "yes", score: 3 } }]);
    setLLMClient(fake.client);

    await expect(callLLMJSON("q", "sys", Schema)).resolves.toEqual({ answer: "yes", score: 3 });
    expect(fake.calls).toHaveLength(1);
  });

  it("retries once when the output fails validation, including the error", async () => {
    const fake = makeFakeLLM([
      { parsed_output: { answer: "yes" } },
      { parsed_output: { answer: "yes", score: 1 } },
    ]);
    setLLMClient(fake.client);

    await expect(callLLMJSON("q", "sys", Schema)).resolves.toEqual({ answer: "yes", score: 1 });
    expect(fake.calls).toHaveLength(2);
    expect(fake.calls[1].params.messages[0].content).toContain("failed validation");
    expect(fake.calls[1].params.messages[0].content).toContain("score");
  });

  it("throws LLMResponseError after a second invalid output", async () => {
    const fake = makeFakeLLM([{ parsed_output: null }, { parsed_output: { score: "x" } }]);
    setLLMClient(fake.client);

    await expect(callLLMJSON("q", "sys", Schema)).rejects.toBeInstanceOf(LLMResponseError);
    expect(fake.calls).toHaveLength(2);
  });

  it("treats a max_tokens cut-off as an error", async () => {
    const fake = makeFakeLLM([{ parsed_output: null, stop_reason: "max_tokens" }]);
    setLLMClient(fake.client);

    await expect(callLLMJSON("q", "sys", Schema)).rejects.toThrow(/max_tokens/);
  });

  it("records token usage for the enclosing tool call", async () => {
    const fake = makeFakeLLM([
      { parsed_output: { answer: "a" } },
      { parsed_output: { answer: "a", score: 2 } },
    ]);
    setLLMClient(fake.client);

    const { usage } = await withUsageTracking(() => callLLMJSON("q", "sys", Schema));
    expect(usage).toMatchObject({ llmCalls: 2, inputTokens: 240, outputTokens: 80 });
  });
});

describe("callLLM", () => {
  afterEach(() => setLLMClient(undefined));

  it("returns the text content", async () => {
    setLLMClient(makeFakeLLM([{ text: "hello" }]).client);
    await expect(callLLM("q", "sys")).resolves.toBe("hello");
  });
});
