const BASE = '/api';

async function request(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
}

export const api = {
  // Demo scenarios
  loadScenario: () => request('POST', '/demo/load-scenario'),
  injectUncertainty: (region) => request('POST', `/demo/inject-uncertainty?region=${encodeURIComponent(region)}`),
  loadConflictingReports: () => request('POST', '/demo/conflicting-reports'),
  
  // Core API
  getRiskAssessments: () => request('GET', '/risk/assessment'),
  getDecisionPackages: () => request('GET', '/decision/packages'),
  getGovernanceStatus: () => request('GET', '/governance/status'),
  approveDecision: (region, option_id) =>
    request('POST', '/governance/approve', { region, option_id }),
  
  // Audit trail
  getAuditTrail: () => request('GET', '/audit/trail'),
  getAuditSummary: () => request('GET', '/audit/summary'),
};
