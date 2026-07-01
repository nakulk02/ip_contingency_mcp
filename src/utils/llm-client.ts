import Anthropic from "@anthropic-ai/sdk";
import { LLMRequestError, LLMResponseError } from "./errors.js";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface MessageParams {
  model?: string;
  maxTokens?: number;
  systemPrompt?: string;
}

/**
 * Call LLM API for analysis
 */
export async function callLLM(
  userMessage: string,
  systemPrompt: string,
  params: MessageParams = {}
): Promise<string> {
  const { model = "claude-opus-4-6", maxTokens = 2000 } = params;

  let message;
  try {
    message = await client.messages.create({
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
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new LLMRequestError(`LLM API call failed: ${detail}`);
  }

  const content = message.content[0];
  if (content.type === "text") {
    return content.text;
  }

  throw new LLMResponseError("Unexpected response format from LLM");
}

/**
 * Call LLM API and parse JSON response
 */
export async function callLLMJSON<T>(
  userMessage: string,
  systemPrompt: string,
  params: MessageParams = {}
): Promise<T> {
  const response = await callLLM(userMessage, systemPrompt, params);

  try {
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new LLMResponseError("No JSON object found in LLM response");
    }
    return JSON.parse(jsonMatch[0]) as T;
  } catch (error) {
    if (error instanceof LLMResponseError) {
      throw error;
    }
    const detail = error instanceof Error ? error.message : String(error);
    throw new LLMResponseError(`Failed to parse JSON from LLM response: ${detail}`);
  }
}

export default client;
