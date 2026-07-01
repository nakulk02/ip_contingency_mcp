import { ToolResponse } from "../types/index.js";
import { ToolError } from "./errors.js";

/**
 * Converts any thrown error into a standardized failed ToolResponse.
 * Known ToolError subclasses contribute a stable error code; anything
 * else is reported as an unexpected internal error.
 */
export function toToolResponse<T>(error: unknown): ToolResponse<T> {
  if (error instanceof ToolError) {
    return {
      success: false,
      error: `${error.code}: ${error.message}`,
      timestamp: new Date(),
    };
  }

  const message = error instanceof Error ? error.message : String(error);
  return {
    success: false,
    error: `UNEXPECTED_ERROR: ${message}`,
    timestamp: new Date(),
  };
}
