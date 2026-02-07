import { CardSpotlight } from "@/components/ui/card-spotlight";

export default function GovernanceAlertCard({ title, message, status, confidence, requiresApproval, rules }) {
  return (
    <CardSpotlight 
      className="h-auto w-full border-border bg-surface"
      radius={350}
      color="#64748B" // accent color
    >
      <div className="relative z-20">
        <div className="flex items-center gap-3 mb-4">
          <AlertIcon />
          <h3 className="text-lg font-semibold text-textPrimary uppercase tracking-wide">
            {title}
          </h3>
        </div>

        <p className="text-textSecondary text-sm mb-6 leading-relaxed">
          {message}
        </p>

        <div className="mb-4 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <span className="text-textMuted text-xs uppercase tracking-wide">Status</span>
            <span className={`px-3 py-1 text-xs font-medium ${
              status === 'ESCALATE' 
                ? 'bg-riskHigh/20 text-textPrimary border border-riskHigh'
                : 'bg-accent/20 text-textPrimary border border-accent'
            }`}>
              {status}
            </span>
          </div>
        </div>

        {rules && rules.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-textPrimary mb-3 uppercase tracking-wide">
              Triggered Rules
            </h4>
            <ul className="space-y-2">
              {rules.map((rule, idx) => (
                <RuleItem key={idx} rule={rule} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </CardSpotlight>
  );
}

const RuleItem = ({ rule }) => {
  return (
    <li className="flex gap-2 items-start p-2 bg-panel border border-border">
      <span className="text-accent text-lg">•</span>
      <p className="text-textSecondary text-xs">{rule}</p>
    </li>
  );
};

const AlertIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 text-accent"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
      <path d="M12 9v4"></path>
      <path d="M12 17h.01"></path>
    </svg>
  );
};
