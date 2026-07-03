import Anthropic from "@anthropic-ai/sdk";
declare const client: Anthropic;
export interface MessageParams {
    model?: string;
    maxTokens?: number;
    systemPrompt?: string;
}
/**
 * Call LLM API for analysis
 */
export declare function callLLM(userMessage: string, systemPrompt: string, params?: MessageParams): Promise<string>;
/**
 * Call LLM API and parse JSON response
 */
export declare function callLLMJSON<T>(userMessage: string, systemPrompt: string, params?: MessageParams): Promise<T>;
export default client;
