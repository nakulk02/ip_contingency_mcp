import { callLLMJSON } from "../utils/llm-client.js";
import { getPrompt } from "../prompts/index.js";
import { formatGapsForAnalysis, sortByDaysOverdue, calculateGapStatistics, } from "../utils/data-formatter.js";
import { ToolInputError } from "../utils/errors.js";
import { toToolResponse } from "../utils/tool-response.js";
/**
 * Detect anomalies and red flags in gaps
 */
export async function detectAnomalies(input) {
    try {
        const { gaps, context = {} } = input;
        if (!gaps || gaps.length === 0) {
            throw new ToolInputError("No gaps provided for anomaly detection");
        }
        // Sort by days overdue to highlight extreme cases
        const sortedGaps = sortByDaysOverdue(gaps);
        const formattedGaps = formatGapsForAnalysis(sortedGaps.slice(0, 20)); // Top 20 most overdue
        const statistics = calculateGapStatistics(gaps);
        const contextInfo = context.typicalAssignmentTime
            ? `\nContext: Typical assignment time is ${context.typicalAssignmentTime} days. Company age: ${context.companyAge || "unknown"} years.`
            : "";
        const userMessage = `
Detect anomalies in these IP assignment gaps:

${formattedGaps}

OVERALL STATISTICS:
${JSON.stringify(statistics, null, 2)}

TOTAL GAPS ANALYZED: ${gaps.length}${contextInfo}

Identify any unusual patterns, suspicious delays, compliance violations, or risk spikes.
    `.trim();
        const results = await callLLMJSON(userMessage, getPrompt("DETECT_ANOMALIES"), {
            maxTokens: 2000,
        });
        // Ensure it's an array
        const anomalies = Array.isArray(results) ? results : [results];
        return {
            success: true,
            data: anomalies,
            reasoning: "Detected anomalies using pattern analysis",
            timestamp: new Date(),
        };
    }
    catch (error) {
        return toToolResponse(error);
    }
}
export default detectAnomalies;
