import { useEffect, useState } from 'react'
import { api } from '../api'

const RISK_COLORS = {
  HIGH: 'bg-red-100 text-red-800 border-red-300',
  MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  LOW: 'bg-green-100 text-green-800 border-green-300',
}

const RISK_DOT = {
  HIGH: 'bg-red-500',
  MEDIUM: 'bg-yellow-500',
  LOW: 'bg-green-500',
}

export default function Dashboard() {
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

  if (loading) return <p className="text-gray-500">Loading assessments…</p>
  if (error) return <p className="text-red-600">Error: {error}</p>
  if (assessments.length === 0)
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg">No data yet.</p>
        <p className="text-sm mt-1">
          Click <strong>"Load Sample Scenario"</strong> to begin.
        </p>
      </div>
    )

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Regional Risk Assessment Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assessments.map((a) => (
          <div
            key={a.region}
            className={`border rounded-lg p-5 ${RISK_COLORS[a.risk] || 'bg-gray-100'}`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg">{a.region}</h3>
              <span className="flex items-center gap-2 text-sm font-semibold">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${RISK_DOT[a.risk]}`}
                />
                {a.risk} RISK
              </span>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Confidence</span>
                <span className="font-mono">{(a.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-white/50 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${a.confidence * 100}%` }}
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1 opacity-70">
                Reasons
              </p>
              <ul className="text-sm space-y-1">
                {a.reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="mt-0.5">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
