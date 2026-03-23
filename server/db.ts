import { eq, desc, sql, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, attestations, guardrails, controls, type InsertAttestation, type InsertGuardrail, type InsertControl } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ─── Attestation Queries ────────────────────────────────────────────────

export async function listAttestations(opts: { limit?: number; offset?: number; flagged?: boolean } = {}) {
  const db = await getDb();
  if (!db) return { rows: [], total: 0 };

  const { limit = 50, offset = 0, flagged } = opts;
  const conditions = flagged !== undefined ? and(eq(attestations.flagged, flagged)) : undefined;

  const rows = await db.select().from(attestations)
    .where(conditions)
    .orderBy(desc(attestations.createdAt))
    .limit(limit)
    .offset(offset);

  const [countResult] = await db.select({ count: sql<number>`count(*)` })
    .from(attestations)
    .where(conditions);

  return { rows, total: countResult?.count ?? 0 };
}

export async function getAttestationById(attestationId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(attestations).where(eq(attestations.attestationId, attestationId)).limit(1);
  return result[0];
}

export async function insertAttestations(data: InsertAttestation[]) {
  const db = await getDb();
  if (!db) return;
  // Batch insert in chunks of 500
  for (let i = 0; i < data.length; i += 500) {
    const chunk = data.slice(i, i + 500);
    await db.insert(attestations).values(chunk);
  }
}

export async function getAttestationStats() {
  const db = await getDb();
  if (!db) return null;
  const [stats] = await db.select({
    total: sql<number>`count(*)`,
    flagged: sql<number>`sum(case when flagged = 1 then 1 else 0 end)`,
    patched: sql<number>`sum(case when patchedAt is not null then 1 else 0 end)`,
    avgCqs: sql<number>`round(avg(cqsScore))`,
  }).from(attestations);
  return stats;
}

// ─── Guardrail Queries ──────────────────────────────────────────────────

export async function listGuardrails() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(guardrails).orderBy(desc(guardrails.triggerCount));
}

export async function insertGuardrails(data: InsertGuardrail[]) {
  const db = await getDb();
  if (!db) return;
  await db.insert(guardrails).values(data);
}

// ─── Control Queries ────────────────────────────────────────────────────

export async function listControls(opts: { category?: string; framework?: string } = {}) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(controls);
  // Note: filtering done in application layer for simplicity
  return query.orderBy(controls.controlId);
}

export async function insertControls(data: InsertControl[]) {
  const db = await getDb();
  if (!db) return;
  for (let i = 0; i < data.length; i += 500) {
    const chunk = data.slice(i, i + 500);
    await db.insert(controls).values(chunk);
  }
}

export async function getControlStats() {
  const db = await getDb();
  if (!db) return null;
  const [stats] = await db.select({
    total: sql<number>`count(*)`,
    passing: sql<number>`sum(case when status = 'pass' then 1 else 0 end)`,
    warning: sql<number>`sum(case when status = 'warn' then 1 else 0 end)`,
    failing: sql<number>`sum(case when status = 'fail' then 1 else 0 end)`,
    pending: sql<number>`sum(case when status = 'pending' then 1 else 0 end)`,
    avgScore: sql<number>`round(avg(score))`,
  }).from(controls);
  return stats;
}
