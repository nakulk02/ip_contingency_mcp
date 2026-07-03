import { AssignmentGap, AnalysisResult, ToolResponse } from "../types/index.js";
interface AnalysisInput {
    gaps: AssignmentGap[];
}
/**
 * Analyze IP ownership gaps to identify patterns
 */
export declare function analyzeGaps(input: AnalysisInput): Promise<ToolResponse<AnalysisResult>>;
export default analyzeGaps;
