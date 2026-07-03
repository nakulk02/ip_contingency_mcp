import Anthropic from "@anthropic-ai/sdk";
import { LLMRequestError, LLMResponseError } from "./errors.js";
const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});
/**
 * Call LLM API for analysis
 */
export async function callLLM(userMessage, systemPrompt, params = {}) {
    const { model = "claude-sonnet-5", maxTokens = 2000 } = params;
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
    }
    catch (error) {
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
export async function callLLMJSON(userMessage, systemPrompt, params = {}) {
    const response = await callLLM(userMessage, systemPrompt, params);
    try {
        // Extract JSON from response (handle markdown code blocks)
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new LLMResponseError("No JSON object found in LLM response");
        }
        return JSON.parse(jsonMatch[0]);
    }
    catch (error) {
        if (error instanceof LLMResponseError) {
            throw error;
        }
        const detail = error instanceof Error ? error.message : String(error);
        throw new LLMResponseError(`Failed to parse JSON from LLM response: ${detail}`);
    }
}
export default client;
