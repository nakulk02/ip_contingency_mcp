import { AssignmentGap } from "../../types/index.js";

export function makeGap(overrides: Partial<AssignmentGap> = {}): AssignmentGap {
  return {
    id: "gap-1",
    personId: "person-1",
    personName: "Ada Lovelace",
    personEmail: "ada@example.com",
    personRole: "EMPLOYEE",
    personStartDate: new Date("2022-01-01"),
    personEndDate: undefined,
    assetId: "asset-1",
    assetTitle: "Analytical Engine Patent",
    assetType: "PATENT",
    assetStatus: "FILED",
    jurisdiction: "US",
    filingDate: new Date("2022-03-01"),
    riskScore: 50,
    riskLevel: "MEDIUM",
    daysOverdue: 10,
    ...overrides,
  };
}
