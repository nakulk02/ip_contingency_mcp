import { AssignmentGap, RankedGap, ToolResponse } from "../types/index.js";
interface RankingInput {
    gaps: AssignmentGap[];
}
/**
 * Rank gaps by strategic priority
 */
export declare function rankPriorities(input: RankingInput): Promise<ToolResponse<RankedGap[]>>;
export default rankPriorities;
