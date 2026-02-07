// Mock data for demo when backend is unavailable
export const mockData = {
  riskAssessments: [
    {
      region: "Coastal District A",
      risk_level: "CRITICAL",
      risk_score: 0.89,
      confidence: 0.72,
      components: {
        hazard: 0.92,
        exposure: 0.87,
        vulnerability: 0.88
      },
      uncertainty_warnings: [
        "Conflicting flood depth reports from multiple sources",
        "Population density estimates vary significantly"
      ],
      reasoning_graph: [
        "High flood depth (2.5m) confirmed by satellite imagery",
        "Dense population center (15,000+ residents)",
        "Limited evacuation infrastructure",
        "⚠ Conflicting reports on shelter availability"
      ]
    },
    {
      region: "Mountain Region B",
      risk_level: "MEDIUM",
      risk_score: 0.54,
      confidence: 0.85,
      components: {
        hazard: 0.48,
        exposure: 0.62,
        vulnerability: 0.52
      },
      uncertainty_warnings: [],
      reasoning_graph: [
        "Moderate landslide risk in affected valleys",
        "Sparse population distribution",
        "Good road access for evacuation",
        "Local emergency services available"
      ]
    },
    {
      region: "Urban Center C",
      risk_level: "HIGH",
      risk_score: 0.76,
      confidence: 0.68,
      components: {
        hazard: 0.71,
        exposure: 0.82,
        vulnerability: 0.75
      },
      uncertainty_warnings: [
        "Infrastructure damage reports incomplete"
      ],
      reasoning_graph: [
        "Storm surge predicted 1.8m above normal",
        "Dense urban population (45,000 residents)",
        "Critical infrastructure at risk",
        "⚠ Power grid status uncertain"
      ]
    }
  ],

  decisionPackages: [
    {
      region: "Coastal District A",
      risk_assessment: {
        risk_level: "CRITICAL",
        confidence: 0.72,
        risk_score: 0.89
      },
      governance: {
        status: "ESCALATE",
        requires_human_approval: true,
        reason: "High-risk decision with moderate confidence requires oversight"
      },
      options: [
        {
          id: "opt_1",
          title: "Immediate Evacuation",
          description: "Full evacuation of 15,000 residents to inland shelters",
          benefit: "Minimize casualties, ensure population safety",
          tradeoffs: [
            "High cost ($2.5M estimated)",
            "48-72 hour operation time",
            "Potential false alarm impact"
          ],
          irreversibility: "HIGH",
          ethical_sensitivity: "HIGH",
          confidence: 0.72
        },
        {
          id: "opt_2",
          title: "Shelter-in-Place",
          description: "Fortify buildings, distribute supplies, monitor situation",
          benefit: "Lower cost, less disruption to community",
          tradeoffs: [
            "Higher casualty risk if flooding worsens",
            "Limited mobility once flooding begins",
            "Requires accurate flood predictions"
          ],
          irreversibility: "MEDIUM",
          ethical_sensitivity: "HIGH",
          confidence: 0.68
        },
        {
          id: "opt_3",
          title: "Staged Evacuation",
          description: "Evacuate high-risk zones first, monitor and adjust",
          benefit: "Balanced approach, adaptive to conditions",
          tradeoffs: [
            "Complex coordination required",
            "Some residents remain at risk initially",
            "Weather window dependency"
          ],
          irreversibility: "MEDIUM",
          ethical_sensitivity: "MEDIUM",
          confidence: 0.75
        }
      ]
    }
  ],

  governanceStatus: [
    {
      region: "Coastal District A",
      risk_level: "CRITICAL",
      confidence: 0.72,
      governance_status: "ESCALATE",
      requires_approval: true,
      reason: "Critical risk with 72% confidence triggers mandatory human review",
      rules_triggered: [
        "Rule: Risk level CRITICAL requires human approval",
        "Rule: Confidence < 80% on HIGH+ risk escalates",
        "Rule: Population > 10,000 requires executive review"
      ]
    },
    {
      region: "Mountain Region B",
      risk_level: "MEDIUM",
      confidence: 0.85,
      governance_status: "PROCEED",
      requires_approval: false,
      reason: "Moderate risk with high confidence - standard protocols apply",
      rules_triggered: []
    },
    {
      region: "Urban Center C",
      risk_level: "HIGH",
      confidence: 0.68,
      governance_status: "ESCALATE",
      requires_approval: true,
      reason: "High risk with sub-threshold confidence requires review",
      rules_triggered: [
        "Rule: Risk level HIGH with confidence < 70% escalates",
        "Rule: Urban centers with 40K+ population require approval"
      ]
    }
  ],

  auditTrail: {
    trail: [
      {
        id: 1,
        timestamp: new Date().toISOString(),
        event_type: "DEMO_SCENARIO",
        region: null,
        payload: {
          scenario: "FLOOD_DISASTER",
          regions_affected: 3
        }
      },
      {
        id: 2,
        timestamp: new Date().toISOString(),
        event_type: "RISK_ASSESSMENT",
        region: "Coastal District A",
        payload: {
          risk_level: "CRITICAL",
          risk_score: 0.89,
          confidence: 0.72
        }
      },
      {
        id: 3,
        timestamp: new Date().toISOString(),
        event_type: "GOVERNANCE_CHECK",
        region: "Coastal District A",
        payload: {
          status: "ESCALATE",
          requires_approval: true
        }
      }
    ]
  },

  auditSummary: {
    total_events: 12,
    human_approvals: 0,
    autonomous_actions: 0,
    event_breakdown: {
      "DEMO_SCENARIO": 1,
      "RISK_ASSESSMENT": 3,
      "GOVERNANCE_CHECK": 3,
      "DECISION_SYNTHESIS": 3,
      "DATA_INGESTION": 2
    }
  }
};
