/*
 * ProofGuard AI — Dashboard Page
 * Quantum Shield: War-room style dashboard with live attestation feed
 * Now powered by tRPC + database
 */
import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import CQSRadar from "@/components/CQSRadar";
import TraceFlow from "@/components/TraceFlow";
import { motion } from "framer-motion";
import {
  Shield, AlertTriangle, CheckCircle2, Clock, Activity,
  Search, Filter, ChevronDown, ChevronUp, Download, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { imdaPillars, calculateCQS, guardrailRules } from "@/lib/data";
import { toast } from "sonner";

const DASHBOARD_BG = "https://d2xsxph8kpxj0f.cloudfront.net/95992963/7wVRVJHABKxJDahFYgVfUS/dashboard-glow-jxUg57t2VoYjxCW9pgVZDa.webp";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFlagged, setFilterFlagged] = useState(false);
  const [sortField, setSortField] = useState<"createdAt" | "cqsScore">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const cqs = calculateCQS(imdaPillars);

  // Fetch attestations from database
  const { data: attestationData, isLoading } = trpc.attestation.list.useQuery({
    limit: 200,
    offset: 0,
    flagged: filterFlagged ? true : undefined,
  });

  // Fetch stats from database
  const { data: dbStats } = trpc.attestation.stats.useQuery();

  const attestations = attestationData?.rows ?? [];

  const filtered = useMemo(() => {
    let result = [...attestations];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          (a.agentName ?? "").toLowerCase().includes(q) ||
          a.action.toLowerCase().includes(q) ||
          a.attestationId.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      const aVal = sortField === "createdAt" ? new Date(a.createdAt).getTime() : a.cqsScore;
      const bVal = sortField === "createdAt" ? new Date(b.createdAt).getTime() : b.cqsScore;
      return sortDir === "desc" ? bVal - aVal : aVal - bVal;
    });
    return result;
  }, [attestations, searchQuery, sortField, sortDir]);

  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const stats = {
    total: dbStats?.total ?? attestations.length,
    flagged: dbStats?.flagged ?? 0,
    patched: dbStats?.patched ?? 0,
    avgCqs: dbStats?.avgCqs ?? cqs,
  };

  const toggleSort = (field: "createdAt" | "cqsScore") => {
    if (sortField === field) {
      setSortDir(sortDir === "desc" ? "asc" : "desc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ field }: { field: "createdAt" | "cqsScore" }) =>
    sortField === field ? (
      sortDir === "desc" ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
    ) : null;

  const handleExport = () => {
    const csv = [
      "id,agent,action,cqs,pillar,flagged,risk,timestamp",
      ...filtered.map(a =>
        `${a.attestationId},${a.agentName},${a.action},${a.cqsScore},${a.imdaPillar},${a.flagged},${a.riskTier},${a.createdAt}`
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "proofguard-attestations.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Attestations exported as CSV");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 pb-12">
        <div className="container">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold">Attestation Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Real-time monitoring of agent actions across the MicroAI ecosystem
              </p>
            </div>
            <Button variant="outline" className="gap-2" onClick={handleExport}>
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Activity, label: "Total Attestations", value: Number(stats.total).toLocaleString(), color: "text-primary" },
              { icon: AlertTriangle, label: "Flagged", value: Number(stats.flagged).toLocaleString(), color: "text-rose-400" },
              { icon: CheckCircle2, label: "Auto-Patched", value: Number(stats.patched).toLocaleString(), color: "text-emerald-400" },
              { icon: Shield, label: "Avg CQS", value: String(stats.avgCqs), color: "text-primary" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="glass-card rounded-xl p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <div className={`mono-data text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Attestation Table */}
            <div className="lg:col-span-2">
              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search agent, action, or ID..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                    className="pl-9 bg-secondary/50"
                  />
                </div>
                <Button
                  variant={filterFlagged ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                  onClick={() => { setFilterFlagged(!filterFlagged); setPage(0); }}
                >
                  <Filter className="w-3 h-3" />
                  Flagged Only
                </Button>
              </div>

              {/* Table */}
              <div className="glass-card rounded-xl overflow-hidden">
                {isLoading ? (
                  <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="ml-2 text-sm text-muted-foreground">Loading attestations...</span>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border/30 text-xs text-muted-foreground">
                            <th className="text-left p-3 font-medium">ID</th>
                            <th className="text-left p-3 font-medium">Agent</th>
                            <th className="text-left p-3 font-medium">Action</th>
                            <th
                              className="text-left p-3 font-medium cursor-pointer hover:text-foreground flex items-center gap-1"
                              onClick={() => toggleSort("cqsScore")}
                            >
                              CQS <SortIcon field="cqsScore" />
                            </th>
                            <th className="text-left p-3 font-medium">Risk</th>
                            <th className="text-left p-3 font-medium">Status</th>
                            <th
                              className="text-left p-3 font-medium cursor-pointer hover:text-foreground"
                              onClick={() => toggleSort("createdAt")}
                            >
                              <span className="flex items-center gap-1">
                                Time <SortIcon field="createdAt" />
                              </span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {paged.map((att, i) => (
                            <motion.tr
                              key={att.attestationId}
                              className="border-b border-border/10 hover:bg-secondary/20 transition-colors"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: i * 0.02 }}
                            >
                              <td className="p-3 mono-data text-xs text-muted-foreground">
                                {att.attestationId.slice(0, 12)}...
                              </td>
                              <td className="p-3 font-medium text-xs">{att.agentName}</td>
                              <td className="p-3 text-xs text-muted-foreground">{att.action.replace(/_/g, " ")}</td>
                              <td className="p-3">
                                <span className={`mono-data text-xs font-semibold ${
                                  att.cqsScore >= 90 ? "text-emerald-400" :
                                  att.cqsScore >= 80 ? "text-primary" :
                                  att.cqsScore >= 70 ? "text-amber-400" :
                                  "text-rose-400"
                                }`}>
                                  {att.cqsScore}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                  att.riskTier === "low" ? "bg-emerald-500/10 text-emerald-400" :
                                  att.riskTier === "medium" ? "bg-primary/10 text-primary" :
                                  att.riskTier === "high" ? "bg-amber-500/10 text-amber-400" :
                                  "bg-rose-500/10 text-rose-400"
                                }`}>
                                  {att.riskTier}
                                </span>
                              </td>
                              <td className="p-3">
                                {att.flagged ? (
                                  att.patchedAt ? (
                                    <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                                      <CheckCircle2 className="w-3 h-3" /> patched
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1 text-[10px] text-rose-400">
                                      <AlertTriangle className="w-3 h-3" /> flagged
                                    </span>
                                  )
                                ) : (
                                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                    <CheckCircle2 className="w-3 h-3" /> clear
                                  </span>
                                )}
                              </td>
                              <td className="p-3 mono-data text-[10px] text-muted-foreground">
                                {new Date(att.createdAt).toLocaleString("en-US", {
                                  month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                                })}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between p-3 border-t border-border/30">
                      <span className="text-xs text-muted-foreground">
                        {filtered.length} results · Page {page + 1} of {totalPages || 1}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={page === 0}
                          onClick={() => setPage(page - 1)}
                        >
                          Prev
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={page >= totalPages - 1}
                          onClick={() => setPage(page + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* CQS Radar */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Composite Quality Score
                </h3>
                <CQSRadar />
              </div>

              {/* Trace Flow */}
              <div
                className="glass-card rounded-xl p-6 relative overflow-hidden"
                style={{
                  backgroundImage: `url(${DASHBOARD_BG})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
                <div className="relative z-10">
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    Decision Trace Pipeline
                  </h3>
                  <TraceFlow compact />
                </div>
              </div>

              {/* Active Guardrails Summary */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-violet-400" />
                  Active Guardrails
                </h3>
                <div className="space-y-3">
                  {guardrailRules.slice(0, 4).map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between">
                      <code className="mono-data text-[10px] text-muted-foreground">{rule.id}</code>
                      <span className="mono-data text-[10px] text-primary">
                        v{rule.version} · {rule.triggerCount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
