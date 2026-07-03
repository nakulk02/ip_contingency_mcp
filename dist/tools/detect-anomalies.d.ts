import { AssignmentGap, Anomaly, ToolResponse } from "../types/index.js";
interface AnomalyDetectionInput {
    gaps: AssignmentGap[];
    context?: {
        companyAge?: number;
        typicalAssignmentTime?: number;
        historicalPatterns?: Record<string, any>;
    };
}
/**
 * Detect anomalies and red flags in gaps
 */
export declare function detectAnomalies(input: AnomalyDetectionInput): Promise<ToolResponse<Anomaly[]>>;
export default detectAnomalies;
