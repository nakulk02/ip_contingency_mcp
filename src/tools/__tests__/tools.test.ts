import { setLLMClient } from "../../utils/llm-client.js";
import { makeFakeLLM } from "../../utils/__test-helpers__/fake-llm.js";
import { makeGap } from "../../utils/__test-helpers__/fixtures.js";
import { recommendActions } from "../recommend-actions.js";
import { detectAnomalies } from "../detect-anomalies.js";
import { rankPriorities } from "../rank-priorities.js";
import { processTool } from "../../index.js";

describe("tools with a mocked LLM", () => {
  afterEach(() => setLLMClient(undefined));

  it("recommendActions attaches the gap id to the model output", async () => {
    setLLMClient(
      makeFakeLLM([
        {
          parsed_output: {
            priority: "HIGH",
            reason: "Filed patent, former employee",
            actions: ["Contact inventor"],
            timeline: "2 weeks",
          },
        },
      ]).client
    );

    const res = await recommendActions({ gap: makeGap({ id: "gap-42" }) });
    expect(res.success).toBe(true);
    expect(res.data).toMatchObject({ gapId: "gap-42", priority: "HIGH" });
  });

  it("detectAnomalies unwraps the anomalies array and assigns ids", async () => {
    setLLMClient(
      makeFakeLLM([
        {
          parsed_output: {
            anomalies: [
              {
                type: "unusual_delay",
                subject: "Ada Lovelace",
                description: "400 days overdue",
                severity: "CRITICAL",
                evidence: "daysOverdue=400",
                suggestedAction: "Escalate",
              },
            ],
          },
        },
      ]).client
    );

    const res = await detectAnomalies({ gaps: [makeGap({ daysOverdue: 400 })] });
    expect(res.success).toBe(true);
    expect(res.data).toHaveLength(1);
    expect(res.data![0].id).toBe("anomaly-1");
  });

  it("rankPriorities fails cleanly when the model invents a gap id", async () => {
    setLLMClient(
      makeFakeLLM([
        {
          parsed_output: {
            ranked: [
              {
                gapId: "nope",
                priorityScore: 90,
                urgencyFactors: [],
                estimatedResolutionTime: "1w",
              },
            ],
            methodology: "m",
          },
        },
      ]).client
    );

    const res = await rankPriorities({ gaps: [makeGap()] });
    expect(res.success).toBe(false);
    expect(res.error).toMatch(/INVALID_INPUT/);
  });

  it("processTool attaches usage and duration", async () => {
    setLLMClient(
      makeFakeLLM([
        {
          parsed_output: {
            compliant: false,
            severity: "CRITICAL",
            issues: ["No assignment"],
            recommendations: ["Sign one"],
          },
        },
      ]).client
    );

    const res = await processTool({ tool: "checkCompliance", input: { gap: makeGap() } });
    expect(res.success).toBe(true);
    expect(res.data.jurisdiction).toBe("US");
    expect(res.usage).toMatchObject({ llmCalls: 1, inputTokens: 120, outputTokens: 40 });
    expect(typeof res.usage!.durationMs).toBe("number");
  });
});
