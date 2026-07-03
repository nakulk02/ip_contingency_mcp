import { callLLMJSON } from "../utils/llm-client.js";
import { getPrompt } from "../prompts/index.js";
import { formatGapForAnalysis } from "../utils/data-formatter.js";
import { ToolInputError } from "../utils/errors.js";
import { toToolResponse } from "../utils/tool-response.js";
/**
 * Generate recommendations for resolving a specific gap
 */
export async function recommendActions(input) {
    try {
        const { gap } = input;
        if (!gap) {
            throw new ToolInputError("No gap provided");
        }
        const formattedGap = formatGapForAnalysis(gap);
        const userMessage = `
Generate recommendations to resolve this IP assignment gap:

${formattedGap}

Provide specific, actionable recommendations for next steps.
    `.trim();
        const result = await callLLMJSON(userMessage, getPrompt("RECOMMEND_ACTIONS"), {
            maxTokens: 1500,
        });
        // Ensure gapId is included
        result.gapId = gap.id;
        return {
            success: true,
            data: result,
            reasoning: "Generated recommendations based on gap analysis",
            timestamp: new Date(),
        };
    }
    catch (error) {
        return toToolResponse(error);
    }
}
export default recommendActions;
