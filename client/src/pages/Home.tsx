/*
 * ProofGuard AI — Home / Landing Page
 * Quantum Shield Design: Dark command center with holographic accents
 * Merged ExecAI Trust + ProofGuard architecture
 */
import Navbar from "@/components/Navbar";
import CQSRadar from "@/components/CQSRadar";
import TraceFlow from "@/components/TraceFlow";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Shield, Activity, FileCheck, Zap, ArrowRight,
  Lock, Eye, Brain, Users, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { microAIProducts, imdaPillars, calculateCQS, guardrailRules } from "@/lib/data";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/95992963/7wVRVJHABKxJDahFYgVfUS/hero-bg-g7MgPd7zE9HUehmd9mXyvn.webp";
const BADGE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/95992963/7wVRVJHABKxJDahFYgVfUS/attestation-badge-9F8JMXyhwAZjtV9iFuVrDr.webp";
const TRACE_BG = "https://d2xsxph8kpxj0f.cloudfront.net/95992963/7wVRVJHABKxJDahFYgVfUS/trace-flow-bg-fkmUeBWUv7xrJ6SigVqPeT.webp";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function Home() {
  const cqs = calculateCQS(imdaPillars);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ─── Hero Section ─── */}
      <section
        className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />

        <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center py-20">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
              <span className="mono-data text-xs text-primary font-medium">Proof-of-Agent™ Standard</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
              Every Agent Action,{" "}
              <span className="text-primary glow-text-cyan">Verified.</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
              Real-time attestation, CQS scoring, and self-optimizing guardrails
              for agentic AI systems. Built on ExecAI Trust architecture, compliant
              with IMDA Model AI Governance and CSA AI Controls Matrix.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 glow-cyan">
                  <Activity className="w-4 h-4" />
                  Live Dashboard
                </Button>
              </Link>
              <Link href="/schema">
                <Button size="lg" variant="outline" className="gap-2">
                  <FileCheck className="w-4 h-4" />
                  Open Schema
                </Button>
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex gap-8 mt-10 pt-8 border-t border-border/30">
              {[
                { value: "10K+", label: "Attestations" },
                { value: "243", label: "AICM Controls" },
                { value: `${cqs}`, label: "CQS Score" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.15 }}
                >
                  <div className="mono-data text-2xl font-bold text-primary glow-text-cyan">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: CQS Radar */}
          <motion.div
            className="glass-card rounded-2xl p-8 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="mono-data text-xs text-emerald-400">LIVE</span>
            </div>
            <CQSRadar />
            <div className="text-center mt-4">
              <p className="text-xs text-muted-foreground">
                IMDA Pillar 1–4 + CSA AICM Composite Score
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Agentic Loop Section ─── */}
      <section className="py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${TRACE_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

        <div className="container relative z-10">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Self-Optimizing <span className="text-primary glow-text-cyan">Agentic Loop</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every flagged incident becomes proprietary moat data. The system traces root causes,
              proposes patches, updates guardrails, and recalculates CQS — automatically.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="glass-card rounded-2xl p-8">
            <TraceFlow />
            <div className="mt-8 grid sm:grid-cols-4 gap-4">
              {[
                { icon: Eye, label: "Flag", desc: "Anomaly detected in agent action", color: "text-rose-400" },
                { icon: Brain, label: "Trace", desc: "Root cause DAG analysis", color: "text-primary" },
                { icon: Zap, label: "Patch", desc: "Auto-generate guardrail update", color: "text-violet-400" },
                { icon: CheckCircle2, label: "Recalc", desc: "CQS score recomputed", color: "text-emerald-400" },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  className="text-center p-4 rounded-xl bg-secondary/30"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <step.icon className={`w-6 h-6 mx-auto mb-2 ${step.color}`} />
                  <div className="font-semibold text-sm mb-1">{step.label}</div>
                  <div className="text-xs text-muted-foreground">{step.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Architecture Pillars ─── */}
      <section className="py-24">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Merged <span className="text-primary glow-text-cyan">Trust Architecture</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ExecAI Trust's 7-control framework extended to AICM 243 controls,
              mapped across IMDA's 4 governance pillars and NIST AI RMF 2.0.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {imdaPillars.map((pillar, i) => {
              const icons = [Lock, Users, Shield, Activity];
              const Icon = icons[i];
              return (
                <motion.div
                  key={pillar.id}
                  className="glass-card rounded-xl p-6 group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Pillar {pillar.id}</div>
                      <div className="font-semibold text-sm">{pillar.name}</div>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Score</span>
                      <span className="mono-data text-primary font-semibold">{pillar.score}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pillar.score}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                      />
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {pillar.passing}/{pillar.controls} controls passing
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Guardrail Rules ─── */}
      <section className="py-24 bg-secondary/20">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Active <span className="text-violet-400 glow-text-violet">Guardrails</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Deterministic policy boundaries inherited from ExecAI Trust,
              continuously updated by the self-optimizing patch engine.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {guardrailRules.map((rule, i) => (
              <motion.div
                key={rule.id}
                className="glass-card rounded-xl p-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <code className="mono-data text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {rule.id}
                  </code>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    rule.action === 'block' ? 'bg-rose-500/10 text-rose-400' :
                    rule.action === 'route_to_hitl' ? 'bg-amber-500/10 text-amber-400' :
                    rule.action === 'block_and_log' ? 'bg-rose-500/10 text-rose-400' :
                    'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {rule.action.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-sm text-foreground mb-3">{rule.description}</p>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>v{rule.version}</span>
                  <span className="mono-data">{rule.triggerCount.toLocaleString()} triggers</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MicroAI Ecosystem ─── */}
      <section className="py-24">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              MicroAI <span className="text-primary glow-text-cyan">Ecosystem</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ProofGuard AI serves as the trust layer across the entire MicroAI Studios DAO portfolio.
              Every agent action, every governance decision, every transaction — attested.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {microAIProducts.map((product, i) => (
              <motion.div
                key={product.name}
                className="glass-card rounded-xl p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-primary" />
                  <h3 className="font-bold">{product.name}</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-4">{product.description}</p>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Attestations</span>
                    <span className="mono-data text-foreground">{product.attestations.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">CQS</span>
                    <span className="mono-data text-primary font-semibold">{product.cqs}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/30">
                  <code className="mono-data text-[10px] text-muted-foreground break-all">
                    {product.repo}
                  </code>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Proof-of-Agent Badge ─── */}
      <section className="py-24 bg-secondary/20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp}>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                The <span className="text-primary glow-text-cyan">Proof-of-Agent™</span> Standard
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                A tamper-evident, cryptographically signed attestation that proves an AI agent's
                action was governed, audited, and compliant. Every attestation includes model hash,
                policy hash, HITL approval chain, and CQS score at time of execution.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Open AAS (Agent Attestation Schema) on GitHub",
                  "CSA AICM extension + NIST RMF 2.0 annex compatible",
                  "Embeddable verification badge for any product",
                  "Proprietary keys + reference implementation",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/schema">
                <Button className="gap-2">
                  View Schema <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <img
                  src={BADGE_IMG}
                  alt="Proof-of-Agent Certification Badge"
                  className="w-72 h-72 object-contain animate-float"
                />
                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24">
        <div className="container text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Certify Your Agents?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Join the movement. Make Proof-of-Agent™ the 2026 standard for agentic AI governance.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/pricing">
                <Button size="lg" className="gap-2 glow-cyan">
                  View Pricing <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="gap-2">
                  Try Live Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border/30 py-12">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-bold">ProofGuard AI</span>
              <span className="text-xs text-muted-foreground ml-2">by MicroAI Studios DAO LLC</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <span>IMDA Compliant</span>
              <span>CSA AICM 2026</span>
              <span>NIST AI RMF 2.0</span>
            </div>
            <div className="mono-data text-xs text-muted-foreground">
              © 2026 MicroAI Studios DAO LLC
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
