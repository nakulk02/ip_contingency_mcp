import { callLLMJSON } from "../utils/llm-client.js";
import { getPrompt } from "../prompts/index.js";
import { AssignmentGap, AdvisoryReport, ToolResponse } from "../types/index.js";
import { AdvisoryOutputSchema } from "../schemas/index.js";
import {
  formatGapsForAnalysis,
  getCriticalGaps,
  getHighRiskJurisdictionGaps,
  calculateGapStatistics,
} from "../utils/data-formatter.js";
import { ToolInputError } from "../utils/errors.js";
import { toToolResponse } from "../utils/tool-response.js";

interface AdvisoryInput {
  gaps: AssignmentGap[];
  companyContext?: {
    name?: string;
    industry?: string;
  };
}

/**
 * Generate executive advisory report
 */
export async function generateAdvisory(
  input: AdvisoryInput
): Promise<ToolResponse<AdvisoryReport>> {
  try {
    const { gaps, companyContext = {} } = input;

    if (!gaps || gaps.length === 0) {
      throw new ToolInputError("No gaps provided for advisory generation");
    }

    const statistics = calculateGapStatistics(gaps);
    const criticalGaps = getCriticalGaps(gaps);
    const highRiskJurisdictionGaps = getHighRiskJurisdictionGaps(gaps);

    const formattedGaps = formatGapsForAnalysis(gaps.slice(0, 15)); // Top 15 for advisory

    const userMessage = `
Generate an executive advisory report for IP assignment gaps.

COMPANY: ${companyContext.name || "Unnamed Company"}
INDUSTRY: ${companyContext.industry || "Unknown"}

STATISTICS:
${JSON.stringify(statistics, null, 2)}

CRITICAL GAPS: ${criticalGaps.length}
HIGH-RISK JURISDICTION GAPS: ${highRiskJurisdictionGaps.length}

TOP GAPS FOR REVIEW:
${formattedGaps}

Write a professional advisory report covering an executive summary, a risk narrative,
prioritised action items, a timeline and the financial impact (if quantifiable).

Use clear, concise language suitable for legal review.
    `.trim();

    const advisory = await callLLMJSON(
      userMessage,
      getPrompt("GENERATE_ADVISORY"),
      AdvisoryOutputSchema
    );

    const report: AdvisoryReport = {
      generatedAt: new Date(),
      title: "IP Assignment Compliance Advisory",
      ...advisory,
      actionItems: [...advisory.actionItems].sort((x, y) => x.priority - y.priority),
      keyMetrics: statistics,
    };

    return {
      success: true,
      data: report,
      reasoning: "Generated comprehensive advisory report",
      timestamp: new Date(),
    };
  } catch (error) {
    return toToolResponse<AdvisoryReport>(error);
  }
}

export default generateAdvisory;
