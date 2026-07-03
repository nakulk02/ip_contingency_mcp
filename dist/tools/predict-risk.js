import { callLLMJSON } from "../utils/llm-client.js";
import { getPrompt } from "../prompts/index.js";
import { formatGapForAnalysis } from "../utils/data-formatter.js";
import { ToolInputError } from "../utils/errors.js";
import { toToolResponse } from "../utils/tool-response.js";
/**
 * Predict likely outcome for a gap
 */
export async function predictRisk(input) {
    try {
        const { gap, historicalContext = {} } = input;
        if (!gap) {
            throw new ToolInputError("No gap provided");
        }
        const formattedGap = formatGapForAnalysis(gap);
        const contextInfo = historicalContext.similarGaps
            ? `\nContext: ${historicalContext.similarGaps.length} similar gaps tracked. Success rate: ${historicalContext.successRate || "unknown"}%. Avg resolution time: ${historicalContext.avgResolutionDays || "unknown"} days.`
            : "";
        const userMessage = `
Predict the likely outcome for this IP assignment gap:

${formattedGap}${contextInfo}

Based on the characteristics, predict whether this gap will likely:
1. Be resolved successfully
2. Be at risk of non-resolution
3. Likely fail to resolve

Provide confidence level and reasoning.
    `.trim();
        const result = await callLLMJSON(userMessage, getPrompt("PREDICT_RISK"), {
            maxTokens: 1500,
        });
        // Ensure gapId is set
        result.gapId = gap.id;
        return {
            success: true,
            data: result,
            reasoning: "Predicted outcome based on gap characteristics",
            timestamp: new Date(),
        };
    }
    catch (error) {
        return toToolResponse(error);
    }
}
export default predictRisk;
