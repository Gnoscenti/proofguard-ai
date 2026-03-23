/*
 * ProofGuard AI — Controls Page
 * AICM 243 controls + IMDA pillar mapping + ExecAI Trust controls
 * Quantum Shield Design
 */
import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import {
  FileCheck, Search, Download, CheckCircle2,
  AlertTriangle, XCircle, Clock, BarChart3, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { aicmCategories } from "@/lib/data";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const statusConfig = {
  pass: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Pass" },
  warn: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", label: "Warning" },
  fail: { icon: XCircle, color: "text-rose-400", bg: "bg-rose-500/10", label: "Fail" },
  pending: { icon: Clock, color: "text-muted-foreground", bg: "bg-secondary", label: "Pending" },
};

export default function Controls() {
  const { data: controlsData, isLoading } = trpc.control.list.useQuery({});
  const { data: complianceData } = trpc.compliance.exportData.useQuery();
  const controls = controlsData ?? [];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filtered = useMemo(() => {
    let result = [...controls];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) => c.name.toLowerCase().includes(q) || c.controlId.toLowerCase().includes(q) || (c.objective ?? "").toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== "all") {
      result = result.filter((c) => c.category === selectedCategory);
    }
    if (selectedStatus !== "all") {
      result = result.filter((c) => c.status === selectedStatus);
    }
    return result;
  }, [controls, searchQuery, selectedCategory, selectedStatus]);

  const stats = useMemo(() => ({
    total: controls.length,
    pass: controls.filter((c) => c.status === "pass").length,
    warn: controls.filter((c) => c.status === "warn").length,
    fail: controls.filter((c) => c.status === "fail").length,
    pending: controls.filter((c) => c.status === "pending").length,
    avgScore: Math.round(controls.reduce((s, c) => s + c.score, 0) / controls.length),
  }), [controls]);

  const categoryStats = useMemo(() => {
    return aicmCategories.map((cat) => {
      const catControls = controls.filter((c) => c.category === cat);
      const passing = catControls.filter((c) => c.status === "pass").length;
      return {
        name: cat,
        total: catControls.length,
        passing,
        pct: catControls.length > 0 ? Math.round((passing / catControls.length) * 100) : 0,
      };
    });
  }, [controls]);

  const handleExportPDF = () => {
    if (!complianceData) {
      toast.error("Loading compliance data...");
      return;
    }
    // Generate compliance report as downloadable JSON (PDF rendering in browser)
    const reportJson = JSON.stringify(complianceData, null, 2);
    const blob = new Blob([reportJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `proofguard-compliance-report-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("IMDA + AICM Compliance Report exported", {
      description: `${complianceData.controlsSummary.totalControls} controls, ${complianceData.attestationSummary.total} attestations`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 pb-12">
        <div className="container">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-primary" />
                AICM + IMDA Controls Matrix
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                243 controls mapped across CSA AI Controls Matrix, IMDA Model AI Governance, and NIST AI RMF 2.0
              </p>
            </div>
            <Button className="gap-2 glow-cyan" onClick={handleExportPDF}>
              <Download className="w-4 h-4" />
              Export Compliance PDF
            </Button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {[
              { label: "Total Controls", value: stats.total, color: "text-foreground" },
              { label: "Passing", value: stats.pass, color: "text-emerald-400" },
              { label: "Warnings", value: stats.warn, color: "text-amber-400" },
              { label: "Failing", value: stats.fail, color: "text-rose-400" },
              { label: "Pending", value: stats.pending, color: "text-muted-foreground" },
              { label: "Avg Score", value: stats.avgScore, color: "text-primary" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="glass-card rounded-lg p-4 text-center"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className={`mono-data text-xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-[10px] text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Category Overview */}
          <div className="glass-card rounded-xl p-6 mb-8">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Control Categories
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categoryStats.map((cat, i) => (
                <motion.button
                  key={cat.name}
                  className={`text-left p-3 rounded-lg transition-all ${
                    selectedCategory === cat.name
                      ? "bg-primary/10 border border-primary/30"
                      : "bg-secondary/30 hover:bg-secondary/50 border border-transparent"
                  }`}
                  onClick={() => setSelectedCategory(selectedCategory === cat.name ? "all" : cat.name)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium truncate pr-2">{cat.name}</span>
                    <span className="mono-data text-[10px] text-primary">{cat.pct}%</span>
                  </div>
                  <div className="h-1 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${cat.pct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    {cat.passing}/{cat.total} passing
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search controls..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-secondary/50"
              />
            </div>
            {(["all", "pass", "warn", "fail", "pending"] as const).map((status) => (
              <Button
                key={status}
                size="sm"
                variant={selectedStatus === status ? "default" : "outline"}
                onClick={() => setSelectedStatus(status)}
                className="text-xs"
              >
                {status === "all" ? "All" : statusConfig[status].label}
              </Button>
            ))}
          </div>

          {/* Controls Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.slice(0, 60).map((control, i) => {
              const cfg = statusConfig[control.status as keyof typeof statusConfig];
              const StatusIcon = cfg.icon;
              return (
                <motion.div
                  key={control.controlId}
                  className="glass-card rounded-lg p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.5) }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <code className="mono-data text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                      {control.controlId}
                    </code>
                    <div className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {cfg.label}
                    </div>
                  </div>
                  <h4 className="text-xs font-semibold mb-1">{control.name}</h4>
                  <p className="text-[10px] text-muted-foreground mb-3 line-clamp-2">{control.objective}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      control.framework === "AICM" ? "bg-primary/10 text-primary" :
                      control.framework === "IMDA" ? "bg-violet-500/10 text-violet-400" :
                      control.framework === "ExecAI" ? "bg-emerald-500/10 text-emerald-400" :
                      "bg-amber-500/10 text-amber-400"
                    }`}>
                      {control.framework}
                    </span>
                    <span className={`mono-data text-xs font-semibold ${
                      control.score >= 90 ? "text-emerald-400" :
                      control.score >= 70 ? "text-amber-400" :
                      "text-rose-400"
                    }`}>
                      {control.score}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filtered.length > 60 && (
            <div className="text-center mt-6">
              <p className="text-xs text-muted-foreground">
                Showing 60 of {filtered.length} controls. Export PDF for full report.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
