import { AssignmentGap, Prediction, ToolResponse } from "../types/index.js";
interface PredictionInput {
    gap: AssignmentGap;
    historicalContext?: {
        similarGaps?: AssignmentGap[];
        successRate?: number;
        avgResolutionDays?: number;
    };
}
/**
 * Predict likely outcome for a gap
 */
export declare function predictRisk(input: PredictionInput): Promise<ToolResponse<Prediction>>;
export default predictRisk;
