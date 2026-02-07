import { useEffect, useState } from 'react'
import { api } from '../api'
import CriticalRegionCard from './CriticalRegionCard'

export default function SituationalDashboard({ onSelectRegion }) {
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .getRiskAssessments()
      .then(setAssessments)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center py-20 text-gray-400">Loading situational awareness...</div>
  if (error) return <div className="text-center py-20 text-red-600">Error: {error}</div>
  if (assessments.length === 0)
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg">No data available</p>
        <p className="text-sm mt-2">Load a demo scenario to begin</p>
      </div>
    )

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-textPrimary mb-2">Situational Awareness Dashboard</h2>
        <p className="text-textSecondary text-sm">
          Multi-source risk assessment with explainable reasoning and uncertainty tracking
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {assessments.map((assessment) => (
          <CriticalRegionCard
            key={assessment.region}
            region={assessment.region}
            riskLevel={assessment.risk_level}
            riskScore={assessment.risk_score}
            confidence={assessment.confidence}
            hazard={assessment.components.hazard}
            exposure={assessment.components.exposure}
            vulnerability={assessment.components.vulnerability}
            uncertaintyWarnings={assessment.uncertainty_warnings}
            reasoningGraph={assessment.reasoning_graph}
            onViewDecisions={() => onSelectRegion?.(assessment.region)}
          />
        ))}
      </div>
    </div>
  )
}
