import Anthropic from "@anthropic-ai/sdk";
import type { z } from "zod";
export declare const DEFAULT_MODEL = "claude-sonnet-5";
/** Minimal surface of the Anthropic client used here, so tests can inject a fake. */
export interface MessagesClient {
    messages: {
        create: Anthropic["messages"]["create"];
        parse: Anthropic["messages"]["parse"];
    };
}
/** Replace the Anthropic client (used by tests). Pass undefined to reset. */
export declare function setLLMClient(fake: MessagesClient | undefined): void;
export interface MessageParams {
    model?: string;
    maxTokens?: number;
}
/**
 * Call the LLM and return its text response.
 */
export declare function callLLM(userMessage: string, systemPrompt: string, params?: MessageParams): Promise<string>;
/**
 * Call the LLM with a structured-output schema and return a validated object.
 *
 * The schema is sent as `output_config.format`, so the API constrains the
 * response to valid JSON for that schema. The parsed result is then validated
 * again with Zod. If validation fails, the call is retried once with the
 * validation error included, and a second failure raises LLMResponseError.
 */
export declare function callLLMJSON<S extends z.ZodType>(userMessage: string, systemPrompt: string, schema: S, params?: MessageParams): Promise<z.infer<S>>;
