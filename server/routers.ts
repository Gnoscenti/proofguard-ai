import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import Stripe from "stripe";
import {
  listAttestations,
  getAttestationById,
  getAttestationStats,
  insertAttestations,
  listGuardrails,
  insertGuardrails,
  listControls,
  getControlStats,
  insertControls,
} from "./db";
import { nanoid } from "nanoid";

// ─── Seed Data Generators ────────────────────────────────────────────────

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
  "Internal Governance",
  "Human Accountability",
  "Technical Robustness",
  "User Enablement",
] as const;

const RISK_TIERS = ["low", "medium", "high", "critical"] as const;

function randomPick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateSyntheticAttestations(count: number) {
  const rows = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const flagged = Math.random() < 0.12;
    const cqs = flagged
      ? Math.floor(Math.random() * 30) + 50
      : Math.floor(Math.random() * 15) + 85;
    const agentIdx = Math.floor(Math.random() * AGENT_NAMES.length);
    const riskTier = flagged
      ? randomPick(["high", "critical"] as const)
      : randomPick(RISK_TIERS);
    const createdAt = new Date(now - Math.floor(Math.random() * 90 * 86400000));

    rows.push({
      attestationId: `att_${nanoid(16)}`,
      agentId: `agent_${String(agentIdx + 1).padStart(3, "0")}`,
      agentName: AGENT_NAMES[agentIdx],
      cqsScore: cqs,
      imdaPillar: randomPick(IMDA_PILLARS),
      action: randomPick(ACTION_TYPES),
      actionJson: JSON.stringify({
        type: randomPick(ACTION_TYPES),
        input_hash: `sha256:${nanoid(32)}`,
        output_hash: `sha256:${nanoid(32)}`,
      }),
      riskTier: riskTier as typeof RISK_TIERS[number],
      flagged,
      patchedAt: flagged && Math.random() > 0.3 ? new Date(createdAt.getTime() + 3600000) : null,
      modelHash: `sha256:${nanoid(32)}`,
      policyHash: `sha256:${nanoid(16)}`,
      traceJson: JSON.stringify({
        nodes: [
          { id: "input", type: "receive", timestamp: createdAt.toISOString() },
          { id: "process", type: "compute", timestamp: new Date(createdAt.getTime() + 100).toISOString() },
          { id: "output", type: "respond", timestamp: new Date(createdAt.getTime() + 200).toISOString() },
        ],
        flagged,
      }),
      complianceJson: JSON.stringify({
        aicm_controls: [`AICM-${Math.floor(Math.random() * 243) + 1}`],
        imda_pillars: [Math.floor(Math.random() * 4) + 1],
        nist_rmf_functions: [randomPick(["Govern", "Map", "Measure", "Manage"])],
      }),
      createdAt,
    });
  }
  return rows;
}

// AICM 243 controls across 12 categories
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

function generateAICMControls() {
  const rows: Array<{
    controlId: string;
    name: string;
    category: string;
    objective: string;
    status: "pass" | "warn" | "fail" | "pending";
    score: number;
    framework: "AICM" | "IMDA" | "ExecAI" | "NIST";
  }> = [];
  let globalIdx = 1;

  for (const cat of AICM_CATEGORIES) {
    for (let j = 1; j <= cat.count; j++) {
      const r = Math.random();
      const status = r < 0.72 ? "pass" : r < 0.88 ? "warn" : r < 0.95 ? "fail" : "pending";
      const score =
        status === "pass" ? Math.floor(Math.random() * 15) + 85 :
        status === "warn" ? Math.floor(Math.random() * 20) + 60 :
        status === "fail" ? Math.floor(Math.random() * 30) + 20 :
        0;

      rows.push({
        controlId: `${cat.prefix}-${String(j).padStart(3, "0")}`,
        name: `${cat.name} Control ${j}`,
        category: cat.name,
        objective: `Ensure ${cat.name.toLowerCase()} requirement ${j} is met per AICM v2026 standard.`,
        status: status as "pass" | "warn" | "fail" | "pending",
        score,
        framework: randomPick(["AICM", "IMDA", "ExecAI", "NIST"] as const),
      });
      globalIdx++;
    }
  }
  return rows;
}

const GUARDRAIL_DEFS = [
  { ruleId: "GR-001", description: "Block unverified external API calls", action: "block" as const, version: 3, triggerCount: 1247, corpusSize: 450 },
  { ruleId: "GR-002", description: "Route PII access to human-in-the-loop", action: "route_to_hitl" as const, version: 5, triggerCount: 892, corpusSize: 320 },
  { ruleId: "GR-003", description: "Block and log unauthorized model weight access", action: "block_and_log" as const, version: 2, triggerCount: 156, corpusSize: 180 },
  { ruleId: "GR-004", description: "Allow financial reads with audit trail", action: "allow_with_audit" as const, version: 4, triggerCount: 3421, corpusSize: 890 },
  { ruleId: "GR-005", description: "Block cross-tenant data leakage attempts", action: "block" as const, version: 6, triggerCount: 67, corpusSize: 210 },
  { ruleId: "GR-006", description: "Route high-value transactions to HITL", action: "route_to_hitl" as const, version: 3, triggerCount: 2103, corpusSize: 560 },
  { ruleId: "GR-007", description: "Block prompt injection patterns", action: "block_and_log" as const, version: 8, triggerCount: 4521, corpusSize: 1200 },
  { ruleId: "GR-008", description: "Allow read-only dashboard queries with audit", action: "allow_with_audit" as const, version: 2, triggerCount: 8934, corpusSize: 340 },
  { ruleId: "GR-009", description: "Block unauthorized credential rotation", action: "block" as const, version: 4, triggerCount: 23, corpusSize: 90 },
  { ruleId: "GR-010", description: "Route compliance-sensitive actions to legal review", action: "route_to_hitl" as const, version: 2, triggerCount: 445, corpusSize: 280 },
  { ruleId: "GR-011", description: "Block recursive agent spawning beyond depth 3", action: "block_and_log" as const, version: 3, triggerCount: 312, corpusSize: 150 },
  { ruleId: "GR-012", description: "Allow model inference with performance logging", action: "allow_with_audit" as const, version: 1, triggerCount: 15672, corpusSize: 2100 },
];

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Attestation Router ──────────────────────────────────────────────
  attestation: router({
    list: publicProcedure
      .input(z.object({
        limit: z.number().min(1).max(200).optional().default(50),
        offset: z.number().min(0).optional().default(0),
        flagged: z.boolean().optional(),
      }).optional())
      .query(async ({ input }) => {
        return listAttestations(input ?? {});
      }),

    byId: publicProcedure
      .input(z.object({ attestationId: z.string() }))
      .query(async ({ input }) => {
        return getAttestationById(input.attestationId);
      }),

    stats: publicProcedure.query(async () => {
      return getAttestationStats();
    }),
  }),

  // ─── Guardrail Router ────────────────────────────────────────────────
  guardrail: router({
    list: publicProcedure.query(async () => {
      return listGuardrails();
    }),
  }),

  // ─── Control Router ──────────────────────────────────────────────────
  control: router({
    list: publicProcedure
      .input(z.object({
        category: z.string().optional(),
        framework: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return listControls(input ?? {});
      }),

    stats: publicProcedure.query(async () => {
      return getControlStats();
    }),
  }),

  // ─── Stripe Router ───────────────────────────────────────────────────
  stripe: router({
    createCheckout: protectedProcedure
      .input(z.object({
        plan: z.enum(["pro", "enterprise"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
          apiVersion: "2026-02-25.clover",
        });

        const priceAmounts: Record<string, number> = {
          pro: 29900,
          enterprise: 200000,
        };

        const origin = ctx.req.headers.origin || "";

        const session = await stripe.checkout.sessions.create({
          mode: "subscription",
          payment_method_types: ["card"],
          customer_email: ctx.user.email || undefined,
          client_reference_id: ctx.user.id.toString(),
          allow_promotion_codes: true,
          metadata: {
            user_id: ctx.user.id.toString(),
            customer_email: ctx.user.email || "",
            customer_name: ctx.user.name || "",
            plan: input.plan,
          },
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: `ProofGuard AI ${input.plan.charAt(0).toUpperCase() + input.plan.slice(1)}`,
                  description: input.plan === "pro"
                    ? "Unlimited attestations + full dashboard + compliance exports"
                    : "Enterprise: white-label + sovereign deployment + audit export",
                },
                unit_amount: priceAmounts[input.plan],
                recurring: { interval: "month" },
              },
              quantity: 1,
            },
          ],
          success_url: `${origin}/pricing?success=true`,
          cancel_url: `${origin}/pricing?canceled=true`,
        });

        return { url: session.url };
      }),
  }),

  // ─── Compliance Export Router ─────────────────────────────────────────
  compliance: router({
    exportData: publicProcedure.query(async () => {
      const stats = await getAttestationStats();
      const controls = await listControls({});
      const guardrails = await listGuardrails();

      const controlsByCategory: Record<string, { total: number; pass: number; warn: number; fail: number; pending: number }> = {};
      for (const c of controls) {
        if (!controlsByCategory[c.category]) {
          controlsByCategory[c.category] = { total: 0, pass: 0, warn: 0, fail: 0, pending: 0 };
        }
        controlsByCategory[c.category].total++;
        controlsByCategory[c.category][c.status as 'pass' | 'warn' | 'fail' | 'pending']++;
      }

      const overallScore = controls.length > 0
        ? Math.round(controls.reduce((s, c) => s + c.score, 0) / controls.length)
        : 0;

      const safeStats = stats ?? { total: 0, flagged: 0, patched: 0, avgCqs: 0 };

      return {
        generatedAt: new Date().toISOString(),
        framework: {
          name: "ProofGuard AI Compliance Report",
          version: "2026.1",
          standards: ["IMDA Model AI Governance Framework", "CSA AI Controls Matrix (AICM) 2026", "NIST AI RMF 2.0"],
        },
        attestationSummary: {
          total: safeStats.total,
          flagged: safeStats.flagged,
          patched: safeStats.patched,
          avgCqs: safeStats.avgCqs,
        },
        controlsSummary: {
          totalControls: controls.length,
          overallScore,
          byCategory: controlsByCategory,
        },
        guardrailsSummary: {
          totalRules: guardrails.length,
          rules: guardrails.map(g => ({
            ruleId: g.ruleId,
            description: g.description,
            action: g.action,
            version: g.version,
            triggerCount: g.triggerCount,
          })),
        },
        imdaPillars: [
          { id: 1, name: "Internal Governance", description: "Organizational structures, policies, and processes" },
          { id: 2, name: "Human Accountability", description: "Human oversight and decision-making authority" },
          { id: 3, name: "Technical Robustness", description: "System reliability, security, and performance" },
          { id: 4, name: "User Enablement", description: "Transparency, explainability, and user empowerment" },
        ],
      };
    }),
  }),

  // ─── Seed Router (admin only) ────────────────────────────────────────
  seed: router({
    run: protectedProcedure
      .input(z.object({
        attestationCount: z.number().min(100).max(10000).optional().default(10000),
      }).optional())
      .mutation(async ({ input }) => {
        const count = input?.attestationCount ?? 10000;

        // Generate and insert attestations
        const attestationData = generateSyntheticAttestations(count);
        await insertAttestations(attestationData);

        // Generate and insert AICM controls
        const controlData = generateAICMControls();
        await insertControls(controlData);

        // Insert guardrails
        await insertGuardrails(GUARDRAIL_DEFS);

        return {
          success: true,
          attestations: attestationData.length,
          controls: controlData.length,
          guardrails: GUARDRAIL_DEFS.length,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
