/**
 * Base class for all known, expected errors within tool execution.
 * Anything thrown that is NOT a ToolError is treated as unexpected
 * and reported with a generic message.
 */
export declare class ToolError extends Error {
    readonly code: string;
    constructor(message: string, code: string);
}
/** Thrown when required tool input is missing or invalid. */
export declare class ToolInputError extends ToolError {
    constructor(message: string);
}
/** Thrown when the underlying LLM API call itself fails (auth, rate limit, network, timeout). */
export declare class LLMRequestError extends ToolError {
    constructor(message: string);
}
/** Thrown when the LLM responds but the response can't be parsed into the expected shape. */
export declare class LLMResponseError extends ToolError {
    constructor(message: string);
}
