import { useEffect, useState } from 'react'
import { api } from '../api'
import { CardSpotlight } from '@/components/ui/card-spotlight'
import { GlowingEffect } from '@/components/ui/glowing-effect'

const EVENT_COLORS = {
  DATA_INGESTION: 'bg-accent/20 text-textPrimary border border-accent',
  RISK_ASSESSMENT: 'bg-riskMedium/20 text-textPrimary border border-riskMedium',
  DECISION_SYNTHESIS: 'bg-accent/20 text-textPrimary border border-accent',
  GOVERNANCE_CHECK: 'bg-riskMedium/20 text-textPrimary border border-riskMedium',
  HUMAN_APPROVAL: 'bg-riskLow/20 text-textPrimary border border-riskLow',
  DEMO_SCENARIO: 'bg-surface text-textSecondary border border-border',
  DEMO_UNCERTAINTY_INJECTION: 'bg-riskHigh/20 text-textPrimary border border-riskHigh',
  DEMO_CONFLICTING_REPORTS: 'bg-riskUncertain/20 text-textPrimary border border-riskUncertain',
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
    return <p className="text-textSecondary text-center py-20 text-sm">Loading audit trail...</p>
  if (error) return <p className="text-textPrimary bg-surface px-5 py-4 border border-riskHigh text-center mx-auto max-w-lg my-20 text-sm">{error}</p>

  const eventTypes = ['ALL', ...Object.keys(summary?.event_breakdown || {})]
  const filtered = filterType === 'ALL' ? trail : trail.filter((e) => e.event_type === filterType)

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-textPrimary mb-2">Audit Trail & Accountability</h2>
        <p className="text-textSecondary text-sm mb-4">
          Immutable record of all system decisions, data ingestion, and human approvals
        </p>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 items-stretch">
          <div className="relative h-full">
            <GlowingEffect spread={25} glow={true} proximity={60} borderWidth={1.5} />
            <CardSpotlight className="h-full w-full border border-border bg-surface/95 backdrop-blur-sm" radius={250} color="#64748B">
              <div className="relative z-20">
                <div className="text-2xl font-semibold text-textPrimary mb-1">{summary.total_events}</div>
                <div className="text-xs text-textSecondary uppercase tracking-wide">Total Events</div>
              </div>
            </CardSpotlight>
          </div>
          <div className="relative h-full">
            <GlowingEffect spread={25} glow={true} proximity={60} borderWidth={1.5} />
            <CardSpotlight className="h-full w-full border border-border bg-surface/95 backdrop-blur-sm" radius={250} color="#4B7F52">
              <div className="relative z-20">
                <div className="text-2xl font-semibold text-textPrimary mb-1">{summary.human_approvals}</div>
                <div className="text-xs text-textSecondary uppercase tracking-wide">Human Approvals</div>
              </div>
            </CardSpotlight>
          </div>
          <div className="relative h-full">
            <GlowingEffect spread={25} glow={true} proximity={60} borderWidth={1.5} />
            <CardSpotlight className="h-full w-full border border-border bg-surface/95 backdrop-blur-sm" radius={250} color="#7A3B3B">
              <div className="relative z-20">
                <div className="text-2xl font-semibold text-textPrimary mb-1">{summary.autonomous_actions}</div>
                <div className="text-xs text-textSecondary uppercase tracking-wide">Autonomous Actions</div>
              </div>
            </CardSpotlight>
          </div>
          <div className="relative h-full">
            <GlowingEffect spread={25} glow={true} proximity={60} borderWidth={1.5} />
            <CardSpotlight className="h-full w-full border border-border bg-surface/95 backdrop-blur-sm" radius={250} color="#8A6A2F">
              <div className="relative z-20">
                <div className="text-2xl font-semibold text-textPrimary mb-1">
                  {Object.keys(summary.event_breakdown).length}
                </div>
                <div className="text-xs text-textSecondary uppercase tracking-wide">Event Types</div>
              </div>
            </CardSpotlight>
          </div>
        </div>
      )}

      {/* Accountability Banner */}
      <div className="bg-surface/90 backdrop-blur-sm text-textPrimary p-5 mb-6 border border-border rounded-lg">
        <h3 className="text-sm font-semibold mb-2 uppercase tracking-wide">100% Traceability</h3>
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
            className={`text-xs font-medium px-3 py-2 border transition ${
              filterType === type
                ? 'bg-accent text-textPrimary border-accent'
                : 'bg-surface text-textSecondary border-border hover:border-accent'
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
        <p className="text-textMuted text-center py-10 text-sm">No events match the selected filter</p>
      ) : (
        <div className="bg-panel/90 backdrop-blur-sm border border-border overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-textPrimary text-xs uppercase tracking-wide">Timestamp</th>
                  <th className="px-4 py-3 text-left font-medium text-textPrimary text-xs uppercase tracking-wide">Event Type</th>
                  <th className="px-4 py-3 text-left font-medium text-textPrimary text-xs uppercase tracking-wide">Region</th>
                  <th className="px-4 py-3 text-left font-medium text-textPrimary text-xs uppercase tracking-wide">Details</th>
                  <th className="px-4 py-3 text-center font-medium text-textPrimary text-xs uppercase tracking-wide">Expand</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((event) => (
                  <tr key={event.id} className="border-b border-border hover:bg-surface/50">
                    <td className="px-4 py-3 text-xs font-mono text-textMuted whitespace-nowrap">
                      {new Date(event.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium ${
                          EVENT_COLORS[event.event_type] || 'bg-surface text-textSecondary border border-border'
                        }`}
                      >
                        {event.event_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-textPrimary">{event.region || '—'}</td>
                    <td className="px-4 py-3 text-xs text-textSecondary">
                      {event.event_type === 'HUMAN_APPROVAL' && event.payload.option_title ? (
                        <span className="font-medium text-textPrimary">
                          Approved: {event.payload.option_title}
                        </span>
                      ) : event.event_type === 'RISK_ASSESSMENT' && event.payload.risk_level ? (
                        <span>
                          Risk: <strong className="text-textPrimary">{event.payload.risk_level}</strong> (conf{' '}
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
                        className="text-accent hover:text-textPrimary font-medium text-xs"
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
            <div className="bg-surface border-t border-border p-4">
              {(() => {
                const event = filtered.find((e) => e.id === expandedId)
                return (
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-textPrimary uppercase tracking-wide">Full Event Payload</h4>
                    <pre className="text-xs bg-bg text-textSecondary border border-border p-3 overflow-x-auto font-mono">
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
