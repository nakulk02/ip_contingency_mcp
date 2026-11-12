import { z } from "zod";
export declare const RiskLevelSchema: z.ZodEnum<{
    LOW: "LOW";
    MEDIUM: "MEDIUM";
    HIGH: "HIGH";
    CRITICAL: "CRITICAL";
}>;
export declare const AssignmentGapSchema: z.ZodObject<{
    id: z.ZodString;
    personId: z.ZodString;
    personName: z.ZodString;
    personEmail: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
    personRole: z.ZodEnum<{
        FOUNDER: "FOUNDER";
        EMPLOYEE: "EMPLOYEE";
        CONTRACTOR: "CONTRACTOR";
        ADVISOR: "ADVISOR";
    }>;
    personStartDate: z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>;
    personEndDate: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>>>, z.ZodTransform<Date | undefined, Date | null | undefined>>;
    assetId: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
    assetTitle: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
    assetType: z.ZodEnum<{
        PATENT: "PATENT";
        TRADEMARK: "TRADEMARK";
    }>;
    assetStatus: z.ZodEnum<{
        DRAFT: "DRAFT";
        FILED: "FILED";
        PUBLISHED: "PUBLISHED";
        REGISTERED: "REGISTERED";
    }>;
    jurisdiction: z.ZodString;
    filingDate: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>>>, z.ZodTransform<Date | undefined, Date | null | undefined>>;
    riskScore: z.ZodNumber;
    riskLevel: z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
    }>;
    daysOverdue: z.ZodNumber;
}, z.core.$strip>;
export declare const ToolInputShapes: {
    readonly analyzeGaps: {
        readonly gaps: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            personId: z.ZodString;
            personName: z.ZodString;
            personEmail: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
            personRole: z.ZodEnum<{
                FOUNDER: "FOUNDER";
                EMPLOYEE: "EMPLOYEE";
                CONTRACTOR: "CONTRACTOR";
                ADVISOR: "ADVISOR";
            }>;
            personStartDate: z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>;
            personEndDate: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>>>, z.ZodTransform<Date | undefined, Date | null | undefined>>;
            assetId: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
            assetTitle: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
            assetType: z.ZodEnum<{
                PATENT: "PATENT";
                TRADEMARK: "TRADEMARK";
            }>;
            assetStatus: z.ZodEnum<{
                DRAFT: "DRAFT";
                FILED: "FILED";
                PUBLISHED: "PUBLISHED";
                REGISTERED: "REGISTERED";
            }>;
            jurisdiction: z.ZodString;
            filingDate: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>>>, z.ZodTransform<Date | undefined, Date | null | undefined>>;
            riskScore: z.ZodNumber;
            riskLevel: z.ZodEnum<{
                LOW: "LOW";
                MEDIUM: "MEDIUM";
                HIGH: "HIGH";
                CRITICAL: "CRITICAL";
            }>;
            daysOverdue: z.ZodNumber;
        }, z.core.$strip>>;
    };
    readonly recommendActions: {
        readonly gap: z.ZodObject<{
            id: z.ZodString;
            personId: z.ZodString;
            personName: z.ZodString;
            personEmail: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
            personRole: z.ZodEnum<{
                FOUNDER: "FOUNDER";
                EMPLOYEE: "EMPLOYEE";
                CONTRACTOR: "CONTRACTOR";
                ADVISOR: "ADVISOR";
            }>;
            personStartDate: z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>;
            personEndDate: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>>>, z.ZodTransform<Date | undefined, Date | null | undefined>>;
            assetId: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
            assetTitle: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
            assetType: z.ZodEnum<{
                PATENT: "PATENT";
                TRADEMARK: "TRADEMARK";
            }>;
            assetStatus: z.ZodEnum<{
                DRAFT: "DRAFT";
                FILED: "FILED";
                PUBLISHED: "PUBLISHED";
                REGISTERED: "REGISTERED";
            }>;
            jurisdiction: z.ZodString;
            filingDate: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>>>, z.ZodTransform<Date | undefined, Date | null | undefined>>;
            riskScore: z.ZodNumber;
            riskLevel: z.ZodEnum<{
                LOW: "LOW";
                MEDIUM: "MEDIUM";
                HIGH: "HIGH";
                CRITICAL: "CRITICAL";
            }>;
            daysOverdue: z.ZodNumber;
        }, z.core.$strip>;
    };
    readonly detectAnomalies: {
        readonly gaps: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            personId: z.ZodString;
            personName: z.ZodString;
            personEmail: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
            personRole: z.ZodEnum<{
                FOUNDER: "FOUNDER";
                EMPLOYEE: "EMPLOYEE";
                CONTRACTOR: "CONTRACTOR";
                ADVISOR: "ADVISOR";
            }>;
            personStartDate: z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>;
            personEndDate: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>>>, z.ZodTransform<Date | undefined, Date | null | undefined>>;
            assetId: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
            assetTitle: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
            assetType: z.ZodEnum<{
                PATENT: "PATENT";
                TRADEMARK: "TRADEMARK";
            }>;
            assetStatus: z.ZodEnum<{
                DRAFT: "DRAFT";
                FILED: "FILED";
                PUBLISHED: "PUBLISHED";
                REGISTERED: "REGISTERED";
            }>;
            jurisdiction: z.ZodString;
            filingDate: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>>>, z.ZodTransform<Date | undefined, Date | null | undefined>>;
            riskScore: z.ZodNumber;
            riskLevel: z.ZodEnum<{
                LOW: "LOW";
                MEDIUM: "MEDIUM";
                HIGH: "HIGH";
                CRITICAL: "CRITICAL";
            }>;
            daysOverdue: z.ZodNumber;
        }, z.core.$strip>>;
        readonly context: z.ZodOptional<z.ZodObject<{
            companyAge: z.ZodOptional<z.ZodNumber>;
            typicalAssignmentTime: z.ZodOptional<z.ZodNumber>;
            historicalPatterns: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>>;
    };
    readonly generateAdvisory: {
        readonly gaps: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            personId: z.ZodString;
            personName: z.ZodString;
            personEmail: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
            personRole: z.ZodEnum<{
                FOUNDER: "FOUNDER";
                EMPLOYEE: "EMPLOYEE";
                CONTRACTOR: "CONTRACTOR";
                ADVISOR: "ADVISOR";
            }>;
            personStartDate: z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>;
            personEndDate: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>>>, z.ZodTransform<Date | undefined, Date | null | undefined>>;
            assetId: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
            assetTitle: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
            assetType: z.ZodEnum<{
                PATENT: "PATENT";
                TRADEMARK: "TRADEMARK";
            }>;
            assetStatus: z.ZodEnum<{
                DRAFT: "DRAFT";
                FILED: "FILED";
                PUBLISHED: "PUBLISHED";
                REGISTERED: "REGISTERED";
            }>;
            jurisdiction: z.ZodString;
            filingDate: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>>>, z.ZodTransform<Date | undefined, Date | null | undefined>>;
            riskScore: z.ZodNumber;
            riskLevel: z.ZodEnum<{
                LOW: "LOW";
                MEDIUM: "MEDIUM";
                HIGH: "HIGH";
                CRITICAL: "CRITICAL";
            }>;
            daysOverdue: z.ZodNumber;
        }, z.core.$strip>>;
        readonly companyContext: z.ZodOptional<z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            industry: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    };
    readonly rankPriorities: {
        readonly gaps: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            personId: z.ZodString;
            personName: z.ZodString;
            personEmail: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
            personRole: z.ZodEnum<{
                FOUNDER: "FOUNDER";
                EMPLOYEE: "EMPLOYEE";
                CONTRACTOR: "CONTRACTOR";
                ADVISOR: "ADVISOR";
            }>;
            personStartDate: z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>;
            personEndDate: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>>>, z.ZodTransform<Date | undefined, Date | null | undefined>>;
            assetId: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
            assetTitle: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
            assetType: z.ZodEnum<{
                PATENT: "PATENT";
                TRADEMARK: "TRADEMARK";
            }>;
            assetStatus: z.ZodEnum<{
                DRAFT: "DRAFT";
                FILED: "FILED";
                PUBLISHED: "PUBLISHED";
                REGISTERED: "REGISTERED";
            }>;
            jurisdiction: z.ZodString;
            filingDate: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>>>, z.ZodTransform<Date | undefined, Date | null | undefined>>;
            riskScore: z.ZodNumber;
            riskLevel: z.ZodEnum<{
                LOW: "LOW";
                MEDIUM: "MEDIUM";
                HIGH: "HIGH";
                CRITICAL: "CRITICAL";
            }>;
            daysOverdue: z.ZodNumber;
        }, z.core.$strip>>;
    };
    readonly queryAssignments: {
        readonly question: z.ZodString;
        readonly gaps: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            personId: z.ZodString;
            personName: z.ZodString;
            personEmail: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
            personRole: z.ZodEnum<{
                FOUNDER: "FOUNDER";
                EMPLOYEE: "EMPLOYEE";
                CONTRACTOR: "CONTRACTOR";
                ADVISOR: "ADVISOR";
            }>;
            personStartDate: z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>;
            personEndDate: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>>>, z.ZodTransform<Date | undefined, Date | null | undefined>>;
            assetId: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
            assetTitle: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
            assetType: z.ZodEnum<{
                PATENT: "PATENT";
                TRADEMARK: "TRADEMARK";
            }>;
            assetStatus: z.ZodEnum<{
                DRAFT: "DRAFT";
                FILED: "FILED";
                PUBLISHED: "PUBLISHED";
                REGISTERED: "REGISTERED";
            }>;
            jurisdiction: z.ZodString;
            filingDate: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>>>, z.ZodTransform<Date | undefined, Date | null | undefined>>;
            riskScore: z.ZodNumber;
            riskLevel: z.ZodEnum<{
                LOW: "LOW";
                MEDIUM: "MEDIUM";
                HIGH: "HIGH";
                CRITICAL: "CRITICAL";
            }>;
            daysOverdue: z.ZodNumber;
        }, z.core.$strip>>;
    };
    readonly checkCompliance: {
        readonly gap: z.ZodObject<{
            id: z.ZodString;
            personId: z.ZodString;
            personName: z.ZodString;
            personEmail: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
            personRole: z.ZodEnum<{
                FOUNDER: "FOUNDER";
                EMPLOYEE: "EMPLOYEE";
                CONTRACTOR: "CONTRACTOR";
                ADVISOR: "ADVISOR";
            }>;
            personStartDate: z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>;
            personEndDate: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>>>, z.ZodTransform<Date | undefined, Date | null | undefined>>;
            assetId: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
            assetTitle: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
            assetType: z.ZodEnum<{
                PATENT: "PATENT";
                TRADEMARK: "TRADEMARK";
            }>;
            assetStatus: z.ZodEnum<{
                DRAFT: "DRAFT";
                FILED: "FILED";
                PUBLISHED: "PUBLISHED";
                REGISTERED: "REGISTERED";
            }>;
            jurisdiction: z.ZodString;
            filingDate: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>>>, z.ZodTransform<Date | undefined, Date | null | undefined>>;
            riskScore: z.ZodNumber;
            riskLevel: z.ZodEnum<{
                LOW: "LOW";
                MEDIUM: "MEDIUM";
                HIGH: "HIGH";
                CRITICAL: "CRITICAL";
            }>;
            daysOverdue: z.ZodNumber;
        }, z.core.$strip>;
    };
    readonly predictRisk: {
        readonly gap: z.ZodObject<{
            id: z.ZodString;
            personId: z.ZodString;
            personName: z.ZodString;
            personEmail: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
            personRole: z.ZodEnum<{
                FOUNDER: "FOUNDER";
                EMPLOYEE: "EMPLOYEE";
                CONTRACTOR: "CONTRACTOR";
                ADVISOR: "ADVISOR";
            }>;
            personStartDate: z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>;
            personEndDate: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>>>, z.ZodTransform<Date | undefined, Date | null | undefined>>;
            assetId: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
            assetTitle: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
            assetType: z.ZodEnum<{
                PATENT: "PATENT";
                TRADEMARK: "TRADEMARK";
            }>;
            assetStatus: z.ZodEnum<{
                DRAFT: "DRAFT";
                FILED: "FILED";
                PUBLISHED: "PUBLISHED";
                REGISTERED: "REGISTERED";
            }>;
            jurisdiction: z.ZodString;
            filingDate: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>>>, z.ZodTransform<Date | undefined, Date | null | undefined>>;
            riskScore: z.ZodNumber;
            riskLevel: z.ZodEnum<{
                LOW: "LOW";
                MEDIUM: "MEDIUM";
                HIGH: "HIGH";
                CRITICAL: "CRITICAL";
            }>;
            daysOverdue: z.ZodNumber;
        }, z.core.$strip>;
        readonly historicalContext: z.ZodOptional<z.ZodObject<{
            similarGaps: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                personId: z.ZodString;
                personName: z.ZodString;
                personEmail: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
                personRole: z.ZodEnum<{
                    FOUNDER: "FOUNDER";
                    EMPLOYEE: "EMPLOYEE";
                    CONTRACTOR: "CONTRACTOR";
                    ADVISOR: "ADVISOR";
                }>;
                personStartDate: z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>;
                personEndDate: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>>>, z.ZodTransform<Date | undefined, Date | null | undefined>>;
                assetId: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
                assetTitle: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodString>>, z.ZodTransform<string | undefined, string | null | undefined>>;
                assetType: z.ZodEnum<{
                    PATENT: "PATENT";
                    TRADEMARK: "TRADEMARK";
                }>;
                assetStatus: z.ZodEnum<{
                    DRAFT: "DRAFT";
                    FILED: "FILED";
                    PUBLISHED: "PUBLISHED";
                    REGISTERED: "REGISTERED";
                }>;
                jurisdiction: z.ZodString;
                filingDate: z.ZodPipe<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>>>, z.ZodTransform<Date | undefined, Date | null | undefined>>;
                riskScore: z.ZodNumber;
                riskLevel: z.ZodEnum<{
                    LOW: "LOW";
                    MEDIUM: "MEDIUM";
                    HIGH: "HIGH";
                    CRITICAL: "CRITICAL";
                }>;
                daysOverdue: z.ZodNumber;
            }, z.core.$strip>>>;
            successRate: z.ZodOptional<z.ZodNumber>;
            avgResolutionDays: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
    };
};
export declare const AnalysisOutputSchema: z.ZodObject<{
    patterns: z.ZodArray<z.ZodString>;
    riskAreas: z.ZodArray<z.ZodString>;
    recommendations: z.ZodArray<z.ZodString>;
    summary: z.ZodString;
}, z.core.$strip>;
export declare const RecommendationOutputSchema: z.ZodObject<{
    priority: z.ZodEnum<{
        LOW: "LOW";
        MEDIUM: "MEDIUM";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
    }>;
    reason: z.ZodString;
    actions: z.ZodArray<z.ZodString>;
    timeline: z.ZodString;
    jurisdictionNotes: z.ZodOptional<z.ZodString>;
    estimatedEffort: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const AnomalyOutputSchema: z.ZodObject<{
    anomalies: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<{
            unusual_delay: "unusual_delay";
            pattern_deviation: "pattern_deviation";
            compliance_violation: "compliance_violation";
            risk_spike: "risk_spike";
        }>;
        subject: z.ZodString;
        description: z.ZodString;
        severity: z.ZodEnum<{
            LOW: "LOW";
            MEDIUM: "MEDIUM";
            HIGH: "HIGH";
            CRITICAL: "CRITICAL";
        }>;
        evidence: z.ZodString;
        suggestedAction: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const AdvisoryOutputSchema: z.ZodObject<{
    executiveSummary: z.ZodString;
    riskNarrative: z.ZodString;
    actionItems: z.ZodArray<z.ZodObject<{
        priority: z.ZodNumber;
        action: z.ZodString;
        owner: z.ZodOptional<z.ZodString>;
        estimatedEffort: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    timeline: z.ZodString;
    financialImpact: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const RankingOutputSchema: z.ZodObject<{
    ranked: z.ZodArray<z.ZodObject<{
        gapId: z.ZodString;
        priorityScore: z.ZodNumber;
        urgencyFactors: z.ZodArray<z.ZodString>;
        estimatedResolutionTime: z.ZodString;
    }, z.core.$strip>>;
    methodology: z.ZodString;
}, z.core.$strip>;
export declare const QueryInterpretationSchema: z.ZodObject<{
    interpretation: z.ZodString;
    filters: z.ZodObject<{
        jurisdiction: z.ZodOptional<z.ZodArray<z.ZodString>>;
        assetType: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            PATENT: "PATENT";
            TRADEMARK: "TRADEMARK";
        }>>>;
        riskLevel: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            LOW: "LOW";
            MEDIUM: "MEDIUM";
            HIGH: "HIGH";
            CRITICAL: "CRITICAL";
        }>>>;
        personStatus: z.ZodOptional<z.ZodEnum<{
            current: "current";
            former: "former";
            either: "either";
        }>>;
    }, z.core.$strip>;
    explanation: z.ZodString;
}, z.core.$strip>;
export declare const ComplianceOutputSchema: z.ZodObject<{
    compliant: z.ZodBoolean;
    severity: z.ZodEnum<{
        CRITICAL: "CRITICAL";
        OK: "OK";
        WARNING: "WARNING";
    }>;
    issues: z.ZodArray<z.ZodString>;
    recommendations: z.ZodArray<z.ZodString>;
    references: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const PredictionOutputSchema: z.ZodObject<{
    predictedOutcome: z.ZodEnum<{
        likely_success: "likely_success";
        at_risk: "at_risk";
        likely_failure: "likely_failure";
    }>;
    confidence: z.ZodNumber;
    reasoning: z.ZodString;
    factors: z.ZodArray<z.ZodObject<{
        factor: z.ZodString;
        weight: z.ZodNumber;
        direction: z.ZodEnum<{
            positive: "positive";
            negative: "negative";
        }>;
    }, z.core.$strip>>;
    recommendedIntervention: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
