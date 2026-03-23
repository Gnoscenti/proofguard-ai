/*
 * Quantum Shield — CQS Radar Visualization
 * Radial gauge showing IMDA pillar scores + composite CQS
 */
import { motion } from "framer-motion";
import { imdaPillars, calculateCQS } from "@/lib/data";

export default function CQSRadar() {
  const cqs = calculateCQS(imdaPillars);
  const cx = 150;
  const cy = 150;
  const maxR = 120;

  // Calculate polygon points for radar
  const points = imdaPillars.map((p, i) => {
    const angle = (Math.PI * 2 * i) / imdaPillars.length - Math.PI / 2;
    const r = (p.score / 100) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  const polygonPath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  // Grid rings
  const rings = [25, 50, 75, 100];

  return (
    <div className="relative">
      <svg viewBox="0 0 300 300" className="w-full max-w-[320px] mx-auto">
        {/* Grid rings */}
        {rings.map((pct) => (
          <circle
            key={pct}
            cx={cx}
            cy={cy}
            r={(pct / 100) * maxR}
            fill="none"
            stroke="oklch(0.3 0.02 260)"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
        ))}

        {/* Axis lines */}
        {imdaPillars.map((_, i) => {
          const angle = (Math.PI * 2 * i) / imdaPillars.length - Math.PI / 2;
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + maxR * Math.cos(angle)}
              y2={cy + maxR * Math.sin(angle)}
              stroke="oklch(0.3 0.02 260)"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Data polygon */}
        <motion.path
          d={polygonPath}
          fill="oklch(0.75 0.15 195 / 15%)"
          stroke="oklch(0.75 0.15 195)"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Data points */}
        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="oklch(0.75 0.15 195)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.15 }}
          />
        ))}

        {/* Pillar labels */}
        {imdaPillars.map((pillar, i) => {
          const angle = (Math.PI * 2 * i) / imdaPillars.length - Math.PI / 2;
          const labelR = maxR + 28;
          const lx = cx + labelR * Math.cos(angle);
          const ly = cy + labelR * Math.sin(angle);
          return (
            <text
              key={i}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-[9px] font-medium"
            >
              {pillar.name}
            </text>
          );
        })}

        {/* Center CQS score */}
        <motion.text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-primary font-bold text-[32px]"
          style={{ filter: "drop-shadow(0 0 12px oklch(0.75 0.15 195 / 50%))" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {cqs}
        </motion.text>
        <text
          x={cx}
          y={cy + 16}
          textAnchor="middle"
          className="fill-muted-foreground text-[10px] font-medium tracking-widest uppercase"
        >
          CQS Score
        </text>
      </svg>
    </div>
  );
}
