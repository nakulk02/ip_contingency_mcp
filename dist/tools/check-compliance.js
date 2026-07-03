import { callLLMJSON } from "../utils/llm-client.js";
import { getPrompt } from "../prompts/index.js";
import { formatGapForAnalysis } from "../utils/data-formatter.js";
import { ToolInputError } from "../utils/errors.js";
import { toToolResponse } from "../utils/tool-response.js";
/**
 * Check compliance of a gap against jurisdiction rules
 */
export async function checkCompliance(input) {
    try {
        const { gap } = input;
        if (!gap) {
            throw new ToolInputError("No gap provided");
        }
        const formattedGap = formatGapForAnalysis(gap);
        const userMessage = `
Check IP assignment compliance for this gap:

${formattedGap}

Jurisdiction: ${gap.jurisdiction}
Asset Type: ${gap.assetType}
Asset Status: ${gap.assetStatus}

Analyze against jurisdiction-specific requirements and provide compliance status.
    `.trim();
        const result = await callLLMJSON(userMessage, getPrompt("CHECK_COMPLIANCE"), { maxTokens: 1500 });
        // Ensure jurisdiction is set
        result.jurisdiction = gap.jurisdiction;
        return {
            success: true,
            data: result,
            reasoning: "Analyzed compliance against jurisdiction rules",
            timestamp: new Date(),
        };
    }
    catch (error) {
        return toToolResponse(error);
    }
}
export default checkCompliance;
