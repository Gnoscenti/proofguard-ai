/**
 * ProofGuard AI — Stripe Webhook Handler
 * Handles checkout.session.completed, customer.subscription.updated, etc.
 */
import type { Request, Response } from "express";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { users } from "../drizzle/schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-02-25.clover",
});

export async function stripeWebhookHandler(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.warn("[Stripe Webhook] Missing signature or webhook secret");
    return res.status(400).json({ error: "Missing signature or webhook secret" });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error("[Stripe Webhook] Signature verification failed:", err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (userId) {
          const db = await getDb();
          if (db) {
            const plan = session.metadata?.plan || "pro";
            await db.update(users).set({
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              plan: plan as "community" | "pro" | "enterprise",
            }).where(eq(users.id, parseInt(userId)));
            console.log(`[Stripe Webhook] Updated user ${userId} to plan: ${plan}`);
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const db = await getDb();
        if (db && subscription.id) {
          // Check if subscription is active or cancelled
          if (subscription.status === "canceled" || subscription.status === "unpaid") {
            await db.update(users).set({
              plan: "community",
              stripeSubscriptionId: null,
            }).where(eq(users.stripeSubscriptionId, subscription.id));
            console.log(`[Stripe Webhook] Subscription ${subscription.id} cancelled, downgraded to community`);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const db = await getDb();
        if (db) {
          await db.update(users).set({
            plan: "community",
            stripeSubscriptionId: null,
          }).where(eq(users.stripeSubscriptionId, subscription.id));
          console.log(`[Stripe Webhook] Subscription ${subscription.id} deleted, downgraded to community`);
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[Stripe Webhook] Invoice ${invoice.id} paid for customer ${invoice.customer}`);
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error(`[Stripe Webhook] Error processing ${event.type}:`, err);
  }

  return res.json({ received: true });
}
