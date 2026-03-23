/**
 * ProofGuard AI — Database Seed Script
 * Generates 10,000 synthetic attestations + 243 AICM controls + 12 guardrails
 * Run: node seed-db.mjs
 */
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { nanoid } from 'nanoid';
import { sql } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const db = drizzle(DATABASE_URL);

const AGENT_NAMES = [
  "InvoiceBot", "ComplianceAgent", "DataPipelineOrch", "CustomerSupportAI",
  "FraudDetector", "HROnboarder", "SupplyChainOpt", "MarketingAnalyst",
  "LegalReviewer", "CodeAuditor", "FinanceReconciler", "InventoryManager",
  "QualityInspector", "RiskAssessor", "DocumentParser", "EmailTriager",
  "MeetingSummarizer", "ContractAnalyzer", "PriceOptimizer", "SecurityScanner",
];

const ACTION_TYPES = [
  "invoice_processing", "compliance_check", "data_pipeline_run", "customer_response",
  "fraud_analysis", "onboarding_step", "supply_chain_optimization", "campaign_analysis",
  "legal_review", "code_audit", "financial_reconciliation", "inventory_update",
  "quality_inspection", "risk_assessment", "document_parsing", "email_triage",
  "meeting_summary", "contract_analysis", "price_optimization", "security_scan",
];

const IMDA_PILLARS = [
  "Internal Governance", "Human Accountability", "Technical Robustness", "User Enablement",
];
const RISK_TIERS = ["low", "medium", "high", "critical"];

function randomPick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

async function seedAttestations(count = 10000) {
  console.log(`Seeding ${count} attestations...`);
  const now = Date.now();
  const BATCH = 500;

  for (let batch = 0; batch < count; batch += BATCH) {
    const size = Math.min(BATCH, count - batch);
    const values = [];

    for (let i = 0; i < size; i++) {
      const flagged = Math.random() < 0.12;
      const cqs = flagged ? Math.floor(Math.random() * 30) + 50 : Math.floor(Math.random() * 15) + 85;
      const agentIdx = Math.floor(Math.random() * AGENT_NAMES.length);
      const riskTier = flagged ? randomPick(["high", "critical"]) : randomPick(RISK_TIERS);
      const createdAt = new Date(now - Math.floor(Math.random() * 90 * 86400000));
      const patchedAt = flagged && Math.random() > 0.3
        ? new Date(createdAt.getTime() + 3600000).toISOString().slice(0, 19).replace('T', ' ')
        : null;

      values.push(`(
        '${`att_${nanoid(16)}`}',
        '${`agent_${String(agentIdx + 1).padStart(3, "0")}`}',
        '${AGENT_NAMES[agentIdx]}',
        ${cqs},
        '${randomPick(IMDA_PILLARS)}',
        '${randomPick(ACTION_TYPES)}',
        '${JSON.stringify({ type: randomPick(ACTION_TYPES), input_hash: `sha256:${nanoid(32)}`, output_hash: `sha256:${nanoid(32)}` }).replace(/'/g, "\\'")}',
        '${riskTier}',
        ${flagged ? 1 : 0},
        ${patchedAt ? `'${patchedAt}'` : 'NULL'},
        '${`sha256:${nanoid(32)}`}',
        '${`sha256:${nanoid(16)}`}',
        '${JSON.stringify({ nodes: [{ id: "input", type: "receive" }, { id: "process", type: "compute" }, { id: "output", type: "respond" }], flagged }).replace(/'/g, "\\'")}',
        '${JSON.stringify({ aicm_controls: [`AICM-${Math.floor(Math.random() * 243) + 1}`], imda_pillars: [Math.floor(Math.random() * 4) + 1], nist_rmf_functions: [randomPick(["Govern", "Map", "Measure", "Manage"])] }).replace(/'/g, "\\'")}',
        '${createdAt.toISOString().slice(0, 19).replace('T', ' ')}'
      )`);
    }

    await db.execute(sql.raw(`INSERT INTO attestations (attestationId, agentId, agentName, cqsScore, imdaPillar, action, actionJson, riskTier, flagged, patchedAt, modelHash, policyHash, traceJson, complianceJson, createdAt) VALUES ${values.join(',')}`));
    console.log(`  Inserted ${batch + size}/${count} attestations`);
  }
}

async function seedControls() {
  const AICM_CATEGORIES = [
    { name: "AI Governance", prefix: "GOV", count: 24 },
    { name: "Risk Management", prefix: "RSK", count: 22 },
    { name: "Data Management", prefix: "DAT", count: 21 },
    { name: "Model Development", prefix: "MDL", count: 20 },
    { name: "Security & Privacy", prefix: "SEC", count: 23 },
    { name: "Transparency", prefix: "TRN", count: 18 },
    { name: "Accountability", prefix: "ACC", count: 19 },
    { name: "Fairness & Bias", prefix: "FAR", count: 20 },
    { name: "Robustness", prefix: "ROB", count: 21 },
    { name: "Human Oversight", prefix: "HUM", count: 18 },
    { name: "Monitoring & Audit", prefix: "MON", count: 19 },
    { name: "Incident Response", prefix: "INC", count: 18 },
  ];

  const values = [];
  for (const cat of AICM_CATEGORIES) {
    for (let j = 1; j <= cat.count; j++) {
      const r = Math.random();
      const status = r < 0.72 ? "pass" : r < 0.88 ? "warn" : r < 0.95 ? "fail" : "pending";
      const score = status === "pass" ? Math.floor(Math.random() * 15) + 85
        : status === "warn" ? Math.floor(Math.random() * 20) + 60
        : status === "fail" ? Math.floor(Math.random() * 30) + 20
        : 0;
      const framework = randomPick(["AICM", "IMDA", "ExecAI", "NIST"]);

      values.push(`(
        '${cat.prefix}-${String(j).padStart(3, "0")}',
        '${cat.name} Control ${j}',
        '${cat.name}',
        '${`Ensure ${cat.name.toLowerCase()} requirement ${j} is met per AICM v2026 standard.`}',
        '${status}',
        ${score},
        '${framework}'
      )`);
    }
  }

  console.log(`Seeding ${values.length} AICM controls...`);
  await db.execute(sql.raw(`INSERT INTO controls (controlId, name, category, objective, status, score, framework) VALUES ${values.join(',')}`));
  console.log(`  Inserted ${values.length} controls`);
}

async function seedGuardrails() {
  const rules = [
    { ruleId: "GR-001", description: "Block unverified external API calls", action: "block", version: 3, triggerCount: 1247, corpusSize: 450 },
    { ruleId: "GR-002", description: "Route PII access to human-in-the-loop", action: "route_to_hitl", version: 5, triggerCount: 892, corpusSize: 320 },
    { ruleId: "GR-003", description: "Block and log unauthorized model weight access", action: "block_and_log", version: 2, triggerCount: 156, corpusSize: 180 },
    { ruleId: "GR-004", description: "Allow financial reads with audit trail", action: "allow_with_audit", version: 4, triggerCount: 3421, corpusSize: 890 },
    { ruleId: "GR-005", description: "Block cross-tenant data leakage attempts", action: "block", version: 6, triggerCount: 67, corpusSize: 210 },
    { ruleId: "GR-006", description: "Route high-value transactions to HITL", action: "route_to_hitl", version: 3, triggerCount: 2103, corpusSize: 560 },
    { ruleId: "GR-007", description: "Block prompt injection patterns", action: "block_and_log", version: 8, triggerCount: 4521, corpusSize: 1200 },
    { ruleId: "GR-008", description: "Allow read-only dashboard queries with audit", action: "allow_with_audit", version: 2, triggerCount: 8934, corpusSize: 340 },
    { ruleId: "GR-009", description: "Block unauthorized credential rotation", action: "block", version: 4, triggerCount: 23, corpusSize: 90 },
    { ruleId: "GR-010", description: "Route compliance-sensitive actions to legal review", action: "route_to_hitl", version: 2, triggerCount: 445, corpusSize: 280 },
    { ruleId: "GR-011", description: "Block recursive agent spawning beyond depth 3", action: "block_and_log", version: 3, triggerCount: 312, corpusSize: 150 },
    { ruleId: "GR-012", description: "Allow model inference with performance logging", action: "allow_with_audit", version: 1, triggerCount: 15672, corpusSize: 2100 },
  ];

  const values = rules.map(r => `(
    '${r.ruleId}', '${r.description}', '${r.action}', ${r.version}, ${r.triggerCount}, ${r.corpusSize}
  )`);

  console.log(`Seeding ${rules.length} guardrails...`);
  await db.execute(sql.raw(`INSERT INTO guardrails (ruleId, description, action, version, triggerCount, corpusSize) VALUES ${values.join(',')}`));
  console.log(`  Inserted ${rules.length} guardrails`);
}

async function main() {
  console.log("ProofGuard AI — Database Seed");
  console.log("═".repeat(50));

  try {
    // Clear existing data
    console.log("Clearing existing data...");
    await db.execute(sql.raw('DELETE FROM attestations'));
    await db.execute(sql.raw('DELETE FROM controls'));
    await db.execute(sql.raw('DELETE FROM guardrails'));

    await seedAttestations(10000);
    await seedControls();
    await seedGuardrails();

    console.log("═".repeat(50));
    console.log("Seed complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

main();
