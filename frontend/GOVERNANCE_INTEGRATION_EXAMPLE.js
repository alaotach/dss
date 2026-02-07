// GovernancePanel Integration Example
// Add this import at the top:
import { GovernanceAlertCard } from './GovernanceAlertCard'

// Add this above your governance table (around line 55 in GovernancePanel.jsx):

{/* Governance Alerts Section */}
{status.some(s => s.governance_status === 'ESCALATE') && (
  <div className="mb-8">
    <h3 className="text-lg font-semibold text-textPrimary mb-4 uppercase tracking-wide">
      Governance Escalations
    </h3>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {status
        .filter(s => s.governance_status === 'ESCALATE')
        .map((item, idx) => (
          <GovernanceAlertCard
            key={idx}
            title="Critical Decision Required"
            message={item.reason}
            status={item.governance_status}
            rules={item.triggered_rules || [
              'High risk level with moderate confidence',
              'Critical infrastructure affected',
              'Human oversight mandatory'
            ]}
          />
        ))
      }
    </div>
  </div>
)}
