"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ERITooltip from "../Tooltip/ERITooltip";

export default function ERITrendChart({ data }: { data: any[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0b1220] to-[#05080f] p-5">
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />

            {/* ✅ CUSTOM TOOLTIP */}
            <Tooltip content={<ERITooltip />} />

            <Line
              type="monotone"
              dataKey="eri"
              stroke="#38bdf8"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
