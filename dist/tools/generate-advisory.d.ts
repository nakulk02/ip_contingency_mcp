import { AssignmentGap, AdvisoryReport, ToolResponse } from "../types/index.js";
interface AdvisoryInput {
    gaps: AssignmentGap[];
    companyContext?: {
        name?: string;
        industry?: string;
    };
}
/**
 * Generate executive advisory report
 */
export declare function generateAdvisory(input: AdvisoryInput): Promise<ToolResponse<AdvisoryReport>>;
export default generateAdvisory;
