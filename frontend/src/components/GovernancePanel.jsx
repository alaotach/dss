import { useEffect, useState } from 'react'
import { api } from '../api'

export default function GovernancePanel() {
  const [status, setStatus] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .getGovernanceStatus()
      .then(setStatus)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-textSecondary text-center py-20 text-sm">Loading governance status...</p>
  if (error) return <p className="text-textPrimary bg-surface px-5 py-4 border border-riskHigh text-center mx-auto max-w-lg my-20 text-sm">{error}</p>
  if (status.length === 0)
    return (
      <div className="text-center py-20 text-textSecondary">
        <p className="text-sm font-medium">No governance data available</p>
      </div>
    )

  const criticalCount = status.filter((s) => s.governance_status === 'ESCALATE').length
  const approvalCount = status.filter((s) => s.requires_approval).length

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-textPrimary mb-2">Governance & Human Oversight Panel</h2>
        <p className="text-textSecondary text-xs uppercase tracking-wide">
          Transparency into governance gate decisions and approval requirements
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-4xl font-bold text-slate-900 mb-2">{status.length}</div>
          <div className="text-sm text-slate-600 font-semibold uppercase tracking-wide">Total Regions</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-4xl font-bold text-blue-700 mb-2">{approvalCount}</div>
          <div className="text-sm text-blue-600 font-semibold uppercase tracking-wide">Require Human Approval</div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-4xl font-bold text-amber-700 mb-2">{criticalCount}</div>
          <div className="text-sm text-amber-600 font-semibold uppercase tracking-wide">Critical Escalations</div>
        </div>
      </div>

      {/* Core Principle Banner */}
      <div className="bg-surface text-textPrimary p-5 mb-6 border border-border">
        <h3 className="text-sm font-semibold mb-2 uppercase tracking-wide">Core Governance Principle</h3>
        <p className="text-sm leading-relaxed">
          This system <strong>NEVER</strong> executes decisions autonomously. All actions require
          explicit human approval. The governance gate evaluates risk confidence, data sufficiency,
          action irreversibility, and ethical sensitivity before allowing any decision to proceed.
        </p>
      </div>

      {/* Governance Table */}
      <div className="bg-panel border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-textPrimary">Region</th>
              <th className="px-4 py-3 text-left font-medium text-textPrimary">Risk Level</th>
              <th className="px-4 py-3 text-left font-medium text-textPrimary">Confidence</th>
              <th className="px-4 py-3 text-left font-medium text-textPrimary">Governance Status</th>
              <th className="px-4 py-3 text-left font-medium text-textPrimary">Approval Required</th>
              <th className="px-4 py-3 text-left font-medium text-textPrimary">Reason</th>
            </tr>
          </thead>
          <tbody>
            {status.map((item, i) => (
              <tr key={i} className="border-b border-border hover:bg-surface/50">
                <td className="px-4 py-3 font-medium text-textPrimary">{item.region}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium ${
                      item.risk_level === 'CRITICAL'
                        ? 'bg-riskHigh text-textPrimary'
                        : item.risk_level === 'HIGH'
                        ? 'bg-[#7A3B3B] text-textPrimary'
                        : item.risk_level === 'MEDIUM'
                        ? 'bg-riskMedium text-textPrimary'
                        : 'bg-riskLow text-textPrimary'
                    }`}
                  >
                    {item.risk_level}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-textSecondary">
                        : item.confidence >= 0.5
                        ? 'text-yellow-700'
                        : 'text-red-700'
                    }`}
                  >
                    {(item.confidence * 100).toFixed(0)}%
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                      item.governance_status === 'ESCALATE'
                        ? 'bg-red-100 text-red-800'
                        : item.governance_status === 'REQUEST_MORE_DATA'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {item.governance_status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {item.requires_approval ? (
                    <span className="text-red-600 font-bold">YES</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">{item.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
