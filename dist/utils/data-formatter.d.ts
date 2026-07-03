import { AssignmentGap } from "../types/index.js";
/**
 * Format gap data for LLM (human-readable)
 */
export declare function formatGapForAnalysis(gap: AssignmentGap): string;
/**
 * Format multiple gaps for analysis
 */
export declare function formatGapsForAnalysis(gaps: AssignmentGap[]): string;
/**
 * Format gap summary (compact)
 */
export declare function summarizeGap(gap: AssignmentGap): string;
/**
 * Group gaps by jurisdiction
 */
export declare function groupGapsByJurisdiction(gaps: AssignmentGap[]): Record<string, AssignmentGap[]>;
/**
 * Group gaps by asset type
 */
export declare function groupGapsByAssetType(gaps: AssignmentGap[]): Record<string, AssignmentGap[]>;
/**
 * Group gaps by person
 */
export declare function groupGapsByPerson(gaps: AssignmentGap[]): Record<string, AssignmentGap[]>;
/**
 * Sort gaps by risk score (descending)
 */
export declare function sortByRiskScore(gaps: AssignmentGap[]): AssignmentGap[];
/**
 * Sort gaps by days overdue (descending)
 */
export declare function sortByDaysOverdue(gaps: AssignmentGap[]): AssignmentGap[];
/**
 * Filter gaps by jurisdiction
 */
export declare function filterByJurisdiction(gaps: AssignmentGap[], jurisdiction: string): AssignmentGap[];
/**
 * Filter gaps by risk level
 */
export declare function filterByRiskLevel(gaps: AssignmentGap[], minLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"): AssignmentGap[];
/**
 * Get critical gaps (CRITICAL risk level)
 */
export declare function getCriticalGaps(gaps: AssignmentGap[]): AssignmentGap[];
/**
 * Get high-risk jurisdiction gaps
 */
export declare function getHighRiskJurisdictionGaps(gaps: AssignmentGap[]): AssignmentGap[];
/**
 * Calculate statistics
 */
export declare function calculateGapStatistics(gaps: AssignmentGap[]): {
    total: number;
    byRiskLevel: {
        CRITICAL: number;
        HIGH: number;
        MEDIUM: number;
        LOW: number;
    };
    byAssetType: {
        PATENT: number;
        TRADEMARK: number;
    };
    averageRiskScore: string;
    averageDaysOverdue: string;
    currentPeople: number;
    formerPeople: number;
};
