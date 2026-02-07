import { useEffect, useState } from 'react'
import { api } from '../api'

const RISK_COLORS = {
  CRITICAL: 'bg-riskHigh text-textPrimary border-riskHigh',
  HIGH: 'bg-[#7A3B3B] text-textPrimary border-[#7A3B3B]',
  MEDIUM: 'bg-riskMedium text-textPrimary border-riskMedium',
  LOW: 'bg-riskLow text-textPrimary border-riskLow',
}

const RISK_BADGES = {
  CRITICAL: 'bg-riskHigh/20 text-textPrimary border border-riskHigh',
  HIGH: 'bg-[#7A3B3B]/20 text-textPrimary border border-[#7A3B3B]',
  MEDIUM: 'bg-riskMedium/20 text-textPrimary border border-riskMedium',
  LOW: 'bg-riskLow/20 text-textPrimary border border-riskLow',
}

export default function SituationalDashboard({ onSelectRegion }) {
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedRegion, setExpandedRegion] = useState(null)

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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Situational Awareness Dashboard</h2>
        <p className="text-gray-600 text-sm">
          Multi-source risk assessment with explainable reasoning and uncertainty tracking
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {assessments.map((assessment) => (
          <div
            key={assessment.region}
            className={`border-2 rounded-xl overflow-hidden transition-all ${
              RISK_COLORS[assessment.risk_level]
            } ${expandedRegion === assessment.region ? 'col-span-full' : ''}`}
          >
            {/* Header */}
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{assessment.region}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    RISK_BADGES[assessment.risk_level]
                  }`}
                >
                  {assessment.risk_level} RISK
                </span>
              </div>

              {/* Risk Score */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">Risk Score</span>
                  <span className="font-mono">{(assessment.risk_score * 100).toFixed(1)}/100</span>
                </div>
                <div className="w-full bg-black/20 h-2">
                  <div
                    className="bg-textPrimary h-2 transition-all"
                    style={{ width: `${assessment.risk_score * 100}%` }}
                  />
                </div>
              </div>

              {/* Confidence */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">Confidence</span>
                  <span className="font-mono">{(assessment.confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-black/20 h-2">
                  <div
                    className="bg-textSecondary h-2 transition-all"
                    style={{ width: `${assessment.confidence * 100}%` }}
                  />
                </div>
              </div>

              {/* Components */}
              <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                <div className="bg-black/20 p-2 text-center">
                  <div className="font-medium text-xs">Hazard</div>
                  <div className="text-lg font-semibold">{(assessment.components.hazard * 100).toFixed(0)}%</div>
                </div>
                <div className="bg-black/20 p-2 text-center">
                  <div className="font-medium text-xs">Exposure</div>
                  <div className="text-lg font-semibold">{(assessment.components.exposure * 100).toFixed(0)}%</div>
                </div>
                <div className="bg-black/20 p-2 text-center">
                  <div className="font-medium text-xs">Vulnerability</div>
                  <div className="text-lg font-semibold">{(assessment.components.vulnerability * 100).toFixed(0)}%</div>
                </div>
              </div>

              {/* Uncertainty Warnings */}
              {assessment.uncertainty_warnings && assessment.uncertainty_warnings.length > 0 && (
                <div className="bg-red-900/50 border border-red-700 rounded p-3 mb-4 text-sm">
                <div className="font-semibold mb-1">Uncertainty Warnings</div>
                  <ul className="space-y-1">
                    {assessment.uncertainty_warnings.map((warning, i) => (
                      <li key={i}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Reasoning Toggle */}
              <button
                onClick={() =>
                  setExpandedRegion(expandedRegion === assessment.region ? null : assessment.region)
                }
                className="w-full bg-white/10 hover:bg-white/20 border border-white/30 rounded py-2 text-sm font-medium transition"
              >
                {expandedRegion === assessment.region ? 'Hide Reasoning' : 'Show Explainable Reasoning'}
              </button>
            </div>

            {/* Expanded Reasoning */}
            {expandedRegion === assessment.region && (
              <div className="bg-white/10 border-t border-white/30 p-5">
                <h4 className="font-bold mb-3 text-sm uppercase tracking-wide">Reasoning Graph</h4>
                <ul className="space-y-2">
                  {assessment.reasoning_graph.map((reason, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-1 flex-shrink-0 text-xs text-white/70">
                        {reason.startsWith('⚠') ? '!' : '•'}
                      </span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="bg-black/10 border-t border-white/30 p-3 flex justify-end">
              <button
                onClick={() => onSelectRegion?.(assessment.region)}
                className="bg-white/20 hover:bg-white/30 border border-white/40 px-4 py-2 rounded text-sm font-semibold transition"
              >
                View Decision Options
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
