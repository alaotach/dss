import { useEffect, useState } from 'react'
import { api } from '../api'
import { CardSpotlight } from '@/components/ui/card-spotlight'
import { GlowingEffect } from '@/components/ui/glowing-effect'

const IRREVERSIBILITY_COLOR = {
  HIGH: 'text-textPrimary bg-riskHigh/20 border border-riskHigh',
  MEDIUM: 'text-textPrimary bg-riskMedium/20 border border-riskMedium',
  LOW: 'text-textPrimary bg-riskLow/20 border border-riskLow',
}

const ETHICS_COLOR = {
  HIGH: 'text-textPrimary bg-accent/20 border border-accent',
  MEDIUM: 'text-textPrimary bg-accent/10 border border-accent',
  LOW: 'text-textSecondary bg-surface border border-border',
}

export default function DecisionComparison({ selectedRegion, onApprove }) {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [approving, setApproving] = useState(null)
  const [approved, setApproved] = useState(new Set())

  useEffect(() => {
    api
      .getDecisionPackages()
      .then(setPackages)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleApprove = async (region, optionId) => {
    const key = `${region}::${optionId}`
    setApproving(key)
    try {
      await api.approveDecision(region, optionId)
      setApproved((prev) => new Set([...prev, key]))
      onApprove?.()
    } catch (e) {
      alert('Approval failed: ' + e.message)
    }
    setApproving(null)
  }

  if (loading) return <p className="text-textSecondary text-center py-20 text-sm">Loading decision packages...</p>
  if (error) return <p className="text-textPrimary bg-surface px-5 py-4 border border-riskHigh text-center mx-auto max-w-lg my-20 text-sm">{error}</p>
  if (packages.length === 0)
    return (
      <div className="text-center py-20 text-textSecondary">
        <p className="text-sm font-medium">No decision packages available</p>
        <p className="text-xs mt-2 text-textMuted">Load a scenario first</p>
      </div>
    )

  const filtered = selectedRegion
    ? packages.filter((p) => p.region === selectedRegion)
    : packages

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-textPrimary mb-2">Decision Comparison Interface</h2>
        <p className="text-textSecondary text-sm mb-4">
          Compare response options with benefit/risk trade-offs, reversibility, and ethical sensitivity
        </p>
        <div className="bg-panel border border-border px-4 py-3 text-sm text-textPrimary">
          <strong className="font-medium">Human-in-the-Loop Enforcement:</strong> No action will occur without explicit human approval
        </div>
      </div>

      <div className="space-y-8">
        {filtered.map((pkg) => (
          <div key={pkg.region} className="bg-surface/90 backdrop-blur-sm border-2 border-border rounded-xl overflow-hidden shadow-lg">
            {/* Header */}
            <div className="bg-surface text-textPrimary p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-1">{pkg.region}</h3>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="bg-surface/30 backdrop-blur-sm px-2 py-1 rounded font-semibold border border-border">
                      Risk: {pkg.risk_assessment.risk_level}
                    </span>
                    <span className="bg-surface/30 backdrop-blur-sm px-2 py-1 rounded border border-border">
                      Confidence: {(pkg.risk_assessment.confidence * 100).toFixed(0)}%
                    </span>
                    <span
                      className={`px-2 py-1 rounded font-semibold ${
                        pkg.governance.requires_human_approval
                          ? 'bg-yellow-500 text-gray-900'
                          : 'bg-green-500'
                      }`}
                    >
                      {pkg.governance.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Governance Notice */}
            <div className="bg-surface border-b border-border px-4 py-3 text-sm">
              <strong className="text-textPrimary font-medium">Governance:</strong>{' '}
              <span className="text-textSecondary">{pkg.governance.reason}</span>
            </div>

            {/* Options Grid */}
            <div className="p-5 bg-bg/50">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
                {pkg.options.map((option) => {
                  const key = `${pkg.region}::${option.id}`
                  const isApproved = approved.has(key)
                  const isLoading = approving === key

                  return (
                    <div key={option.id} className="relative h-full">
                      <GlowingEffect
                        spread={30}
                        glow={true}
                        disabled={isApproved}
                        proximity={70}
                        inactiveZone={0.1}
                        borderWidth={2}
                      />
                      <CardSpotlight
                        className={`h-full w-full border-2 ${
                          isApproved
                            ? 'bg-riskLow/30 border-riskLow'
                            : 'border-border bg-surface/95'
                        } backdrop-blur-sm`}
                        radius={300}
                        color={isApproved ? '#4B7F52' : '#64748B'}
                      >
                        <div className="relative z-20 h-full flex flex-col">
                      {/* Option Header */}
                      <div className="mb-3">
                        <h4 className="font-bold text-lg text-textPrimary mb-1">{option.title}</h4>
                        <p className="text-xs text-textSecondary">{option.description}</p>
                      </div>

                      {/* Benefit */}
                      <div className="mb-3 text-sm">
                        <div className="font-medium text-textPrimary mb-1">Benefit</div>
                        <div className="text-textSecondary">{option.benefit}</div>
                      </div>

                      {/* Tradeoffs */}
                      <div className="mb-3 text-sm">
                        <div className="font-medium text-textPrimary mb-1">Tradeoffs</div>
                        <ul className="text-textSecondary space-y-1">
                          {option.tradeoffs.map((t, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span>•</span>
                              <span>{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Metadata */}
                      <div className="flex flex-wrap gap-2 mb-3 text-xs">
                        <span
                          className={`px-2 py-1 rounded font-semibold ${
                            IRREVERSIBILITY_COLOR[option.irreversibility]
                          }`}
                        >
                          Irreversibility: {option.irreversibility}
                        </span>
                        <span
                          className={`px-2 py-1 rounded font-semibold ${
                            ETHICS_COLOR[option.ethical_sensitivity]
                          }`}
                        >
                          Ethics: {option.ethical_sensitivity}
                        </span>
                        <span className="px-2 py-1 font-medium bg-accent/20 text-textPrimary border border-accent text-xs">
                          Confidence: {(option.confidence * 100).toFixed(0)}%
                        </span>
                      </div>

                      {/* Approval Button */}
                      <div className="mt-auto">
                        {isApproved ? (
                          <div className="w-full bg-riskLow text-textPrimary text-center py-2 font-medium text-sm">
                            ✓ APPROVED
                          </div>
                        ) : (
                          <button
                            onClick={() => handleApprove(pkg.region, option.id)}
                            disabled={isLoading}
                            className="w-full bg-border hover:bg-accent text-textPrimary font-medium py-2 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            {isLoading ? 'Approving...' : 'APPROVE DECISION'}
                          </button>
                        )}
                      </div>
                        </div>
                      </CardSpotlight>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
