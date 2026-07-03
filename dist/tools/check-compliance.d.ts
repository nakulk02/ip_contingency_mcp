import { AssignmentGap, ComplianceCheckResult, ToolResponse } from "../types/index.js";
interface ComplianceInput {
    gap: AssignmentGap;
}
/**
 * Check compliance of a gap against jurisdiction rules
 */
export declare function checkCompliance(input: ComplianceInput): Promise<ToolResponse<ComplianceCheckResult>>;
export default checkCompliance;
