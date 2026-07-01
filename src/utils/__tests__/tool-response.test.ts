import { toToolResponse } from "../tool-response.js";
import { ToolInputError, LLMRequestError } from "../errors.js";

describe("toToolResponse", () => {
  it("converts a ToolError subclass into a failed response with its code prefixed", () => {
    const result = toToolResponse(new ToolInputError("No gap provided"));
    expect(result.success).toBe(false);
    expect(result.error).toBe("INVALID_INPUT: No gap provided");
    expect(result.timestamp).toBeInstanceOf(Date);
  });

  it("preserves the code for a different ToolError subclass", () => {
    const result = toToolResponse(new LLMRequestError("LLM API call failed: timeout"));
    expect(result.error).toBe("LLM_REQUEST_FAILED: LLM API call failed: timeout");
  });

  it("wraps a plain Error as UNEXPECTED_ERROR", () => {
    const result = toToolResponse(new Error("something exploded"));
    expect(result.success).toBe(false);
    expect(result.error).toBe("UNEXPECTED_ERROR: something exploded");
  });

  it("wraps a non-Error thrown value as UNEXPECTED_ERROR", () => {
    const result = toToolResponse("just a string");
    expect(result.error).toBe("UNEXPECTED_ERROR: just a string");
  });

  it("always sets success to false", () => {
    const result = toToolResponse(new Error("x"));
    expect(result.success).toBe(false);
  });
});
