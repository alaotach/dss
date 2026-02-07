import { useEffect, useState } from 'react'
import { api } from '../api'

const IRREVERSIBILITY_COLOR = {
  HIGH: 'text-red-700 bg-red-100',
  MEDIUM: 'text-yellow-700 bg-yellow-100',
  LOW: 'text-green-700 bg-green-100',
}

const ETHICS_COLOR = {
  HIGH: 'text-purple-700 bg-purple-100',
  MEDIUM: 'text-blue-700 bg-blue-100',
  LOW: 'text-gray-700 bg-gray-100',
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

  if (loading) return <p className="text-gray-500 text-center py-20">Loading decision packages...</p>
  if (error) return <p className="text-red-600 text-center py-20">Error: {error}</p>
  if (packages.length === 0)
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg">No decision packages available</p>
        <p className="text-sm mt-1">Load a scenario first</p>
      </div>
    )

  const filtered = selectedRegion
    ? packages.filter((p) => p.region === selectedRegion)
    : packages

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Decision Comparison Interface</h2>
        <p className="text-gray-600 text-sm mb-4">
          Compare response options with benefit/risk trade-offs, reversibility, and ethical sensitivity
        </p>
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-sm text-gray-800">
          <strong>Human-in-the-Loop Enforcement:</strong> No action will occur without explicit human approval
        </div>
      </div>

      <div className="space-y-8">
        {filtered.map((pkg) => (
          <div key={pkg.region} className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gray-800 text-white p-5 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-1">{pkg.region}</h3>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="bg-white/20 px-2 py-1 rounded font-semibold">
                      Risk: {pkg.risk_assessment.risk_level}
                    </span>
                    <span className="bg-white/20 px-2 py-1 rounded">
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
            <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 text-sm">
              <strong className="text-gray-900">Governance:</strong>{' '}
              <span className="text-gray-700">{pkg.governance.reason}</span>
            </div>

            {/* Options Grid */}
            <div className="p-5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {pkg.options.map((option) => {
                  const key = `${pkg.region}::${option.id}`
                  const isApproved = approved.has(key)
                  const isLoading = approving === key

                  return (
                    <div
                      key={option.id}
                      className={`border-2 rounded-lg p-4 flex flex-col ${
                        isApproved
                          ? 'bg-green-50 border-green-400'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      {/* Option Header */}
                      <div className="mb-3">
                        <h4 className="font-bold text-lg text-gray-900 mb-1">{option.title}</h4>
                        <p className="text-xs text-gray-600">{option.description}</p>
                      </div>

                      {/* Benefit */}
                      <div className="mb-3 text-sm">
                        <div className="font-semibold text-green-700 mb-1">Benefit</div>
                        <div className="text-gray-700">{option.benefit}</div>
                      </div>

                      {/* Tradeoffs */}
                      <div className="mb-3 text-sm">
                        <div className="font-semibold text-orange-700 mb-1">Tradeoffs</div>
                        <ul className="text-gray-700 space-y-1">
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
                        <span className="px-2 py-1 rounded font-semibold bg-blue-100 text-blue-700">
                          Confidence: {(option.confidence * 100).toFixed(0)}%
                        </span>
                      </div>

                      {/* Approval Button */}
                      <div className="mt-auto">
                        {isApproved ? (
                          <div className="w-full bg-gray-700 text-white text-center py-3 rounded font-semibold">
                            APPROVED
                          </div>
                        ) : (
                          <button
                            onClick={() => handleApprove(pkg.region, option.id)}
                            disabled={isLoading}
                            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoading ? 'Approving...' : 'APPROVE DECISION'}
                          </button>
                        )}
                      </div>
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
