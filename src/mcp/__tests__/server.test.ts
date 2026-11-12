import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createMcpServer } from "../create-server.js";
import { setLLMClient } from "../../utils/llm-client.js";
import { makeFakeLLM } from "../../utils/__test-helpers__/fake-llm.js";
import { makeGap } from "../../utils/__test-helpers__/fixtures.js";

const EXPECTED_TOOLS = [
  "analyzeGaps",
  "recommendActions",
  "detectAnomalies",
  "generateAdvisory",
  "rankPriorities",
  "queryAssignments",
  "checkCompliance",
  "predictRisk",
];

async function connect() {
  const server = createMcpServer();
  const client = new Client({ name: "test-client", version: "1.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return { server, client };
}

describe("MCP server", () => {
  afterEach(() => setLLMClient(undefined));

  it("lists all 8 tools with descriptions and input schemas", async () => {
    const { client, server } = await connect();
    const { tools } = await client.listTools();

    expect(tools.map((t) => t.name).sort()).toEqual([...EXPECTED_TOOLS].sort());
    for (const tool of tools) {
      expect(tool.description).toBeTruthy();
      expect(tool.inputSchema.type).toBe("object");
    }
    const analyze = tools.find((t) => t.name === "analyzeGaps")!;
    expect(analyze.inputSchema.required).toContain("gaps");

    await client.close();
    await server.close();
  });

  it("runs analyzeGaps through tools/call with the LLM mocked", async () => {
    const analysis = {
      patterns: ["All CN patents lack signed assignments"],
      riskAreas: ["China"],
      recommendations: ["Collect assignments from CN inventors"],
      summary: "Two gaps, both in CN.",
    };
    const fake = makeFakeLLM([{ parsed_output: analysis }]);
    setLLMClient(fake.client);

    const { client, server } = await connect();
    const gaps = [makeGap({ jurisdiction: "CN" }), makeGap({ id: "gap-2", jurisdiction: "CN" })];
    // Dates are serialised to strings on the wire, as a real MCP client would send them.
    const result = await client.callTool({
      name: "analyzeGaps",
      arguments: JSON.parse(JSON.stringify({ gaps })),
    });

    expect(result.isError).toBeFalsy();
    const structured = result.structuredContent as any;
    expect(structured.data).toEqual(analysis);
    expect(structured.usage).toMatchObject({ llmCalls: 1, inputTokens: 120, outputTokens: 40 });

    // The request asked for structured output rather than free text.
    expect(fake.calls).toHaveLength(1);
    expect(fake.calls[0].kind).toBe("parse");
    expect(fake.calls[0].params.output_config.format.type).toBe("json_schema");

    await client.close();
    await server.close();
  });

  it("rejects invalid arguments without calling the LLM", async () => {
    const fake = makeFakeLLM([]);
    setLLMClient(fake.client);

    const { client, server } = await connect();
    const result = await client.callTool({ name: "analyzeGaps", arguments: { gaps: [] } });

    expect(result.isError).toBe(true);
    expect(fake.calls).toHaveLength(0);

    await client.close();
    await server.close();
  });
});
