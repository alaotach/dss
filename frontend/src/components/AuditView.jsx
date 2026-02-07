import { useEffect, useState } from 'react'
import { api } from '../api'

const EVENT_COLORS = {
  DATA_INGESTION: 'bg-blue-100 text-blue-800',
  RISK_ASSESSMENT: 'bg-orange-100 text-orange-800',
  DECISION_SYNTHESIS: 'bg-purple-100 text-purple-800',
  GOVERNANCE_CHECK: 'bg-yellow-100 text-yellow-800',
  HUMAN_APPROVAL: 'bg-green-100 text-green-800',
  DEMO_SCENARIO: 'bg-gray-100 text-gray-800',
  DEMO_UNCERTAINTY_INJECTION: 'bg-red-100 text-red-800',
  DEMO_CONFLICTING_REPORTS: 'bg-pink-100 text-pink-800',
}

export default function AuditView() {
  const [trail, setTrail] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [filterType, setFilterType] = useState('ALL')

  useEffect(() => {
    Promise.all([api.getAuditTrail(), api.getAuditSummary()])
      .then(([trailData, summaryData]) => {
        setTrail(trailData.trail || [])
        setSummary(summaryData)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading)
    return <p className="text-gray-500 text-center py-20">Loading audit trail...</p>
  if (error) return <p className="text-red-600 text-center py-20">Error: {error}</p>

  const eventTypes = ['ALL', ...Object.keys(summary?.event_breakdown || {})]
  const filtered = filterType === 'ALL' ? trail : trail.filter((e) => e.event_type === filterType)

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Audit Trail & Accountability</h2>
        <p className="text-gray-600 text-sm mb-4">
          Immutable record of all system decisions, data ingestion, and human approvals
        </p>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-300 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900 mb-1">{summary.total_events}</div>
            <div className="text-xs text-gray-600 font-semibold">Total Events</div>
          </div>
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-800 mb-1">{summary.human_approvals}</div>
            <div className="text-xs text-gray-600 font-semibold">Human Approvals</div>
          </div>
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-800 mb-1">{summary.autonomous_actions}</div>
            <div className="text-xs text-gray-600 font-semibold">Autonomous Actions</div>
          </div>
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-800 mb-1">
              {Object.keys(summary.event_breakdown).length}
            </div>
            <div className="text-xs text-gray-600 font-semibold">Event Types</div>
          </div>
        </div>
      )}

      {/* Accountability Banner */}
      <div className="bg-gray-800 text-white rounded-lg p-5 mb-6 border border-gray-700">
        <h3 className="text-lg font-bold mb-2">100% Traceability</h3>
        <p className="text-sm">
          Every decision, risk assessment, and data ingestion is logged with full context. This
          system maintains complete accountability: <strong>{summary?.human_approvals || 0} human
          approvals</strong> recorded, <strong>{summary?.autonomous_actions || 0} autonomous
          actions</strong> executed.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {eventTypes.map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`text-xs font-semibold px-3 py-2 rounded-full border transition ${
              filterType === type
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
            }`}
          >
            {type}
            {type !== 'ALL' && summary?.event_breakdown[type] && (
              <span className="ml-1 opacity-75">({summary.event_breakdown[type]})</span>
            )}
          </button>
        ))}
      </div>

      {/* Trail Table */}
      {filtered.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No events match the selected filter</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Timestamp</th>
                  <th className="px-4 py-3 text-left font-semibold">Event Type</th>
                  <th className="px-4 py-3 text-left font-semibold">Region</th>
                  <th className="px-4 py-3 text-left font-semibold">Details</th>
                  <th className="px-4 py-3 text-center font-semibold">Expand</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((event) => (
                  <tr key={event.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs font-mono text-gray-500 whitespace-nowrap">
                      {new Date(event.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          EVENT_COLORS[event.event_type] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {event.event_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{event.region || '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {event.event_type === 'HUMAN_APPROVAL' && event.payload.option_title ? (
                        <span className="font-semibold text-green-700">
                          Approved: {event.payload.option_title}
                        </span>
                      ) : event.event_type === 'RISK_ASSESSMENT' && event.payload.risk_level ? (
                        <span>
                          Risk: <strong>{event.payload.risk_level}</strong> (conf{' '}
                          {(event.payload.confidence * 100).toFixed(0)}%)
                        </span>
                      ) : event.event_type === 'DATA_INGESTION' && event.payload.data_type ? (
                        <span>
                          {event.payload.source_type} → {event.payload.data_type}:{' '}
                          {event.payload.value}
                        </span>
                      ) : (
                        JSON.stringify(event.payload).substring(0, 50)
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-xs"
                      >
                        {expandedId === event.id ? '▼' : '▶'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Expanded Row Details */}
          {expandedId && (
            <div className="bg-gray-50 border-t p-4">
              {(() => {
                const event = filtered.find((e) => e.id === expandedId)
                return (
                  <div>
                    <h4 className="font-bold text-sm mb-2">Full Event Payload</h4>
                    <pre className="text-xs bg-white border rounded p-3 overflow-x-auto">
                      {JSON.stringify(event.payload, null, 2)}
                    </pre>
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
