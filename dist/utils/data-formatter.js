/**
 * Format gap data for LLM (human-readable)
 */
export function formatGapForAnalysis(gap) {
    return `
Gap ID: ${gap.id}
Person: ${gap.personName} (${gap.personRole})
  - Email: ${gap.personEmail || "N/A"}
  - Start Date: ${gap.personStartDate.toISOString().split("T")[0]}
  - Status: ${gap.personEndDate ? "Former" : "Current"}
Asset: ${gap.assetTitle || "Company-wide"}
  - Type: ${gap.assetType}
  - Status: ${gap.assetStatus}
  - Jurisdiction: ${gap.jurisdiction}
  - Filing Date: ${gap.filingDate ? gap.filingDate.toISOString().split("T")[0] : "N/A"}
Risk: ${gap.riskLevel} (Score: ${gap.riskScore}/100)
Days Overdue: ${gap.daysOverdue}
  `.trim();
}
/**
 * Format multiple gaps for analysis
 */
export function formatGapsForAnalysis(gaps) {
    return gaps.map((gap, idx) => `Gap ${idx + 1}:\n${formatGapForAnalysis(gap)}`).join("\n\n---\n\n");
}
/**
 * Format gap summary (compact)
 */
export function summarizeGap(gap) {
    return `${gap.personName} (${gap.personRole}) - ${gap.assetTitle || "Company-wide"} (${gap.jurisdiction}/${gap.assetType}) - Risk: ${gap.riskLevel}`;
}
/**
 * Group gaps by jurisdiction
 */
export function groupGapsByJurisdiction(gaps) {
    return gaps.reduce((acc, gap) => {
        const jurisdiction = gap.jurisdiction;
        if (!acc[jurisdiction])
            acc[jurisdiction] = [];
        acc[jurisdiction].push(gap);
        return acc;
    }, {});
}
/**
 * Group gaps by asset type
 */
export function groupGapsByAssetType(gaps) {
    return gaps.reduce((acc, gap) => {
        const type = gap.assetType;
        if (!acc[type])
            acc[type] = [];
        acc[type].push(gap);
        return acc;
    }, {});
}
/**
 * Group gaps by person
 */
export function groupGapsByPerson(gaps) {
    return gaps.reduce((acc, gap) => {
        const personId = gap.personId;
        if (!acc[personId])
            acc[personId] = [];
        acc[personId].push(gap);
        return acc;
    }, {});
}
/**
 * Sort gaps by risk score (descending)
 */
export function sortByRiskScore(gaps) {
    return [...gaps].sort((a, b) => b.riskScore - a.riskScore);
}
/**
 * Sort gaps by days overdue (descending)
 */
export function sortByDaysOverdue(gaps) {
    return [...gaps].sort((a, b) => b.daysOverdue - a.daysOverdue);
}
/**
 * Filter gaps by jurisdiction
 */
export function filterByJurisdiction(gaps, jurisdiction) {
    return gaps.filter((gap) => gap.jurisdiction === jurisdiction.toUpperCase());
}
/**
 * Filter gaps by risk level
 */
export function filterByRiskLevel(gaps, minLevel) {
    const levels = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
    const minIndex = levels.indexOf(minLevel);
    return gaps.filter((gap) => levels.indexOf(gap.riskLevel) >= minIndex);
}
/**
 * Get critical gaps (CRITICAL risk level)
 */
export function getCriticalGaps(gaps) {
    return gaps.filter((gap) => gap.riskLevel === "CRITICAL");
}
/**
 * Get high-risk jurisdiction gaps
 */
export function getHighRiskJurisdictionGaps(gaps) {
    const highRiskJurisdictions = ["CN", "DE", "JP", "KR", "IN", "RU"];
    return gaps.filter((gap) => highRiskJurisdictions.includes(gap.jurisdiction));
}
/**
 * Calculate statistics
 */
export function calculateGapStatistics(gaps) {
    return {
        total: gaps.length,
        byRiskLevel: {
            CRITICAL: gaps.filter((g) => g.riskLevel === "CRITICAL").length,
            HIGH: gaps.filter((g) => g.riskLevel === "HIGH").length,
            MEDIUM: gaps.filter((g) => g.riskLevel === "MEDIUM").length,
            LOW: gaps.filter((g) => g.riskLevel === "LOW").length,
        },
        byAssetType: {
            PATENT: gaps.filter((g) => g.assetType === "PATENT").length,
            TRADEMARK: gaps.filter((g) => g.assetType === "TRADEMARK").length,
        },
        averageRiskScore: (gaps.reduce((sum, g) => sum + g.riskScore, 0) / gaps.length).toFixed(1),
        averageDaysOverdue: (gaps.reduce((sum, g) => sum + g.daysOverdue, 0) / gaps.length).toFixed(1),
        currentPeople: gaps.filter((g) => !g.personEndDate).length,
        formerPeople: gaps.filter((g) => !!g.personEndDate).length,
    };
}
