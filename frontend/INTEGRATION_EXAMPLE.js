// Example integration for SituationalDashboard.jsx
// Add this import at the top:
import { CriticalRegionCard } from './CriticalRegionCard'

// Option 1: Replace CRITICAL risk cards with spotlight cards
// In your assessments.map(), add this condition:

assessments.map((assessment) => {
  // Use spotlight card for CRITICAL risks
  if (assessment.risk_level === 'CRITICAL') {
    return (
      <div key={assessment.region}>
        <CriticalRegionCard
          region={assessment.region}
          riskLevel={assessment.risk_level}
          riskScore={assessment.risk_score}
          confidence={assessment.confidence}
        />
      </div>
    )
  }

  // Keep your existing card layout for other risk levels
  return (
    <div
      key={assessment.region}
      className={`border overflow-hidden ${RISK_COLORS[assessment.risk_level]}`}
    >
      {/* Your existing card content */}
    </div>
  )
})

// Option 2: Add a dedicated "Critical Alerts" section at the top
// Add this before your existing grid:

{assessments.some(a => a.risk_level === 'CRITICAL') && (
  <div className="mb-8">
    <h3 className="text-lg font-semibold text-textPrimary mb-4 uppercase tracking-wide">
      Critical Situations Requiring Immediate Attention
    </h3>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {assessments
        .filter(a => a.risk_level === 'CRITICAL')
        .map(assessment => (
          <CriticalRegionCard
            key={assessment.region}
            region={assessment.region}
            riskLevel={assessment.risk_level}
            riskScore={assessment.risk_score}
            confidence={assessment.confidence}
          />
        ))
      }
    </div>
  </div>
)}
