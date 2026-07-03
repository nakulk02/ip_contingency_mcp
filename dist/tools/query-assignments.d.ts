import { AssignmentGap, QueryResult, ToolResponse } from "../types/index.js";
interface QueryInput {
    question: string;
    gaps: AssignmentGap[];
}
/**
 * Query gaps using natural language
 */
export declare function queryAssignments(input: QueryInput): Promise<ToolResponse<QueryResult>>;
export default queryAssignments;
