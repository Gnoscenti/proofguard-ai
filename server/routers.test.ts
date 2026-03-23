import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database module
vi.mock("./db", () => ({
  listAttestations: vi.fn().mockResolvedValue({
    rows: [
      {
        id: 1,
        attestationId: "att_test123",
        agentId: "agent_001",
        agentName: "TestAgent",
        cqsScore: 95,
        imdaPillar: "Internal Governance",
        action: "data_query",
        actionJson: { type: "data_query", input_hash: "sha256:abc" },
        riskTier: "low",
        flagged: false,
        patchedAt: null,
        modelHash: "sha256:model123",
        policyHash: "sha256:policy123",
        traceJson: { nodes: [], flagged: false },
        hitlApprover: null,
        createdAt: new Date(),
      },
    ],
    total: 1,
  }),
  getAttestationById: vi.fn().mockResolvedValue({
    id: 1,
    attestationId: "att_test123",
    agentId: "agent_001",
    agentName: "TestAgent",
    cqsScore: 95,
  }),
  getAttestationStats: vi.fn().mockResolvedValue({
    total: 10000,
    flagged: 1179,
    patched: 823,
    avgCqs: 89,
  }),
  insertAttestations: vi.fn().mockResolvedValue(undefined),
  listGuardrails: vi.fn().mockResolvedValue([
    {
      id: 1,
      ruleId: "GR-001",
      description: "Block unverified external API calls",
      action: "block",
      version: 3,
      triggerCount: 1247,
      corpusSize: 450,
    },
  ]),
  insertGuardrails: vi.fn().mockResolvedValue(undefined),
  listControls: vi.fn().mockResolvedValue([
    {
      id: 1,
      controlId: "AICM-GOV-001",
      name: "AI Governance Policy",
      category: "Governance & Oversight",
      objective: "Ensure governance framework",
      status: "pass",
      score: 95,
      framework: "AICM",
    },
  ]),
  getControlStats: vi.fn().mockResolvedValue({
    total: 243,
    passing: 189,
    warning: 31,
    failing: 15,
    pending: 8,
    avgScore: 84,
  }),
  insertControls: vi.fn().mockResolvedValue(undefined),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
  getDb: vi.fn(),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
      stripeCustomerId: null,
      stripeSubscriptionId: null,
    },
    req: {
      protocol: "https",
      headers: { origin: "https://test.example.com" },
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("attestation router", () => {
  it("lists attestations with default params", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.attestation.list();
    expect(result).toHaveProperty("rows");
    expect(result).toHaveProperty("total");
    expect(result.rows.length).toBeGreaterThanOrEqual(0);
  });

  it("lists attestations with custom limit", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.attestation.list({ limit: 10, offset: 0 });
    expect(result).toHaveProperty("rows");
    expect(result).toHaveProperty("total");
  });

  it("gets attestation by ID", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.attestation.byId({ attestationId: "att_test123" });
    expect(result).toBeDefined();
    expect(result?.attestationId).toBe("att_test123");
  });

  it("returns attestation stats", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.attestation.stats();
    expect(result).toHaveProperty("total");
    expect(result).toHaveProperty("flagged");
    expect(result).toHaveProperty("patched");
    expect(result).toHaveProperty("avgCqs");
    expect(result?.total).toBe(10000);
  });
});

describe("guardrail router", () => {
  it("lists guardrails", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.guardrail.list();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(0);
  });
});

describe("control router", () => {
  it("lists controls with no filters", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.control.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("returns control stats", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.control.stats();
    expect(result).toHaveProperty("total");
    expect(result).toHaveProperty("avgScore");
  });
});

describe("compliance router", () => {
  it("returns full compliance export data", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.compliance.exportData();
    expect(result).toHaveProperty("generatedAt");
    expect(result).toHaveProperty("framework");
    expect(result.framework.standards).toContain("IMDA Model AI Governance Framework");
    expect(result.framework.standards).toContain("CSA AI Controls Matrix (AICM) 2026");
    expect(result).toHaveProperty("attestationSummary");
    expect(result).toHaveProperty("controlsSummary");
    expect(result).toHaveProperty("guardrailsSummary");
    expect(result).toHaveProperty("imdaPillars");
    expect(result.imdaPillars.length).toBe(4);
  });
});

describe("auth router", () => {
  it("returns null for unauthenticated user", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("returns user for authenticated user", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.auth.me();
    expect(result).toBeDefined();
    expect(result?.email).toBe("test@example.com");
  });
});
