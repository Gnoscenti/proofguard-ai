import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 128 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 128 }),
  plan: mysqlEnum("plan", ["community", "pro", "enterprise"]).default("community").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Attestations — core Proof-of-Agent™ records
 * Each row represents a single attested agent action with CQS scoring
 */
export const attestations = mysqlTable("attestations", {
  id: int("id").autoincrement().primaryKey(),
  attestationId: varchar("attestationId", { length: 64 }).notNull().unique(),
  agentId: varchar("agentId", { length: 128 }).notNull(),
  agentName: varchar("agentName", { length: 256 }),
  cqsScore: int("cqsScore").notNull(),
  imdaPillar: mysqlEnum("imdaPillar", [
    "Internal Governance",
    "Human Accountability",
    "Technical Robustness",
    "User Enablement",
  ]).notNull(),
  action: varchar("action", { length: 256 }).notNull(),
  actionJson: json("actionJson"),
  riskTier: mysqlEnum("riskTier", ["low", "medium", "high", "critical"]).notNull(),
  flagged: boolean("flagged").default(false).notNull(),
  patchedAt: timestamp("patchedAt"),
  modelHash: varchar("modelHash", { length: 128 }),
  policyHash: varchar("policyHash", { length: 128 }),
  traceJson: json("traceJson"),
  complianceJson: json("complianceJson"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Attestation = typeof attestations.$inferSelect;
export type InsertAttestation = typeof attestations.$inferInsert;

/**
 * Guardrails — deterministic policy boundaries
 * Based on ExecAI Trust guardrail engine
 */
export const guardrails = mysqlTable("guardrails", {
  id: int("id").autoincrement().primaryKey(),
  ruleId: varchar("ruleId", { length: 64 }).notNull().unique(),
  description: text("description"),
  action: mysqlEnum("action", ["block", "route_to_hitl", "block_and_log", "allow_with_audit"]).notNull(),
  version: int("version").default(1).notNull(),
  triggerCount: int("triggerCount").default(0).notNull(),
  corpusSize: int("corpusSize").default(0),
  lastTriggered: timestamp("lastTriggered"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Guardrail = typeof guardrails.$inferSelect;
export type InsertGuardrail = typeof guardrails.$inferInsert;

/**
 * Controls — AICM 243 controls mapped across frameworks
 */
export const controls = mysqlTable("controls", {
  id: int("id").autoincrement().primaryKey(),
  controlId: varchar("controlId", { length: 16 }).notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  category: varchar("category", { length: 128 }).notNull(),
  objective: text("objective"),
  status: mysqlEnum("status", ["pass", "warn", "fail", "pending"]).notNull(),
  score: int("score").notNull(),
  framework: mysqlEnum("framework", ["AICM", "IMDA", "ExecAI", "NIST"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Control = typeof controls.$inferSelect;
export type InsertControl = typeof controls.$inferInsert;
