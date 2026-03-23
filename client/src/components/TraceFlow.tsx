/*
 * Quantum Shield — Trace Flow Visualization
 * Animated decision pipeline: Input → Analysis → Scoring → Approval → Execution → Attestation
 * Based on ExecAI Trust trace_engine.ts architecture
 */
import { motion } from "framer-motion";
import { traceNodes } from "@/lib/data";
import { ArrowRight } from "lucide-react";

const nodeColors: Record<string, string> = {
  input: "oklch(0.75 0.15 195)",
  context: "oklch(0.65 0.2 290)",
  policy: "oklch(0.75 0.15 195)",
  score: "oklch(0.8 0.16 75)",
  approval: "oklch(0.65 0.2 290)",
  execution: "oklch(0.72 0.17 155)",
};

export default function TraceFlow({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${compact ? "flex-wrap" : "justify-between"} w-full`}>
      {traceNodes.map((node, i) => (
        <motion.div
          key={node.id}
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.12, duration: 0.4 }}
        >
          <div
            className="flex flex-col items-center gap-1.5"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center border-2 relative"
              style={{
                borderColor: nodeColors[node.type],
                boxShadow: `0 0 16px ${nodeColors[node.type]}40`,
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: nodeColors[node.type] }}
              />
              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-full border"
                style={{ borderColor: nodeColors[node.type] }}
                animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">
              {node.label}
            </span>
          </div>
          {i < traceNodes.length - 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.12 + 0.2 }}
            >
              <ArrowRight className="w-4 h-4 text-muted-foreground/40 mb-5" />
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
