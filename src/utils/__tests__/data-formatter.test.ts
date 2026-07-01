import {
  groupGapsByJurisdiction,
  groupGapsByAssetType,
  sortByRiskScore,
  sortByDaysOverdue,
  filterByJurisdiction,
  filterByRiskLevel,
  getCriticalGaps,
  getHighRiskJurisdictionGaps,
  calculateGapStatistics,
  summarizeGap,
} from "../data-formatter.js";
import { makeGap } from "../__test-helpers__/fixtures.js";

describe("groupGapsByJurisdiction", () => {
  it("groups gaps by their jurisdiction field", () => {
    const gaps = [
      makeGap({ id: "1", jurisdiction: "US" }),
      makeGap({ id: "2", jurisdiction: "EU" }),
      makeGap({ id: "3", jurisdiction: "US" }),
    ];
    const grouped = groupGapsByJurisdiction(gaps);
    expect(grouped.US).toHaveLength(2);
    expect(grouped.EU).toHaveLength(1);
  });

  it("returns an empty object for an empty input", () => {
    expect(groupGapsByJurisdiction([])).toEqual({});
  });
});

describe("groupGapsByAssetType", () => {
  it("groups gaps by asset type", () => {
    const gaps = [
      makeGap({ id: "1", assetType: "PATENT" }),
      makeGap({ id: "2", assetType: "TRADEMARK" }),
      makeGap({ id: "3", assetType: "PATENT" }),
    ];
    const grouped = groupGapsByAssetType(gaps);
    expect(grouped.PATENT).toHaveLength(2);
    expect(grouped.TRADEMARK).toHaveLength(1);
  });
});

describe("sortByRiskScore", () => {
  it("sorts gaps by risk score descending", () => {
    const gaps = [
      makeGap({ id: "low", riskScore: 10 }),
      makeGap({ id: "high", riskScore: 90 }),
      makeGap({ id: "mid", riskScore: 50 }),
    ];
    const sorted = sortByRiskScore(gaps);
    expect(sorted.map((g) => g.id)).toEqual(["high", "mid", "low"]);
  });

  it("does not mutate the original array", () => {
    const gaps = [makeGap({ id: "a", riskScore: 10 }), makeGap({ id: "b", riskScore: 90 })];
    const original = [...gaps];
    sortByRiskScore(gaps);
    expect(gaps).toEqual(original);
  });
});

describe("sortByDaysOverdue", () => {
  it("sorts gaps by days overdue descending", () => {
    const gaps = [
      makeGap({ id: "a", daysOverdue: 5 }),
      makeGap({ id: "b", daysOverdue: 100 }),
      makeGap({ id: "c", daysOverdue: 30 }),
    ];
    const sorted = sortByDaysOverdue(gaps);
    expect(sorted.map((g) => g.id)).toEqual(["b", "c", "a"]);
  });
});

describe("filterByJurisdiction", () => {
  it("filters gaps matching the given jurisdiction, case-insensitively", () => {
    const gaps = [
      makeGap({ id: "1", jurisdiction: "US" }),
      makeGap({ id: "2", jurisdiction: "EU" }),
    ];
    const result = filterByJurisdiction(gaps, "us");
    expect(result.map((g) => g.id)).toEqual(["1"]);
  });
});

describe("filterByRiskLevel", () => {
  it("returns only gaps at or above the given risk level", () => {
    const gaps = [
      makeGap({ id: "low", riskLevel: "LOW" }),
      makeGap({ id: "medium", riskLevel: "MEDIUM" }),
      makeGap({ id: "high", riskLevel: "HIGH" }),
      makeGap({ id: "critical", riskLevel: "CRITICAL" }),
    ];
    const result = filterByRiskLevel(gaps, "HIGH");
    expect(result.map((g) => g.id).sort()).toEqual(["critical", "high"]);
  });
});

describe("getCriticalGaps", () => {
  it("returns only CRITICAL risk gaps", () => {
    const gaps = [
      makeGap({ id: "1", riskLevel: "CRITICAL" }),
      makeGap({ id: "2", riskLevel: "LOW" }),
    ];
    expect(getCriticalGaps(gaps).map((g) => g.id)).toEqual(["1"]);
  });
});

describe("getHighRiskJurisdictionGaps", () => {
  it("returns gaps in known high-risk jurisdictions", () => {
    const gaps = [
      makeGap({ id: "1", jurisdiction: "CN" }),
      makeGap({ id: "2", jurisdiction: "US" }),
      makeGap({ id: "3", jurisdiction: "RU" }),
    ];
    expect(
      getHighRiskJurisdictionGaps(gaps)
        .map((g) => g.id)
        .sort()
    ).toEqual(["1", "3"]);
  });
});

describe("calculateGapStatistics", () => {
  it("computes totals and breakdowns for a non-empty set", () => {
    const gaps = [
      makeGap({
        id: "1",
        riskLevel: "CRITICAL",
        assetType: "PATENT",
        riskScore: 90,
        daysOverdue: 20,
        personEndDate: undefined,
      }),
      makeGap({
        id: "2",
        riskLevel: "LOW",
        assetType: "TRADEMARK",
        riskScore: 10,
        daysOverdue: 0,
        personEndDate: new Date("2023-01-01"),
      }),
    ];
    const stats = calculateGapStatistics(gaps);

    expect(stats.total).toBe(2);
    expect(stats.byRiskLevel.CRITICAL).toBe(1);
    expect(stats.byRiskLevel.LOW).toBe(1);
    expect(stats.byAssetType.PATENT).toBe(1);
    expect(stats.byAssetType.TRADEMARK).toBe(1);
    expect(stats.averageRiskScore).toBe("50.0");
    expect(stats.averageDaysOverdue).toBe("10.0");
    expect(stats.currentPeople).toBe(1);
    expect(stats.formerPeople).toBe(1);
  });

  it("returns zero counts for an empty gap list without throwing", () => {
    const stats = calculateGapStatistics([]);
    expect(stats.total).toBe(0);
    expect(stats.currentPeople).toBe(0);
    expect(stats.formerPeople).toBe(0);
    // Average of an empty set is mathematically NaN; documenting current behavior.
    expect(stats.averageRiskScore).toBe("NaN");
    expect(stats.averageDaysOverdue).toBe("NaN");
  });
});

describe("summarizeGap", () => {
  it("produces a compact one-line summary", () => {
    const gap = makeGap({
      personName: "Grace Hopper",
      personRole: "FOUNDER",
      assetTitle: "Compiler Patent",
      jurisdiction: "US",
      assetType: "PATENT",
      riskLevel: "HIGH",
    });
    expect(summarizeGap(gap)).toBe(
      "Grace Hopper (FOUNDER) - Compiler Patent (US/PATENT) - Risk: HIGH"
    );
  });

  it("falls back to 'Company-wide' when there is no asset title", () => {
    const gap = makeGap({ assetTitle: undefined });
    expect(summarizeGap(gap)).toContain("Company-wide");
  });
});
