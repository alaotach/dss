import { useEffect, useState } from 'react'
import { api } from '../api'

const RISK_BADGE = {
  HIGH: 'bg-red-600',
  MEDIUM: 'bg-yellow-500',
  LOW: 'bg-green-600',
}

export default function DecisionPanel({ onApprove }) {
  const [regions, setRegions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [approving, setApproving] = useState(null)
  const [approvedSet, setApprovedSet] = useState(new Set())

  useEffect(() => {
    api
      .getDecisionOptions()
      .then(setRegions)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleApprove = async (region, optionId) => {
    const key = `${region}::${optionId}`
    setApproving(key)
    try {
      await api.approveDecision(region, optionId)
      setApprovedSet((prev) => new Set([...prev, key]))
      onApprove?.()
    } catch (e) {
      alert('Approval failed: ' + e.message)
    }
    setApproving(null)
  }

  if (loading) return <p className="text-gray-500">Loading decision options…</p>
  if (error) return <p className="text-red-600">Error: {error}</p>
  if (regions.length === 0)
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg">No decision options available.</p>
        <p className="text-sm mt-1">Load a scenario first.</p>
      </div>
    )

  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">Decision Options</h2>
      <p className="text-sm text-gray-500 mb-4">
        Review trade-offs and approve actions. No option executes without your
        explicit approval.
      </p>

      <div className="space-y-6">
        {regions.map((r) => (
          <div key={r.region} className="bg-white border rounded-lg p-5">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="font-bold text-lg">{r.region}</h3>
              <span
                className={`text-white text-xs font-bold px-2 py-0.5 rounded ${RISK_BADGE[r.risk]}`}
              >
                {r.risk}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {r.options.map((opt) => {
                const key = `${r.region}::${opt.id}`
                const isApproved = approvedSet.has(key)
                const isLoading = approving === key

                return (
                  <div
                    key={opt.id}
                    className={`border rounded-lg p-4 flex flex-col justify-between ${
                      isApproved
                        ? 'bg-green-50 border-green-300'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div>
                      <h4 className="font-semibold text-sm mb-2">
                        {opt.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-3">
                        {opt.description}
                      </p>

                      <div className="text-xs space-y-1 mb-3">
                        <div>
                          <span className="font-semibold text-green-700">
                            Benefit:{' '}
                          </span>
                          {opt.expected_benefit}
                        </div>
                        <div>
                          <span className="font-semibold text-red-700">
                            Risk:{' '}
                          </span>
                          {opt.potential_risk}
                        </div>
                        <div>
                          <span className="font-semibold text-blue-700">
                            Confidence:{' '}
                          </span>
                          {(opt.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>

                    {isApproved ? (
                      <div className="text-green-700 text-xs font-semibold text-center py-2">
                        ✓ Approved
                      </div>
                    ) : (
                      <button
                        onClick={() => handleApprove(r.region, opt.id)}
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded transition disabled:opacity-50"
                      >
                        {isLoading ? 'Approving…' : 'Approve'}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
