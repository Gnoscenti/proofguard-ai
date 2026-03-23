/**
 * ProofGuard AI — Stripe Product Configuration
 * Three tiers: Community (free), Pro ($299/mo), Enterprise ($2000/mo)
 */

export interface PricingTier {
  name: string;
  description: string;
  priceMonthly: number; // in cents
  stripePriceId?: string; // set after creation
  features: string[];
  attestationLimit: number | null; // null = unlimited
  mode: "free" | "subscription";
}

export const PRICING_TIERS: Record<string, PricingTier> = {
  community: {
    name: "Community",
    description: "Open SDK access for builders",
    priceMonthly: 0,
    features: [
      "100 attestations/month",
      "Basic CQS scoring",
      "Open AAS schema access",
      "Community Slack",
    ],
    attestationLimit: 100,
    mode: "free",
  },
  pro: {
    name: "Pro",
    description: "Full platform access for teams",
    priceMonthly: 29900, // $299.00
    features: [
      "Unlimited attestations",
      "Advanced CQS scoring",
      "IMDA compliance PDF export",
      "Full AICM 243 controls access",
      "Trace flow visualization",
      "Guardrail auto-patching",
      "Full API access (CRUD)",
      "Priority support",
    ],
    attestationLimit: null,
    mode: "subscription",
  },
  enterprise: {
    name: "Enterprise",
    description: "Sovereign deployment + white-label",
    priceMonthly: 200000, // $2,000.00
    features: [
      "Everything in Pro",
      "White-label deployment",
      "SOC 2 audit export",
      "Custom AICM control mapping",
      "Sovereign on-prem option",
      "API + webhooks",
      "99.99% SLA",
      "Dedicated support",
    ],
    attestationLimit: null,
    mode: "subscription",
  },
};
