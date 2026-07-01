import { ToolError, ToolInputError, LLMRequestError, LLMResponseError } from "../errors.js";

describe("ToolError", () => {
  it("sets message and code, and is an instance of Error", () => {
    const err = new ToolError("something went wrong", "SOME_CODE");
    expect(err.message).toBe("something went wrong");
    expect(err.code).toBe("SOME_CODE");
    expect(err).toBeInstanceOf(Error);
  });

  it("sets name to the concrete subclass name", () => {
    const err = new ToolInputError("bad input");
    expect(err.name).toBe("ToolInputError");
  });
});

describe("ToolInputError", () => {
  it("uses the INVALID_INPUT code", () => {
    const err = new ToolInputError("No gaps provided");
    expect(err.code).toBe("INVALID_INPUT");
    expect(err.message).toBe("No gaps provided");
    expect(err).toBeInstanceOf(ToolError);
  });
});

describe("LLMRequestError", () => {
  it("uses the LLM_REQUEST_FAILED code", () => {
    const err = new LLMRequestError("API call failed: timeout");
    expect(err.code).toBe("LLM_REQUEST_FAILED");
    expect(err).toBeInstanceOf(ToolError);
  });
});

describe("LLMResponseError", () => {
  it("uses the LLM_RESPONSE_INVALID code", () => {
    const err = new LLMResponseError("No JSON object found in LLM response");
    expect(err.code).toBe("LLM_RESPONSE_INVALID");
    expect(err).toBeInstanceOf(ToolError);
  });
});
