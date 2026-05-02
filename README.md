# ProofGuard AI

**The deterministic governance layer for agentic AI systems.**

ProofGuard is a real-time attestation and trust plane for autonomous agents. Every action an agent proposes — payments, legal documents, infrastructure changes, customer messages — is scored, classified, and either approved, blocked, or escalated to a human in the loop, before it executes. ProofGuard turns AI agents from a liability into an auditable system of record.

This is the Trust Plane that powers [LaunchOpsPro](https://github.com/Gnoscenti/LaunchOpsPro)'s 17-agent pipeline.

---

## Why It Exists

Most agentic systems fail in the same way: the agent looks competent in the demo, makes a high-cost mistake in production, and the audit trail is a stack of LLM logs. ProofGuard fixes the failure mode at the source — every agent action passes through a governance gate before it touches the world.

| Problem | ProofGuard Response |
|---|---|
| Hallucinated actions | CQS (Cognitive Quality Score) attestation per proposal |
| Compliance ambiguity | IMDA Model Governance + AICM 243 mapping |
| Human-out-of-the-loop | HITL approval cards on high-risk actions |
| Unauditable agent behavior | Immutable, signed audit ledger |
| Detection bypass | Fail-closed — if ProofGuard is unreachable, execution is blocked |

---

## Architecture

```
Agent proposes plan
        ↓
ProofGuard receives Proof-of-Agent attestation
        ↓
CQS scoring (0-100) + risk classification
        ↓
   ┌──────────────┬───────────────┐
APPROVED      REQUIRES_HITL    BLOCKED
   │              │                │
   ↓              ↓                ↓
Execute     Pause for human       Halt
            approval/rejection
                  │
                  ↓
          Resume or terminate
                  ↓
   Result written to immutable audit ledger
```

**Stack:** TypeScript · Node.js · React (Vite) · Drizzle ORM · Signed JWT attestations · PostgreSQL ledger

---

## Compliance Mapping

| Standard | Coverage |
|---|---|
| **IMDA Model Governance** | Internal Governance, Human Accountability, Technical Robustness, User Enablement |
| **AICM 243** | Auditable agent behavior, machine-readable rules, fail-closed enforcement |
| **SOC 2** | Audit trail, access control, change management |
| **FIPS** | Signed JWT envelope on every attestation |

---

## Quick Start

### Prerequisites
- Node.js 20+
- pnpm 8+
- PostgreSQL 14+ (via Drizzle)

### Install

```bash
pnpm install
cp .env.example .env  # configure DATABASE_URL, JWT_SIGNING_KEY
pnpm db:push
pnpm dev
```

The control plane runs on `http://localhost:5173`. The API runs on `http://localhost:3000`.

---

## Integration

Agents call ProofGuard via a single attestation endpoint. The minimum integration is one HTTP call before each side-effecting action.

```typescript
const verdict = await fetch('https://proofguard.local/api/attest', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${PROOFGUARD_API_KEY}` },
  body: JSON.stringify({
    agent_id: 'stripe_agent',
    action: 'create_subscription',
    risk_tier: 'high',
    imda_pillar: 'human_accountability',
    side_effects: ['stripe.products.create', 'stripe.prices.create'],
    plan: { /* the agent's proposed action */ },
  }),
}).then(r => r.json())

// verdict.status: 'APPROVED' | 'BLOCKED' | 'REQUIRES_HITL'
// verdict.cqs_score: 0-100
// verdict.attestation_id: signed UUID
```

---

## Repository Layout

```
proofguard-ai/
├── client/            # React control plane (HITL approval UI, audit viewer)
├── server/            # Node API (attestation engine, CQS scoring, ledger)
├── shared/            # Shared types between client and server
├── drizzle/           # Database schema and migrations
└── seed-db.mjs        # Local development seed
```

---

## Status

In active development. Production users today: [LaunchOpsPro](https://github.com/Gnoscenti/LaunchOpsPro).

---

## Related

- **LaunchOpsPro** — canonical operator OS that consumes ProofGuard attestations: https://github.com/Gnoscenti/LaunchOpsPro
- **Dynexis Core** — portfolio architecture overview: https://github.com/Gnoscenti/dynexis-core
- **MicroAI Studios DAO** — governance parent: https://github.com/MicroAIStudios-DAO/microai-dao-core

---

**Built by MicroAI Studios DAO LLC.** Proof-of-Agent™ is a trademark of MicroAI Studios DAO LLC.
