/**
 * Base class for all known, expected errors within tool execution.
 * Anything thrown that is NOT a ToolError is treated as unexpected
 * and reported with a generic message.
 */
export class ToolError extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

/** Thrown when required tool input is missing or invalid. */
export class ToolInputError extends ToolError {
  constructor(message: string) {
    super(message, "INVALID_INPUT");
  }
}

/** Thrown when the underlying LLM API call itself fails (auth, rate limit, network, timeout). */
export class LLMRequestError extends ToolError {
  constructor(message: string) {
    super(message, "LLM_REQUEST_FAILED");
  }
}

/** Thrown when the LLM responds but the response can't be parsed into the expected shape. */
export class LLMResponseError extends ToolError {
  constructor(message: string) {
    super(message, "LLM_RESPONSE_INVALID");
  }
}
