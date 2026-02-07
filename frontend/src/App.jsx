import { useState } from 'react'
import SituationalDashboard from './components/SituationalDashboard'
import DecisionComparison from './components/DecisionComparison'
import GovernancePanel from './components/GovernancePanel'
import AuditView from './components/AuditView'
import { api } from './api'

const TABS = [
  { id: 'dashboard', label: 'Situational Awareness', icon: null },
  { id: 'decisions', label: 'Decision Comparison', icon: null },
  { id: 'governance', label: 'Governance', icon: null },
  { id: 'audit', label: 'Audit Trail', icon: null },
]

export default function App() {
  const [tab, setTab] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedRegion, setSelectedRegion] = useState(null)

  const showMessage = (msg, type = 'success') => {
    setMessage({ text: msg, type })
    setTimeout(() => setMessage(null), 5000)
  }

  const refresh = () => setRefreshKey((k) => k + 1)

  const handleLoadScenario = async () => {
    setLoading(true)
    try {
      const result = await api.loadScenario()
      showMessage(`${result.message} (${result.regions} regions, ${result.data_points} data points)`)
      refresh()
      setTab('dashboard')
    } catch (e) {
      showMessage('Error loading scenario: ' + e.message, 'error')
    }
    setLoading(false)
  }

  const handleInjectUncertainty = async () => {
    if (!selectedRegion) {
      showMessage('Select a region from the dashboard first', 'error')
      return
    }
    setLoading(true)
    try {
      await api.injectUncertainty(selectedRegion)
      showMessage(`Uncertainty injected for ${selectedRegion}`)
      refresh()
    } catch (e) {
      showMessage('Error: ' + e.message, 'error')
    }
    setLoading(false)
  }

  const handleConflictingReports = async () => {
    setLoading(true)
    try {
      await api.loadConflictingReports()
      showMessage('Conflicting reports scenario loaded — check "Disputed Zone"')
      refresh()
    } catch (e) {
      showMessage('Error: ' + e.message, 'error')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white shadow-md border-b border-gray-800">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                🛡️ Advanced Disaster Response DSS
              </h1>
              <p className="text-blue-200 text-sm mt-1">
                Explainable Risk Assessment • Human-in-the-Loop • Full Traceability
              </p>
            </div>
          </div>

          {/* Demo Controls */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleLoadScenario}
              disabled={loading}
              className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded transition disabled:opacity-50 text-sm border border-gray-600"
            >
              Load Flood Scenario
            </button>
            <button
              onClick={handleConflictingReports}
              disabled={loading}
              className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded transition disabled:opacity-50 text-sm border border-gray-600"
            >
              Conflicting Reports
            </button>
            <button
              onClick={handleInjectUncertainty}
              disabled={loading}
              className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded transition disabled:opacity-50 text-sm border border-gray-600"
            >
              Inject Uncertainty
            </button>
          </div>
        </div>
      </header>

      {/* Message Banner */}
      {message && (
        <div
          className={`px-6 py-3 text-sm font-medium ${
            message.type === 'error'
              ? 'bg-red-100 border-b border-red-300 text-red-800'
              : 'bg-green-100 border-b border-green-300 text-green-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Tab Navigation */}
      <nav className="bg-white border-b shadow-sm">
        <div className="px-6 flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-3 text-sm font-semibold rounded-t-lg transition ${
                tab === t.id
                  ? 'bg-gray-50 text-gray-900 border-t-2 border-x border-gray-400'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {tab === 'dashboard' && (
            <SituationalDashboard
              key={refreshKey}
              onSelectRegion={(region) => {
                setSelectedRegion(region)
                setTab('decisions')
              }}
            />
          )}
          {tab === 'decisions' && (
            <DecisionComparison
              key={refreshKey}
              selectedRegion={selectedRegion}
              onApprove={() => {
                showMessage('Decision approved and logged to audit trail')
                refresh()
              }}
            />
          )}
          {tab === 'governance' && <GovernancePanel key={refreshKey} />}
          {tab === 'audit' && <AuditView key={refreshKey} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t px-6 py-4 text-center text-xs text-gray-500">
        <div className="mb-1">
          <strong>Academic Demonstration System</strong> — Mock Data Only — No Real-World Actions
        </div>
        <div>
          Architecture: Multi-source Fusion • Explainable Risk Assessment • Governance Gate •
          Immutable Audit Trail
        </div>
      </footer>
    </div>
  )
}

