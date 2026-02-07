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

  if (loading) return <p className="text-gray-500 text-center py-20">Loading governance status...</p>
  if (error) return <p className="text-red-600 text-center py-20">Error: {error}</p>
  if (status.length === 0)
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg">No governance data available</p>
      </div>
    )

  const criticalCount = status.filter((s) => s.governance_status === 'ESCALATE').length
  const approvalCount = status.filter((s) => s.requires_approval).length

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Governance & Human Oversight Panel</h2>
        <p className="text-gray-600 text-sm">
          Transparency into governance gate decisions and approval requirements
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-5">
          <div className="text-3xl font-bold text-gray-800 mb-1">{status.length}</div>
          <div className="text-sm text-gray-600 font-semibold">Total Regions</div>
        </div>
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-5">
          <div className="text-3xl font-bold text-gray-800 mb-1">{approvalCount}</div>
          <div className="text-sm text-gray-600 font-semibold">Require Human Approval</div>
        </div>
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-5">
          <div className="text-3xl font-bold text-gray-800 mb-1">{criticalCount}</div>
          <div className="text-sm text-gray-600 font-semibold">Critical Escalations</div>
        </div>
      </div>

      {/* Core Principle Banner */}
      <div className="bg-gray-800 text-white rounded-lg p-6 mb-6 border border-gray-700">
        <h3 className="text-lg font-bold mb-2">Core Governance Principle</h3>
        <p className="text-sm leading-relaxed">
          This system <strong>NEVER</strong> executes decisions autonomously. All actions require
          explicit human approval. The governance gate evaluates risk confidence, data sufficiency,
          action irreversibility, and ethical sensitivity before allowing any decision to proceed.
        </p>
      </div>

      {/* Governance Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Region</th>
              <th className="px-4 py-3 text-left font-semibold">Risk Level</th>
              <th className="px-4 py-3 text-left font-semibold">Confidence</th>
              <th className="px-4 py-3 text-left font-semibold">Governance Status</th>
              <th className="px-4 py-3 text-left font-semibold">Approval Required</th>
              <th className="px-4 py-3 text-left font-semibold">Reason</th>
            </tr>
          </thead>
          <tbody>
            {status.map((item, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">{item.region}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                      item.risk_level === 'CRITICAL'
                        ? 'bg-red-600 text-white'
                        : item.risk_level === 'HIGH'
                        ? 'bg-orange-500 text-white'
                        : item.risk_level === 'MEDIUM'
                        ? 'bg-yellow-400 text-gray-900'
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    {item.risk_level}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`font-mono ${
                      item.confidence >= 0.7
                        ? 'text-green-700'
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
