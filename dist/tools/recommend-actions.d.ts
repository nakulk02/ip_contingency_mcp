import { AssignmentGap, Recommendation, ToolResponse } from "../types/index.js";
interface RecommendationInput {
    gap: AssignmentGap;
}
/**
 * Generate recommendations for resolving a specific gap
 */
export declare function recommendActions(input: RecommendationInput): Promise<ToolResponse<Recommendation>>;
export default recommendActions;
