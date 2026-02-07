import { useState } from 'react'
import { LayoutDashboard, Scale, ShieldCheck, FileText, Waves, AlertTriangle, Database } from 'lucide-react'
import SituationalDashboard from './components/SituationalDashboard'
import DecisionComparison from './components/DecisionComparison'
import GovernancePanel from './components/GovernancePanel'
import AuditView from './components/AuditView'
import { WavyBackground } from './components/ui/wavy-background'
import { AnimeNavBar } from './components/ui/anime-navbar'
import { api } from './api'

const TABS = [
  { id: 'dashboard', label: 'Situational Awareness', icon: LayoutDashboard },
  { id: 'decisions', label: 'Decision Comparison', icon: Scale },
  { id: 'governance', label: 'Governance', icon: ShieldCheck },
  { id: 'audit', label: 'Audit Trail', icon: FileText },
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

  const dropdownItems = [
    {
      label: 'Load Flood Scenario',
      icon: Waves,
      onClick: handleLoadScenario,
      disabled: loading
    },
    {
      label: 'Conflicting Reports',
      icon: AlertTriangle,
      onClick: handleConflictingReports,
      disabled: loading
    },
    {
      label: 'Inject Uncertainty',
      icon: Database,
      onClick: handleInjectUncertainty,
      disabled: loading
    }
  ]

  return (
    <WavyBackground 
      colors={[
        "#1e293b",
        "#334155",
        "#475569",
        "#64748b",
        "#374151",
      ]}
      waveWidth={60}
      backgroundFill="#0F172A"
      blur={12}
      speed="slow"
      waveOpacity={0.3}
    >
      <div className="min-h-screen flex flex-col">
        {/* Simplified Header */}
        <header className="text-center py-6">
          <h1 className="text-3xl font-bold tracking-tight text-textPrimary mb-2">
            Advanced Disaster Response DSS
          </h1>
          <p className="text-textSecondary text-sm">
            Explainable Risk Assessment • Human-in-the-Loop • Full Traceability
          </p>
        </header>

      {/* Message Banner */}
      {message && (
        <div
          className={`px-6 py-3 text-sm font-medium backdrop-blur-sm ${
            message.type === 'error'
              ? 'bg-riskHigh/80 border-b border-riskHigh text-textPrimary'
              : 'bg-riskLow/80 border-b border-riskLow text-textPrimary'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Tab Navigation */}
      <AnimeNavBar 
        items={TABS} 
        defaultActive="dashboard" 
        onTabChange={(tabId) => setTab(tabId)}
        dropdownItems={dropdownItems}
      />

      {/* Main Content */}
      <main className="flex-1 p-6 bg-transparent">
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
      <footer className="bg-surface/90 backdrop-blur-sm border-t border-border px-6 py-4 text-center text-xs text-textSecondary">
        <div className="mb-1">
          <strong>Academic Demonstration System</strong> — Mock Data Only — No Real-World Actions
        </div>
        <div>
          Architecture: Multi-source Fusion • Explainable Risk Assessment • Governance Gate •
          Immutable Audit Trail
        </div>
      </footer>
      </div>
    </WavyBackground>
  )
}

