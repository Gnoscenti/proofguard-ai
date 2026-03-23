/*
 * ProofGuard AI — Schema & API Page
 * Open AAS (Agent Attestation Schema), embed code generator, API docs
 * Quantum Shield Design
 */
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Code2, Copy, Check, FileJson, Terminal, Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const aasSchema = `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://proofguard.ai/schemas/aas/v1",
  "title": "Agent Attestation Schema (AAS) v1.0",
  "description": "Proof-of-Agent™ open attestation standard by MicroAI Studios DAO LLC",
  "type": "object",
  "required": ["attestation_id", "agent_id", "action", "cqs_score", "timestamp", "signatures"],
  "properties": {
    "attestation_id": {
      "type": "string",
      "format": "uuid",
      "description": "Unique attestation identifier"
    },
    "agent_id": {
      "type": "string",
      "description": "Unique identifier of the attested agent"
    },
    "agent_name": {
      "type": "string",
      "description": "Human-readable agent name"
    },
    "action": {
      "type": "object",
      "properties": {
        "type": { "type": "string" },
        "input_hash": { "type": "string" },
        "output_hash": { "type": "string" },
        "context_hash": { "type": "string" }
      }
    },
    "cqs_score": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "description": "Composite Quality Score at time of attestation"
    },
    "imda_pillar": {
      "type": "string",
      "enum": ["Internal Governance", "Human Accountability", "Technical Robustness", "User Enablement"]
    },
    "risk_tier": {
      "type": "string",
      "enum": ["low", "medium", "high", "critical"]
    },
    "guardrails_applied": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "rule_id": { "type": "string" },
          "version": { "type": "integer" },
          "action_taken": { "type": "string" }
        }
      }
    },
    "trace": {
      "type": "object",
      "properties": {
        "nodes": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": { "type": "string" },
              "type": { "type": "string" },
              "timestamp": { "type": "string", "format": "date-time" },
              "hash": { "type": "string" }
            }
          }
        },
        "flagged": { "type": "boolean" },
        "patched_at": { "type": ["string", "null"], "format": "date-time" }
      }
    },
    "signatures": {
      "type": "object",
      "properties": {
        "model_hash": { "type": "string" },
        "policy_hash": { "type": "string" },
        "attestor_key": { "type": "string" },
        "timestamp": { "type": "string", "format": "date-time" }
      }
    },
    "compliance": {
      "type": "object",
      "properties": {
        "aicm_controls": { "type": "array", "items": { "type": "string" } },
        "imda_pillars": { "type": "array", "items": { "type": "integer" } },
        "nist_rmf_functions": { "type": "array", "items": { "type": "string" } }
      }
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    }
  }
}`;

const embedCode = `<!-- ProofGuard AI — Proof-of-Agent™ Badge -->
<div id="proofguard-badge" data-agent-id="YOUR_AGENT_ID"></div>
<script src="https://cdn.proofguard.ai/badge/v1.js" async></script>

<!-- Inline verification link -->
<a href="https://proofguard.ai/verify/YOUR_ATTESTATION_ID"
   style="display:inline-flex;align-items:center;gap:6px;
          padding:6px 12px;border-radius:6px;
          background:#0B1120;border:1px solid #06B6D4;
          color:#06B6D4;font-family:monospace;font-size:12px;
          text-decoration:none;">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" stroke-width="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
  Proof-of-Agent™ Verified
</a>`;

const apiExample = `# ProofGuard AI — REST API Example

# Create attestation
curl -X POST https://api.proofguard.ai/v1/attestations \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent_id": "agent_001",
    "action": {
      "type": "invoice_processing",
      "input_hash": "sha256:abc123...",
      "output_hash": "sha256:def456..."
    },
    "cqs_score": 96,
    "imda_pillar": "Technical Robustness"
  }'

# Get attestation by ID
curl https://api.proofguard.ai/v1/attestations/att_abc123 \\
  -H "Authorization: Bearer YOUR_API_KEY"

# List attestations with filters
curl "https://api.proofguard.ai/v1/attestations?agent_id=agent_001&flagged=true&limit=50" \\
  -H "Authorization: Bearer YOUR_API_KEY"

# Export compliance report
curl -X POST https://api.proofguard.ai/v1/reports/compliance \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"format": "pdf", "frameworks": ["AICM", "IMDA", "NIST"]}'`;

const pythonSDK = `# ProofGuard AI — Python SDK
# pip install proofguard

from proofguard import ProofGuardClient

client = ProofGuardClient(api_key="YOUR_API_KEY")

# Create attestation
attestation = client.attest(
    agent_id="agent_001",
    action_type="invoice_processing",
    input_hash="sha256:abc123...",
    output_hash="sha256:def456...",
    cqs_score=96,
    imda_pillar="Technical Robustness",
)

print(f"Attestation ID: {attestation.id}")
print(f"CQS Score: {attestation.cqs_score}")
print(f"Badge URL: {attestation.badge_url}")

# Query attestations
results = client.attestations.list(
    agent_id="agent_001",
    flagged=True,
    limit=50,
)

# Export compliance report
report = client.reports.compliance(
    format="pdf",
    frameworks=["AICM", "IMDA", "NIST"],
)
report.save("compliance_report.pdf")

# Self-optimizing guardrail loop
@client.on_flag
def handle_flag(event):
    """Automatically triggered when an attestation is flagged"""
    trace = client.trace(event.attestation_id)
    patch = client.suggest_patch(trace)
    if patch.confidence > 0.9:
        client.apply_patch(patch)
        client.recalculate_cqs(event.agent_id)`;

const supabaseSchema = `-- ProofGuard AI — Supabase Schema
-- Run in Supabase SQL editor

CREATE TABLE attestations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  agent_name TEXT,
  cqs_score INTEGER CHECK (cqs_score >= 0 AND cqs_score <= 100),
  imda_pillar TEXT CHECK (imda_pillar IN (
    'Internal Governance',
    'Human Accountability',
    'Technical Robustness',
    'User Enablement'
  )),
  action_json JSONB NOT NULL DEFAULT '{}',
  risk_tier TEXT CHECK (risk_tier IN ('low', 'medium', 'high', 'critical')),
  flagged BOOLEAN DEFAULT FALSE,
  patched_at TIMESTAMPTZ,
  model_hash TEXT,
  policy_hash TEXT,
  trace_json JSONB,
  compliance_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE guardrails (
  id SERIAL PRIMARY KEY,
  rule_id TEXT UNIQUE NOT NULL,
  description TEXT,
  action TEXT CHECK (action IN ('block', 'route_to_hitl', 'block_and_log', 'allow_with_audit')),
  version INTEGER DEFAULT 1,
  trigger_count INTEGER DEFAULT 0,
  corpus_size INTEGER DEFAULT 0,
  last_triggered TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE controls (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  objective TEXT,
  status TEXT CHECK (status IN ('pass', 'warn', 'fail', 'pending')),
  score INTEGER CHECK (score >= 0 AND score <= 100),
  framework TEXT CHECK (framework IN ('AICM', 'IMDA', 'ExecAI', 'NIST')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_attestations_agent ON attestations(agent_id);
CREATE INDEX idx_attestations_flagged ON attestations(flagged) WHERE flagged = TRUE;
CREATE INDEX idx_attestations_created ON attestations(created_at DESC);
CREATE INDEX idx_controls_category ON controls(category);
CREATE INDEX idx_controls_framework ON controls(framework);

-- Row Level Security
ALTER TABLE attestations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardrails ENABLE ROW LEVEL SECURITY;
ALTER TABLE controls ENABLE ROW LEVEL SECURITY;`;

export default function Schema() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    toast.success(`${section} copied to clipboard`);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const CopyButton = ({ text, section }: { text: string; section: string }) => (
    <Button
      size="sm"
      variant="ghost"
      className="absolute top-3 right-3 h-8 w-8 p-0"
      onClick={() => copyToClipboard(text, section)}
    >
      {copiedSection === section ? (
        <Check className="w-4 h-4 text-emerald-400" />
      ) : (
        <Copy className="w-4 h-4 text-muted-foreground" />
      )}
    </Button>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 pb-24">
        <div className="container">
          {/* Header */}
          <motion.div
            className="mb-12 pt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Code2 className="w-7 h-7 text-primary" />
              <h1 className="text-2xl font-bold">Schema & API</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Open Agent Attestation Schema (AAS), REST API documentation, Python SDK,
              embeddable verification badges, and Supabase schema for self-hosted deployments.
            </p>
          </motion.div>

          <Tabs defaultValue="schema" className="space-y-6">
            <TabsList className="bg-secondary/50 p-1">
              <TabsTrigger value="schema" className="gap-2 text-xs">
                <FileJson className="w-3.5 h-3.5" /> AAS Schema
              </TabsTrigger>
              <TabsTrigger value="api" className="gap-2 text-xs">
                <Terminal className="w-3.5 h-3.5" /> REST API
              </TabsTrigger>
              <TabsTrigger value="sdk" className="gap-2 text-xs">
                <Code2 className="w-3.5 h-3.5" /> Python SDK
              </TabsTrigger>
              <TabsTrigger value="embed" className="gap-2 text-xs">
                <Shield className="w-3.5 h-3.5" /> Embed Badge
              </TabsTrigger>
              <TabsTrigger value="supabase" className="gap-2 text-xs">
                <ExternalLink className="w-3.5 h-3.5" /> Supabase
              </TabsTrigger>
            </TabsList>

            {/* AAS Schema */}
            <TabsContent value="schema">
              <motion.div
                className="glass-card rounded-xl overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center justify-between p-4 border-b border-border/30">
                  <div>
                    <h3 className="font-semibold text-sm">Agent Attestation Schema (AAS) v1.0</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Open standard — JSON Schema 2020-12 — Proof-of-Agent™ compatible
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-xs"
                      onClick={() => copyToClipboard(aasSchema, "AAS Schema")}
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <pre className="p-6 overflow-x-auto text-xs leading-relaxed">
                    <code className="mono-data text-foreground/80">{aasSchema}</code>
                  </pre>
                </div>
              </motion.div>
            </TabsContent>

            {/* REST API */}
            <TabsContent value="api">
              <motion.div
                className="glass-card rounded-xl overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center justify-between p-4 border-b border-border/30">
                  <div>
                    <h3 className="font-semibold text-sm">REST API — cURL Examples</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Base URL: https://api.proofguard.ai/v1
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 text-xs"
                    onClick={() => copyToClipboard(apiExample, "API Examples")}
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </Button>
                </div>
                <pre className="p-6 overflow-x-auto text-xs leading-relaxed">
                  <code className="mono-data text-foreground/80">{apiExample}</code>
                </pre>
              </motion.div>
            </TabsContent>

            {/* Python SDK */}
            <TabsContent value="sdk">
              <motion.div
                className="glass-card rounded-xl overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center justify-between p-4 border-b border-border/30">
                  <div>
                    <h3 className="font-semibold text-sm">Python SDK — proofguard</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      pip install proofguard — Includes self-optimizing guardrail loop
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 text-xs"
                    onClick={() => copyToClipboard(pythonSDK, "Python SDK")}
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </Button>
                </div>
                <pre className="p-6 overflow-x-auto text-xs leading-relaxed">
                  <code className="mono-data text-foreground/80">{pythonSDK}</code>
                </pre>
              </motion.div>
            </TabsContent>

            {/* Embed Badge */}
            <TabsContent value="embed">
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Preview */}
                <div className="glass-card rounded-xl p-8">
                  <h3 className="font-semibold text-sm mb-6">Badge Preview</h3>
                  <div className="flex flex-wrap gap-6 items-center">
                    {/* Inline badge */}
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-primary/40 bg-background"
                      style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px" }}
                    >
                      <Shield className="w-3.5 h-3.5 text-primary" />
                      <span className="text-primary font-medium">Proof-of-Agent™ Verified</span>
                    </div>

                    {/* Full badge */}
                    <div className="glass-card rounded-lg p-4 max-w-xs">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-primary" />
                        <span className="font-bold text-sm">ProofGuard AI</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">CQS Score</span>
                          <span className="mono-data text-primary font-semibold">96</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Attestations</span>
                          <span className="mono-data">4,231</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">AICM Controls</span>
                          <span className="mono-data text-emerald-400">228/243 pass</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Embed Code */}
                <div className="glass-card rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-border/30">
                    <div>
                      <h3 className="font-semibold text-sm">Embed Code</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Add to any website to display Proof-of-Agent™ verification
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-xs"
                      onClick={() => copyToClipboard(embedCode, "Embed Code")}
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </Button>
                  </div>
                  <pre className="p-6 overflow-x-auto text-xs leading-relaxed">
                    <code className="mono-data text-foreground/80">{embedCode}</code>
                  </pre>
                </div>
              </motion.div>
            </TabsContent>

            {/* Supabase Schema */}
            <TabsContent value="supabase">
              <motion.div
                className="glass-card rounded-xl overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center justify-between p-4 border-b border-border/30">
                  <div>
                    <h3 className="font-semibold text-sm">Supabase SQL Schema</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Copy and paste into Supabase SQL editor for self-hosted deployment
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 text-xs"
                    onClick={() => copyToClipboard(supabaseSchema, "Supabase Schema")}
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </Button>
                </div>
                <pre className="p-6 overflow-x-auto text-xs leading-relaxed">
                  <code className="mono-data text-foreground/80">{supabaseSchema}</code>
                </pre>
              </motion.div>
            </TabsContent>
          </Tabs>

          {/* GitHub CTA */}
          <motion.div
            className="mt-12 glass-card rounded-xl p-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-3">
              Contribute to the <span className="text-primary">Proof-of-Agent™</span> Standard
            </h3>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-6">
              The AAS schema is open source. Contribute to CSA AICM extension, NIST RMF 2.0 annex,
              and help define the 2026 standard for agentic AI governance.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                className="gap-2"
                onClick={() => window.open("https://github.com/MicroAIStudios-DAO", "_blank")}
              >
                <Code2 className="w-4 h-4" /> View on GitHub
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => toast.info("Feature coming soon")}
              >
                <FileJson className="w-4 h-4" /> Download Schema
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
