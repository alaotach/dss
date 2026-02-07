import { useEffect, useState } from 'react'
import { api } from '../api'

const CATEGORY_COLOR = {
  INGEST: 'bg-blue-100 text-blue-700',
  RISK: 'bg-orange-100 text-orange-700',
  DECISION: 'bg-purple-100 text-purple-700',
  APPROVAL: 'bg-green-100 text-green-700',
  SYSTEM: 'bg-gray-200 text-gray-700',
}

export default function LogsView() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    api
      .getLogs()
      .then(setLogs)
      .finally(() => setLoading(false))
  }, [])

  const filtered =
    filter === 'ALL' ? logs : logs.filter((l) => l.category === filter)

  const categories = ['ALL', ...new Set(logs.map((l) => l.category))]

  if (loading) return <p className="text-gray-500">Loading logs…</p>

  return (
    <div>
      <h2 className="text-lg font-semibold mb-1">Audit Log</h2>
      <p className="text-sm text-gray-500 mb-4">
        Every ingestion, assessment, and approval is recorded for transparency.
      </p>

      {/* Filter buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`text-xs font-medium px-3 py-1 rounded-full border transition ${
              filter === c
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-400 text-sm">No log entries.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-3 py-2 font-semibold">Time</th>
                <th className="px-3 py-2 font-semibold">Category</th>
                <th className="px-3 py-2 font-semibold">Region</th>
                <th className="px-3 py-2 font-semibold">Message</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-3 py-2 text-xs font-mono text-gray-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        CATEGORY_COLOR[log.category] || 'bg-gray-100'
                      }`}
                    >
                      {log.category}
                    </span>
                  </td>
                  <td className="px-3 py-2">{log.region || '—'}</td>
                  <td className="px-3 py-2">{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
