import { callLLMJSON } from "../utils/llm-client.js";
import { getPrompt } from "../prompts/index.js";
import { formatGapsForAnalysis, sortByRiskScore } from "../utils/data-formatter.js";
import { ToolInputError } from "../utils/errors.js";
import { toToolResponse } from "../utils/tool-response.js";
/**
 * Rank gaps by strategic priority
 */
export async function rankPriorities(input) {
    try {
        const { gaps } = input;
        if (!gaps || gaps.length === 0) {
            throw new ToolInputError("No gaps provided for ranking");
        }
        const sortedByRisk = sortByRiskScore(gaps);
        const formattedGaps = formatGapsForAnalysis(sortedByRisk);
        const userMessage = `
Rank these IP assignment gaps by strategic priority.

Consider:
1. Legal urgency (compliance deadlines)
2. Financial impact (asset value)
3. Deadline proximity
4. Complexity
5. Likelihood of issues

${formattedGaps}

Provide priority scores (1-100) and explain reasoning.
    `.trim();
        const rankingResult = await callLLMJSON(userMessage, getPrompt("RANK_PRIORITIES"), { maxTokens: 2000 });
        // Combine ranking with original gap data
        const ranked = rankingResult.ranked.map((item, idx) => {
            const gap = gaps.find((g) => g.id === item.gapId);
            if (!gap)
                throw new ToolInputError(`Gap ${item.gapId} not found in provided gaps`);
            return {
                ...gap,
                priorityScore: item.priorityScore,
                priorityRank: idx + 1,
                urgencyFactors: item.urgencyFactors,
                estimatedResolutionTime: item.estimatedResolutionTime,
            };
        });
        return {
            success: true,
            data: ranked,
            reasoning: rankingResult.methodology,
            timestamp: new Date(),
        };
    }
    catch (error) {
        return toToolResponse(error);
    }
}
export default rankPriorities;
