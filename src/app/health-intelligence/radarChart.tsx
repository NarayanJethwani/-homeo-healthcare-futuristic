import React from "react";
import { SystemScores } from "./types";

interface RadarChartProps {
  scores: SystemScores;
  theme: "light" | "dark";
}

export default function RadarChart({ scores, theme }: RadarChartProps) {
  const isDark = theme === "dark";
  const size = 300;
  const padding = 50;
  const center = size / 2;
  const maxRadius = size / 2 - padding;

  const axes: Array<{ key: keyof SystemScores; label: string }> = [
    { key: "endocrine", label: "Endocrine" },
    { key: "cardiovascular", label: "Cardio" },
    { key: "digestive", label: "Digestive" },
    { key: "respiratory", label: "Respiratory" },
    { key: "skin", label: "Skin" },
    { key: "neurological", label: "Neuro" },
    { key: "immune", label: "Immune" },
    { key: "mentalHealth", label: "Mental" }
  ];

  const totalAxes = axes.length;

  // Helper to compute coordinates of a point on the radar
  const getCoordinates = (index: number, value: number) => {
    // Subtract Math.PI / 2 to start at the top (12 o'clock)
    const angle = (index * 2 * Math.PI) / totalAxes - Math.PI / 2;
    const r = (value / 100) * maxRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // 1. Grid Lines (Concentric Octagons)
  const gridLevels = [25, 50, 75, 100];
  const gridPaths = gridLevels.map(level => {
    const points = [];
    for (let i = 0; i < totalAxes; i++) {
      const { x, y } = getCoordinates(i, level);
      points.push(`${x},${y}`);
    }
    return points.join(" ");
  });

  // 2. Axis Lines
  const axisLines = axes.map((_, i) => {
    const end = getCoordinates(i, 100);
    return { x1: center, y1: center, x2: end.x, y2: end.y };
  });

  // 3. User Data Polygon
  const polygonPoints = axes.map((axis, i) => {
    const val = scores[axis.key] || 90;
    const { x, y } = getCoordinates(i, val);
    return `${x},${y}`;
  }).join(" ");

  // 4. Labels placements
  const labels = axes.map((axis, i) => {
    const angle = (i * 2 * Math.PI) / totalAxes - Math.PI / 2;
    const offset = 22; // Distance of text from 100% mark
    const r = maxRadius + offset;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);

    // Minor adjustment for text-anchor based on angle position
    let textAnchor: "start" | "end" | "middle" = "middle";
    if (Math.cos(angle) > 0.1) textAnchor = "start";
    else if (Math.cos(angle) < -0.1) textAnchor = "end";

    // Minor vertical adjustment
    let dy = "0.35em";
    if (Math.sin(angle) > 0.8) dy = "0.9em";
    else if (Math.sin(angle) < -0.8) dy = "-0.2em";

    const scoreVal = scores[axis.key] || 90;

    return { label: axis.label, scoreVal, x, y, textAnchor, dy };
  });

  // 5. Bullet dots
  const dots = axes.map((axis, i) => {
    const val = scores[axis.key] || 90;
    return getCoordinates(i, val);
  });

  // Theme Styles
  const gridStroke = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.08)";
  const labelColor = isDark ? "#94a3b8" : "#475569";
  const axisStroke = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(15, 23, 42, 0.05)";

  return (
    <div className="w-full flex items-center justify-center p-2">
      <svg className="w-full max-w-[260px] h-auto select-none" viewBox={`0 0 ${size} ${size}`}>
        
        {/* Concentric octagonal grids */}
        {gridPaths.map((path, idx) => (
          <polygon
            key={idx}
            points={path}
            fill="none"
            stroke={gridStroke}
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {axisLines.map((line, idx) => (
          <line
            key={idx}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={axisStroke}
            strokeWidth="1"
          />
        ))}

        {/* Level indicators labels */}
        {gridLevels.map((lvl, idx) => {
          const { x, y } = getCoordinates(0, lvl);
          return (
            <text
              key={idx}
              x={x + 5}
              y={y + 10}
              className="fill-slate-400 font-mono text-[8px] font-bold"
            >
              {lvl}%
            </text>
          );
        })}

        {/* Data polygon with gradient fill */}
        <polygon
          points={polygonPoints}
          fill="url(#radarGradient)"
          stroke="#10b981"
          strokeWidth="2"
          className="transition-all duration-500 ease-out"
        />

        {/* Bullet dots */}
        {dots.map((dot, idx) => (
          <circle
            key={idx}
            cx={dot.x}
            cy={dot.y}
            r="4.5"
            className="fill-emerald-500 stroke-white dark:stroke-slate-900 stroke-1.5 transition-all duration-500 ease-out"
          />
        ))}

        {/* Axis Labels */}
        {labels.map((lbl, idx) => (
          <g key={idx}>
            {/* System Name */}
            <text
              x={lbl.x}
              y={lbl.y - 4}
              textAnchor={lbl.textAnchor}
              dy={lbl.dy}
              fill={labelColor}
              className="text-[9px] font-bold uppercase tracking-wider font-sans"
            >
              {lbl.label}
            </text>
            {/* System Score */}
            <text
              x={lbl.x}
              y={lbl.y + 6}
              textAnchor={lbl.textAnchor}
              dy={lbl.dy}
              className="fill-emerald-500 font-mono text-[8.5px] font-black"
            >
              {lbl.scoreVal}%
            </text>
          </g>
        ))}

        {/* SVG Defs for Gradients */}
        <defs>
          <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.35" />
          </radialGradient>
        </defs>
        
      </svg>
    </div>
  );
}
