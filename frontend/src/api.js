import { mockData } from './mockData';

const BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}`
  : '/api';

const USE_MOCK = !import.meta.env.VITE_API_URL || import.meta.env.VITE_USE_MOCK === 'true';

let useMockFallback = false;

async function request(method, path, body) {
  // If mock mode is enabled or we've fallen back to mock
  if (USE_MOCK || useMockFallback) {
    return getMockResponse(path);
  }

  try {
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
  } catch (error) {
    // Fallback to mock data if backend is unavailable
    console.warn('Backend unavailable, using mock data:', error.message);
    useMockFallback = true;
    return getMockResponse(path);
  }
}

function getMockResponse(path) {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      if (path === '/risk/assessment') {
        resolve(mockData.riskAssessments);
      } else if (path === '/decision/packages') {
        resolve(mockData.decisionPackages);
      } else if (path === '/governance/status') {
        resolve(mockData.governanceStatus);
      } else if (path === '/audit/trail') {
        resolve(mockData.auditTrail);
      } else if (path === '/audit/summary') {
        resolve(mockData.auditSummary);
      } else if (path.startsWith('/demo/')) {
        resolve({ status: 'success', message: 'Demo action completed (mock mode)' });
      } else if (path.startsWith('/governance/approve')) {
        resolve({ status: 'approved', message: 'Decision approved (mock mode)' });
      } else {
        resolve({ status: 'success' });
      }
    }, 300);
  });
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
