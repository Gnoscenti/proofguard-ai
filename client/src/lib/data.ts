/*
 * ProofGuard AI — Merged ExecAI Trust + ProofGuard Data Layer
 * Quantum Shield Design System
 *
 * This file contains all synthetic data, types, and scoring logic
 * for the unified Proof-of-Agent™ attestation platform.
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Attestation {
  id: string;
  agentId: string;
  agentName: string;
  cqsScore: number;
  imdaPillar: string;
  action: string;
  flagged: boolean;
  riskTier: 'low' | 'medium' | 'high' | 'critical';
  patchedAt: string | null;
  timestamp: string;
  modelHash: string;
  policyHash: string;
}

export interface Control {
  id: string;
  name: string;
  category: string;
  objective: string;
  status: 'pass' | 'warn' | 'fail' | 'pending';
  score: number;
  framework: 'AICM' | 'IMDA' | 'ExecAI' | 'NIST';
}

export interface IMDAPillar {
  id: number;
  name: string;
  score: number;
  controls: number;
  passing: number;
}

export interface TraceNode {
  id: string;
  type: 'input' | 'context' | 'policy' | 'score' | 'approval' | 'execution' | 'flag';
  label: string;
}

export interface GuardrailRule {
  id: string;
  description: string;
  action: 'block' | 'route_to_hitl' | 'block_and_log' | 'allow_with_audit';
  version: number;
  triggerCount: number;
  lastTriggered: string;
}

// ─── IMDA Pillars ───────────────────────────────────────────────────────────

export const imdaPillars: IMDAPillar[] = [
  { id: 1, name: 'Internal Governance', score: 95, controls: 61, passing: 58 },
  { id: 2, name: 'Human Accountability', score: 88, controls: 58, passing: 51 },
  { id: 3, name: 'Technical Robustness', score: 97, controls: 64, passing: 62 },
  { id: 4, name: 'User Enablement', score: 92, controls: 60, passing: 55 },
];

// ─── AICM Control Categories ────────────────────────────────────────────────

export const aicmCategories = [
  'Data Governance', 'Model Lifecycle', 'Security & Privacy',
  'Operational Monitoring', 'Human Oversight', 'Attestation & Audit',
  'Risk Management', 'Transparency', 'Fairness & Bias',
  'Incident Response', 'Third-Party Management', 'Continuous Learning',
];

// ─── Guardrail Rules (from ExecAI Trust) ────────────────────────────────────

export const guardrailRules: GuardrailRule[] = [
  { id: 'NO_PII_EXFIL', description: 'Prevent leakage of sensitive personal data', action: 'block', version: 3, triggerCount: 847, lastTriggered: '2026-03-23T14:22:00Z' },
  { id: 'FINANCIAL_APPROVAL', description: 'Require human approval for financial actions', action: 'route_to_hitl', version: 5, triggerCount: 2341, lastTriggered: '2026-03-23T16:05:00Z' },
  { id: 'PROMPT_INJECTION', description: 'Detect malicious or adversarial prompts', action: 'block_and_log', version: 7, triggerCount: 12089, lastTriggered: '2026-03-23T16:48:00Z' },
  { id: 'DRIFT_THRESHOLD', description: 'Block actions when model drift exceeds 3%', action: 'block', version: 2, triggerCount: 156, lastTriggered: '2026-03-22T09:15:00Z' },
  { id: 'CONSENT_CHECK', description: 'Verify data consent before processing', action: 'allow_with_audit', version: 4, triggerCount: 9823, lastTriggered: '2026-03-23T16:50:00Z' },
  { id: 'SCOPE_BOUNDARY', description: 'Prevent agent from exceeding authorized scope', action: 'block_and_log', version: 6, triggerCount: 3421, lastTriggered: '2026-03-23T15:30:00Z' },
];

// ─── Trace Flow (from ExecAI Trust trace_engine) ────────────────────────────

export const traceNodes: TraceNode[] = [
  { id: 'input', type: 'input', label: 'Agent Action' },
  { id: 'context', type: 'context', label: 'Context Enrichment' },
  { id: 'policy', type: 'policy', label: 'Policy Evaluation' },
  { id: 'score', type: 'score', label: 'Risk Scoring' },
  { id: 'approval', type: 'approval', label: 'HITL Review' },
  { id: 'execution', type: 'execution', label: 'Execution' },
];

// ─── CQS Calculation ────────────────────────────────────────────────────────

export function calculateCQS(pillars: IMDAPillar[]): number {
  const weights = [0.25, 0.25, 0.30, 0.20];
  const weighted = pillars.reduce((sum, p, i) => sum + p.score * weights[i], 0);
  return Math.round(weighted * 10) / 10;
}

// ─── Synthetic Attestation Generator ────────────────────────────────────────

const agentNames = [
  'ExecAI-Copilot', 'LaunchOps-Atlas', 'RET-Valuator', 'CourseAI-Tutor',
  'EPI-Auditor', 'DataLineage-Agent', 'DriftWatch-Monitor', 'HITL-Router',
  'PolicyGuard-Engine', 'AttestGen-Signer',
];

const actions = [
  'invoice_processing', 'property_valuation', 'course_completion_cert',
  'governance_vote', 'data_lineage_scan', 'model_drift_check',
  'risk_assessment', 'compliance_audit', 'token_transfer', 'user_onboarding',
  'contract_review', 'financial_report', 'security_scan', 'deployment_approval',
];

const pillarNames = ['Internal Governance', 'Human Accountability', 'Technical Robustness', 'User Enablement'];

function hashGen(): string {
  return Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

export function generateAttestations(count: number): Attestation[] {
  const attestations: Attestation[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const cqs = Math.floor(Math.random() * 30) + 70;
    const flagged = cqs < 80 || Math.random() < 0.08;
    const riskTier: Attestation['riskTier'] =
      cqs >= 95 ? 'low' : cqs >= 85 ? 'medium' : cqs >= 75 ? 'high' : 'critical';

    attestations.push({
      id: `att_${hashGen()}`,
      agentId: `agent_${(i % 10).toString().padStart(3, '0')}`,
      agentName: agentNames[i % agentNames.length],
      cqsScore: cqs,
      imdaPillar: pillarNames[Math.floor(Math.random() * 4)],
      action: actions[Math.floor(Math.random() * actions.length)],
      flagged,
      riskTier,
      patchedAt: flagged && Math.random() > 0.3
        ? new Date(now - Math.random() * 86400000).toISOString()
        : null,
      timestamp: new Date(now - Math.random() * 7 * 86400000).toISOString(),
      modelHash: hashGen() + hashGen() + hashGen() + hashGen() + hashGen(),
      policyHash: hashGen() + hashGen() + hashGen() + hashGen() + hashGen(),
    });
  }

  return attestations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// ─── Generate AICM 243 Controls ─────────────────────────────────────────────

export function generateControls(): Control[] {
  const controls: Control[] = [];
  const frameworks: Control['framework'][] = ['AICM', 'IMDA', 'ExecAI', 'NIST'];
  const statuses: Control['status'][] = ['pass', 'pass', 'pass', 'pass', 'pass', 'warn', 'pending', 'fail'];

  let id = 1;
  for (const category of aicmCategories) {
    const count = Math.floor(Math.random() * 8) + 16;
    for (let j = 0; j < count && id <= 243; j++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      controls.push({
        id: `CTRL-${id.toString().padStart(3, '0')}`,
        name: `${category} Control ${j + 1}`,
        category,
        objective: `Ensure ${category.toLowerCase()} compliance for agentic AI systems per ${frameworks[id % 4]} framework requirements.`,
        status,
        score: status === 'pass' ? 90 + Math.floor(Math.random() * 10) :
               status === 'warn' ? 70 + Math.floor(Math.random() * 15) :
               status === 'pending' ? 50 + Math.floor(Math.random() * 20) :
               30 + Math.floor(Math.random() * 20),
        framework: frameworks[id % 4],
      });
      id++;
    }
  }

  return controls;
}

// ─── MicroAI Ecosystem Products ─────────────────────────────────────────────

export const microAIProducts = [
  {
    name: 'ExecAI',
    description: 'Governance Copilot for leadership teams',
    repo: 'Gnoscenti/execai-platform-api',
    attestations: 4231,
    cqs: 96,
  },
  {
    name: 'AIIntegrationCourse',
    description: 'Applied AI education platform',
    repo: 'Gnoscenti/ai-integration-course',
    attestations: 1847,
    cqs: 94,
  },
  {
    name: 'LaunchOps',
    description: 'Multi-agent founder automation',
    repo: 'MicroAIStudios-DAO/launchops-founder-edition',
    attestations: 2956,
    cqs: 97,
  },
  {
    name: 'MicroAI DAO',
    description: 'AI-augmented corporate governance',
    repo: 'MicroAIStudios-DAO/microai-dao-core',
    attestations: 891,
    cqs: 93,
  },
];

// ─── Pricing Tiers ──────────────────────────────────────────────────────────

export const pricingTiers = [
  {
    name: 'Community',
    price: 'Free',
    period: '',
    description: 'Open SDK for builders',
    features: [
      '100 attestations / month',
      'Open AAS schema access',
      'Community Slack',
      'Basic CQS scoring',
      'Public badge display',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$299',
    period: '/mo',
    description: 'Full dashboard + unlimited attestations',
    features: [
      'Unlimited attestations',
      'Real-time CQS dashboard',
      'IMDA + AICM compliance exports',
      'Trace flow visualization',
      'Guardrail auto-patching',
      'Priority support',
      'API access',
    ],
    cta: 'Start Pro Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '$2,000+',
    period: '/mo',
    description: 'White-label + audit export + sovereign',
    features: [
      'Everything in Pro',
      'White-label deployment',
      'SOC 2 audit export',
      'Custom HITL tier matrix',
      'Sovereign on-prem option',
      'Dedicated account manager',
      'SLA guarantee',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];
