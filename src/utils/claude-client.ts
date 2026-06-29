import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface MessageParams {
  model?: string;
  maxTokens?: number;
  systemPrompt?: string;
}

/**
 * Call Claude API for analysis
 */
export async function callClaude(
  userMessage: string,
  systemPrompt: string,
  params: MessageParams = {}
): Promise<string> {
  const {
    model = "claude-opus-4-6",
    maxTokens = 2000,
  } = params;

  const message = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === "text") {
    return content.text;
  }

  throw new Error("Unexpected response format from Claude");
}

/**
 * Call Claude API and parse JSON response
 */
export async function callClaudeJSON<T>(
  userMessage: string,
  systemPrompt: string,
  params: MessageParams = {}
): Promise<T> {
  const response = await callClaude(userMessage, systemPrompt, params);

  try {
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }
    return JSON.parse(jsonMatch[0]) as T;
  } catch (error) {
    console.error("Failed to parse JSON response:", response);
    throw error;
  }
}

export default client;
