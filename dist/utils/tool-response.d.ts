import { ToolResponse } from "../types/index.js";
/**
 * Converts any thrown error into a standardized failed ToolResponse.
 * Known ToolError subclasses contribute a stable error code; anything
 * else is reported as an unexpected internal error.
 */
export declare function toToolResponse<T>(error: unknown): ToolResponse<T>;
