import { callLLMJSON } from "../utils/llm-client.js";
import { getPrompt } from "../prompts/index.js";
import { AssignmentGap, QueryResult, ToolResponse } from "../types/index.js";
import { ToolInputError } from "../utils/errors.js";
import { toToolResponse } from "../utils/tool-response.js";

interface QueryInput {
  question: string;
  gaps: AssignmentGap[];
}

interface QueryInterpretation {
  interpretation: string;
  filters: {
    jurisdiction?: string[];
    assetType?: ("PATENT" | "TRADEMARK")[];
    riskLevel?: ("LOW" | "MEDIUM" | "HIGH" | "CRITICAL")[];
    personStatus?: "current" | "former" | "either";
  };
  explanation: string;
}

/**
 * Query gaps using natural language
 */
export async function queryAssignments(input: QueryInput): Promise<ToolResponse<QueryResult>> {
  try {
    const { question, gaps } = input;

    if (!question || !gaps) {
      throw new ToolInputError("Question and gaps required");
    }

    // First, ask LLM to interpret the question
    const interpretation = await callLLMJSON<QueryInterpretation>(
      `User question about IP assignments: "${question}"`,
      getPrompt("QUERY_ASSIGNMENTS"),
      { maxTokens: 1000 }
    );

    // Apply filters to gaps
    let filtered = [...gaps];

    if (interpretation.filters.jurisdiction && interpretation.filters.jurisdiction.length > 0) {
      filtered = filtered.filter((g) =>
        interpretation.filters.jurisdiction!.includes(g.jurisdiction)
      );
    }

    if (interpretation.filters.assetType && interpretation.filters.assetType.length > 0) {
      filtered = filtered.filter((g) => interpretation.filters.assetType!.includes(g.assetType));
    }

    if (interpretation.filters.riskLevel && interpretation.filters.riskLevel.length > 0) {
      filtered = filtered.filter((g) => interpretation.filters.riskLevel!.includes(g.riskLevel));
    }

    if (interpretation.filters.personStatus === "current") {
      filtered = filtered.filter((g) => !g.personEndDate);
    } else if (interpretation.filters.personStatus === "former") {
      filtered = filtered.filter((g) => !!g.personEndDate);
    }

    const result: QueryResult = {
      count: filtered.length,
      results: filtered,
      explanation: interpretation.explanation,
    };

    return {
      success: true,
      data: result,
      reasoning: `Interpreted question and applied filters: ${interpretation.interpretation}`,
      timestamp: new Date(),
    };
  } catch (error) {
    return toToolResponse<QueryResult>(error);
  }
}

export default queryAssignments;
