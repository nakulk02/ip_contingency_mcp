/**
 * System Prompts for MCP Tools
 * Each prompt is crafted for specific intelligence task
 */
export declare const PROMPTS: {
    ANALYZE_GAPS: string;
    RECOMMEND_ACTIONS: string;
    DETECT_ANOMALIES: string;
    GENERATE_ADVISORY: string;
    RANK_PRIORITIES: string;
    QUERY_ASSIGNMENTS: string;
    CHECK_COMPLIANCE: string;
    PREDICT_RISK: string;
};
export declare function getPrompt(toolName: keyof typeof PROMPTS): string;
