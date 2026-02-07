import { CriticalRegionCard } from './components/CriticalRegionCard'
import { GovernanceAlertCard } from './components/GovernanceAlertCard'

export default function SpotlightDemo() {
  return (
    <div className="min-h-screen bg-bg p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-textPrimary mb-2">
          CardSpotlight Component Demo
        </h1>
        <p className="text-textSecondary mb-8">
          Hover over the cards to see the interactive spotlight effect
        </p>

        {/* Critical Region Cards */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-textPrimary mb-4 uppercase tracking-wide">
            Critical Region Cards
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CriticalRegionCard
              region="Region Alpha"
              riskLevel="CRITICAL"
              riskScore={0.92}
              confidence={0.87}
            />
            <CriticalRegionCard
              region="Region Beta"
              riskLevel="HIGH"
              riskScore={0.78}
              confidence={0.91}
            />
          </div>
        </section>

        {/* Governance Alert Cards */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-textPrimary mb-4 uppercase tracking-wide">
            Governance Alert Cards
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GovernanceAlertCard
              title="Evacuation Approval Required"
              message="Region Alpha requires immediate evacuation approval due to critical flood risk."
              status="ESCALATE"
              rules={[
                'Risk level exceeds 90% threshold',
                'Confidence level meets minimum requirements',
                'Critical infrastructure under threat',
                'Population affected: 50,000+'
              ]}
            />
            <GovernanceAlertCard
              title="Resource Allocation Approval"
              message="Emergency resource deployment to Region Beta requires governance oversight."
              status="PROCEED"
              rules={[
                'High risk level with strong confidence',
                'Clear benefit-risk analysis available',
                'Reversible action with low ethical concerns'
              ]}
            />
          </div>
        </section>

        {/* Instructions */}
        <section className="bg-panel border border-border p-6">
          <h3 className="text-lg font-semibold text-textPrimary mb-3">
            How to Use in Your DSS App
          </h3>
          <ul className="space-y-2 text-textSecondary text-sm">
            <li>• Move your mouse over the cards to see the spotlight effect</li>
            <li>• Hover to reveal the animated particle background</li>
            <li>• The effect uses WebGL for smooth performance</li>
            <li>• See CARDSPOTLIGHT_INTEGRATION_GUIDE.md for full documentation</li>
            <li>• Check INTEGRATION_EXAMPLE.js for code examples</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
