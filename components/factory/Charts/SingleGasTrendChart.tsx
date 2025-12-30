"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { gasToScore } from "@/utils/gasScore";

interface Props {
  data: any[];
  gas: "no2" | "so2" | "co" | "pm25";
  label: string;
  color: string;
  unit: string;
}

export default function GasTrendChart({
  data,
  gas,
  label,
  color,
  unit,
}: Props) {
  // 🔥 normalize values using SAME gasToScore
  const chartData = data.map((d) => ({
    date: d.date,
    value: gasToScore(d[gas], gas),
    raw: d[gas],
  }));

  return (
    <div
      className="
        rounded-xl sm:rounded-2xl
        border border-white/10
        bg-gradient-to-br from-[#0b1220] to-[#05080f]
        p-3 sm:p-4 lg:p-5
      "
    >
      {/* ===== HEADER ===== */}
      <div className="mb-2 sm:mb-3">
        <h3 className="text-xs sm:text-sm font-semibold text-white">
          {label} Trend
        </h3>
        <p className="text-[10px] sm:text-xs text-gray-400">
          AI-normalized satellite concentration
        </p>
      </div>

      {/* ===== CHART ===== */}
      <div className="h-[180px] sm:h-[220px] md:h-[240px] lg:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`grad-${gas}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              interval="preserveStartEnd"
              tickMargin={6}
            />

            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              width={36}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0].payload;

                return (
                  <div
                    className="
                      max-w-[85vw] sm:max-w-xs
                      rounded-lg sm:rounded-xl
                      border border-white/10
                      bg-[#0b1220]
                      p-2 sm:p-3
                      text-[11px] sm:text-xs
                      text-white
                    "
                  >
                    <p className="mb-1 font-semibold truncate">{label}</p>
                    <p className="text-cyan-400">
                      Index: {p.value ?? "N/A"}
                    </p>
                    <p className="text-gray-400">
                      Raw:{" "}
                      {p.raw !== null
                        ? `${Math.abs(p.raw).toFixed(6)} ${unit}`
                        : "N/A"}
                    </p>
                    <p className="mt-1 text-gray-500">
                      AI-normalized via satellite signal
                    </p>
                  </div>
                );
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#grad-${gas})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
