import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { z } from "zod";
import { LLMRequestError, LLMResponseError } from "./errors.js";
import { logger } from "./logger.js";
import { recordUsage } from "./usage.js";

export const DEFAULT_MODEL = "claude-sonnet-5";
const DEFAULT_MAX_TOKENS = 8000;

/** Minimal surface of the Anthropic client used here, so tests can inject a fake. */
export interface MessagesClient {
  messages: {
    create: Anthropic["messages"]["create"];
    parse: Anthropic["messages"]["parse"];
  };
}

let client: MessagesClient | undefined;

/**
 * The client is created lazily so that dotenv (loaded by the entry points)
 * has populated ANTHROPIC_API_KEY before the SDK reads it.
 */
function getClient(): MessagesClient {
  if (!client) client = new Anthropic();
  return client;
}

/** Replace the Anthropic client (used by tests). Pass undefined to reset. */
export function setLLMClient(fake: MessagesClient | undefined): void {
  client = fake;
}

export interface MessageParams {
  model?: string;
  maxTokens?: number;
}

function resolveModel(params: MessageParams): string {
  return params.model ?? process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL;
}

function logUsage(kind: string, model: string, message: Anthropic.Message, latencyMs: number) {
  const inputTokens = message.usage?.input_tokens ?? 0;
  const outputTokens = message.usage?.output_tokens ?? 0;
  recordUsage(inputTokens, outputTokens, latencyMs);
  logger.info(
    { kind, model, inputTokens, outputTokens, latencyMs, stopReason: message.stop_reason },
    "LLM call completed"
  );
}

function checkStopReason(message: Anthropic.Message): void {
  if (message.stop_reason === "max_tokens") {
    throw new LLMResponseError("LLM response was cut off at max_tokens");
  }
  if (message.stop_reason === "refusal") {
    throw new LLMResponseError("LLM declined to answer this request");
  }
}

function wrapRequestError(error: unknown): never {
  const detail = error instanceof Error ? error.message : String(error);
  throw new LLMRequestError(`LLM API call failed: ${detail}`);
}

/**
 * Call the LLM and return its text response.
 */
export async function callLLM(
  userMessage: string,
  systemPrompt: string,
  params: MessageParams = {}
): Promise<string> {
  const model = resolveModel(params);
  const start = Date.now();

  let message: Anthropic.Message;
  try {
    message = await getClient().messages.create({
      model,
      max_tokens: params.maxTokens ?? DEFAULT_MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });
  } catch (error) {
    wrapRequestError(error);
  }

  logUsage("text", model, message, Date.now() - start);
  checkStopReason(message);

  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  if (!text) throw new LLMResponseError("LLM returned no text content");
  return text;
}

/**
 * Call the LLM with a structured-output schema and return a validated object.
 *
 * The schema is sent as `output_config.format`, so the API constrains the
 * response to valid JSON for that schema. The parsed result is then validated
 * again with Zod. If validation fails, the call is retried once with the
 * validation error included, and a second failure raises LLMResponseError.
 */
export async function callLLMJSON<S extends z.ZodType>(
  userMessage: string,
  systemPrompt: string,
  schema: S,
  params: MessageParams = {}
): Promise<z.infer<S>> {
  const model = resolveModel(params);
  const maxAttempts = 2;
  let lastError = "";

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const messages: Anthropic.MessageParam[] = [{ role: "user", content: userMessage }];
    if (lastError) {
      messages[0] = {
        role: "user",
        content: `${userMessage}\n\nA previous answer failed validation (${lastError}). Return output that matches the required schema exactly.`,
      };
    }

    const start = Date.now();
    let message;
    try {
      message = await getClient().messages.parse({
        model,
        max_tokens: params.maxTokens ?? DEFAULT_MAX_TOKENS,
        system: systemPrompt,
        messages,
        output_config: { format: zodOutputFormat(schema) },
      });
    } catch (error) {
      if (error instanceof Anthropic.APIError) wrapRequestError(error);
      // Anything else is the SDK failing to parse the response body.
      lastError = error instanceof Error ? error.message : String(error);
      logger.warn({ attempt, model, err: lastError }, "Structured output could not be parsed");
      continue;
    }

    logUsage("structured", model, message, Date.now() - start);
    checkStopReason(message);

    const validated = schema.safeParse(message.parsed_output);
    if (validated.success) return validated.data;

    lastError = validated.error.issues
      .slice(0, 3)
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ");
    logger.warn({ attempt, model, err: lastError }, "Structured output failed schema validation");
  }

  throw new LLMResponseError(`LLM output failed schema validation after retry: ${lastError}`);
}
