/*
 * ProofGuard AI — Pricing Page
 * Quantum Shield Design: Three-tier pricing with Stripe checkout
 * Community (Free) | Pro ($299/mo) | Enterprise ($2,000+/mo)
 */
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Check, Zap, Shield, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pricingTiers } from "@/lib/data";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

const PRICING_BG = "https://d2xsxph8kpxj0f.cloudfront.net/95992963/7wVRVJHABKxJDahFYgVfUS/pricing-bg-kiKzbWFXNQDEJuNX7qqpaq.webp";

const tierIcons = [Shield, Zap, Building2];

export default function Pricing() {
  const { isAuthenticated } = useAuth();
  const checkoutMutation = trpc.stripe.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        toast.success("Redirecting to Stripe checkout...");
        window.open(data.url, "_blank");
      }
    },
    onError: (err) => {
      toast.error("Checkout failed", { description: err.message });
    },
  });

  const handleCheckout = (tierName: string) => {
    if (tierName === "Community") {
      toast.success("Welcome to ProofGuard Community!", {
        description: "Open SDK access activated. 100 attestations/month included.",
      });
    } else if (!isAuthenticated) {
      toast.info("Please sign in first", {
        description: "You need to be signed in to subscribe.",
      });
      window.location.href = getLoginUrl();
    } else if (tierName === "Enterprise") {
      checkoutMutation.mutate({ plan: "enterprise" });
    } else {
      checkoutMutation.mutate({ plan: "pro" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 pb-24">
        <div className="container">
          {/* Header */}
          <motion.div
            className="text-center mb-16 pt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
              <span className="mono-data text-xs text-primary font-medium">Proof-of-Agent™ Pricing</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
              Certify Your Agents at <span className="text-primary glow-text-cyan">Any Scale</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              From open-source builders to sovereign deployments. Every tier includes
              the Proof-of-Agent™ standard and IMDA + AICM compliance mapping.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div
            className="relative rounded-3xl p-8 lg:p-12 overflow-hidden"
            style={{
              backgroundImage: `url(${PRICING_BG})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

            <div className="relative z-10 grid md:grid-cols-3 gap-6 lg:gap-8">
              {pricingTiers.map((tier, i) => {
                const Icon = tierIcons[i];
                return (
                  <motion.div
                    key={tier.name}
                    className={`rounded-2xl p-6 lg:p-8 transition-all ${
                      tier.highlighted
                        ? "glass-card border-primary/40 glow-cyan relative"
                        : "glass-card"
                    }`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                  >
                    {tier.highlighted && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                        Most Popular
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        tier.highlighted ? "bg-primary/20" : "bg-secondary"
                      }`}>
                        <Icon className={`w-5 h-5 ${tier.highlighted ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{tier.name}</h3>
                        <p className="text-xs text-muted-foreground">{tier.description}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <span className="mono-data text-4xl font-extrabold">{tier.price}</span>
                      {tier.period && (
                        <span className="text-muted-foreground text-sm">{tier.period}</span>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8">
                      {tier.features.map((feature, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-sm">
                          <Check className={`w-4 h-4 mt-0.5 shrink-0 ${
                            tier.highlighted ? "text-primary" : "text-muted-foreground"
                          }`} />
                          <span className="text-foreground/90">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full gap-2 ${tier.highlighted ? "glow-cyan" : ""}`}
                      variant={tier.highlighted ? "default" : "outline"}
                      onClick={() => handleCheckout(tier.name)}
                    >
                      {tier.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Comparison Table */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="text-left p-4 font-medium text-muted-foreground">Feature</th>
                      <th className="text-center p-4 font-medium">Community</th>
                      <th className="text-center p-4 font-medium text-primary">Pro</th>
                      <th className="text-center p-4 font-medium">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: "Monthly Attestations", community: "100", pro: "Unlimited", enterprise: "Unlimited" },
                      { feature: "CQS Scoring", community: "Basic", pro: "Advanced", enterprise: "Custom" },
                      { feature: "IMDA Compliance Export", community: "-", pro: "PDF", enterprise: "PDF + API" },
                      { feature: "AICM 243 Controls", community: "View Only", pro: "Full Access", enterprise: "Custom Map" },
                      { feature: "Trace Flow Visualization", community: "-", pro: "Yes", enterprise: "Yes" },
                      { feature: "Guardrail Auto-Patching", community: "-", pro: "Yes", enterprise: "Yes" },
                      { feature: "API Access", community: "Read Only", pro: "Full CRUD", enterprise: "Full + Webhooks" },
                      { feature: "White-Label", community: "-", pro: "-", enterprise: "Yes" },
                      { feature: "SOC 2 Audit Export", community: "-", pro: "-", enterprise: "Yes" },
                      { feature: "Sovereign Deployment", community: "-", pro: "-", enterprise: "On-Prem" },
                      { feature: "SLA", community: "-", pro: "99.9%", enterprise: "99.99%" },
                      { feature: "Support", community: "Community", pro: "Priority", enterprise: "Dedicated" },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-border/10 hover:bg-secondary/10">
                        <td className="p-4 font-medium text-xs">{row.feature}</td>
                        <td className="p-4 text-center text-xs text-muted-foreground">{row.community}</td>
                        <td className="p-4 text-center text-xs text-primary font-medium">{row.pro}</td>
                        <td className="p-4 text-center text-xs text-muted-foreground">{row.enterprise}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Movement Hooks */}
          <motion.div
            className="mt-16 grid sm:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {[
              {
                title: "Proof Summit 2026",
                desc: "Annual conference on agentic AI governance. Keynotes, workshops, and the ExecAI-Trust Certified badge ceremony.",
                cta: "Register Interest",
              },
              {
                title: "Slack Community",
                desc: "Join 2,000+ governance engineers building the Proof-of-Agent™ standard. Open SDK discussions, RFC reviews.",
                cta: "Join Slack",
              },
              {
                title: "ExecAI-Trust Certified",
                desc: "CSA STAR-style certification badge. Prove your AI systems meet the highest governance standards.",
                cta: "Learn More",
              },
            ].map((item, i) => (
              <div key={i} className="glass-card rounded-xl p-6">
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-xs text-muted-foreground mb-4">{item.desc}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info("Feature coming soon")}
                >
                  {item.cta}
                </Button>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
