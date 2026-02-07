import { CardSpotlight } from "@/components/ui/card-spotlight";
import { useState } from 'react';

export default function CriticalRegionCard({ region, riskLevel, riskScore, confidence, hazard, exposure, vulnerability, uncertaintyWarnings, reasoningGraph, onViewDecisions, color }) {
  const [showReasoning, setShowReasoning] = useState(false);
  
  // Default colors based on risk level if not provided
  const spotlightColor = color || (
    riskLevel === 'CRITICAL' ? '#7A3B3B' :
    riskLevel === 'HIGH' ? '#7A3B3B' :
    riskLevel === 'MEDIUM' ? '#8A6A2F' :
    '#4B7F52'
  );
  
  return (
    <CardSpotlight 
      className="h-auto w-full border-border bg-surface"
      radius={400}
      color={spotlightColor}
    >
      <div className="relative z-20">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-textPrimary">
            {region}
          </h3>
          <span className={`px-3 py-1 text-xs font-medium ${
            riskLevel === 'CRITICAL' ? 'bg-riskHigh text-textPrimary border border-riskHigh' :
            riskLevel === 'HIGH' ? 'bg-[#7A3B3B] text-textPrimary border border-[#7A3B3B]' :
            riskLevel === 'MEDIUM' ? 'bg-riskMedium text-textPrimary border border-riskMedium' :
            'bg-riskLow text-textPrimary border border-riskLow'
          }`}>
            {riskLevel}
          </span>
        </div>

        <div className="space-y-3 mb-4">
          <StatusItem 
            label="Risk Score" 
            value={`${(riskScore * 100).toFixed(1)}/100`}
            progress={riskScore * 100}
          />
          <StatusItem 
            label="Confidence" 
            value={`${(confidence * 100).toFixed(0)}%`}
            progress={confidence * 100}
          />
        </div>

        {/* Components */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <ComponentItem label="Hazard" value={hazard} />
          <ComponentItem label="Exposure" value={exposure} />
          <ComponentItem label="Vulnerability" value={vulnerability} />
        </div>

        {/* Uncertainty Warnings */}
        {uncertaintyWarnings && uncertaintyWarnings.length > 0 && (
          <div className="bg-riskHigh/10 border border-riskHigh/30 rounded p-3 mb-4">
            <div className="text-xs font-semibold text-textPrimary mb-2 uppercase tracking-wide">Uncertainty Warnings</div>
            <ul className="space-y-1">
              {uncertaintyWarnings.map((warning, i) => (
                <li key={i} className="text-xs text-textSecondary">• {warning}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Reasoning Toggle */}
        <button
          onClick={() => setShowReasoning(!showReasoning)}
          className="w-full bg-surface/50 hover:bg-surface border border-border rounded py-2 text-xs font-medium text-textPrimary transition mb-3"
        >
          {showReasoning ? 'Hide Reasoning' : 'Show Explainable Reasoning'}
        </button>

        {/* Expanded Reasoning */}
        {showReasoning && reasoningGraph && (
          <div className="bg-surface/30 border border-border rounded p-3 mb-4">
            <h4 className="text-xs font-bold text-textPrimary mb-2 uppercase tracking-wide">Reasoning Graph</h4>
            <ul className="space-y-1">
              {reasoningGraph.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-textSecondary">
                  <span className="mt-0.5 flex-shrink-0">
                    {reason.startsWith('⚠') ? '!' : '•'}
                  </span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onViewDecisions}
          className="w-full bg-accent/20 hover:bg-accent/30 border border-accent text-textPrimary px-4 py-2 rounded text-sm font-semibold transition"
        >
          View Decision Options
        </button>
      </div>
    </CardSpotlight>
  );
}

const StatusItem = ({ label, value, progress }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-textMuted uppercase text-xs tracking-wide">{label}</span>
        <span className="text-textPrimary font-semibold font-mono text-sm">{value}</span>
      </div>
      {progress !== undefined && (
        <div className="w-full bg-surface/50 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-accent h-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

const ComponentItem = ({ label, value }) => {
  return (
    <div className="bg-surface/30 border border-border p-2 rounded text-center">
      <div className="text-xs text-textMuted uppercase tracking-wide mb-1">{label}</div>
      <div className="text-lg font-semibold text-textPrimary">{(value * 100).toFixed(0)}%</div>
    </div>
  );
};

const ActionItem = ({ title }) => {
  return (
    <li className="flex gap-2 items-start">
      <CheckIcon />
      <p className="text-textSecondary text-sm">{title}</p>
    </li>
  );
};

const CheckIcon = () => {
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
      className="h-4 w-4 text-accent mt-0.5 flex-shrink-0"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
};
