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
    <div
      className="
        rounded-xl sm:rounded-2xl
        border border-white/10
        bg-gradient-to-br from-[#0b1220] to-[#05080f]
        p-3 sm:p-4 lg:p-5
      "
    >
      {/* RESPONSIVE HEIGHT */}
      <div className="h-[220px] sm:h-[260px] md:h-[300px] lg:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            
            {/* X AXIS */}
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              interval="preserveStartEnd"
              tickMargin={6}
            />

            {/* Y AXIS */}
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10 }}
              width={36}
            />

            {/* CUSTOM TOOLTIP */}
            <Tooltip content={<ERITooltip />} />

            {/* LINE */}
            <Line
              type="monotone"
              dataKey="eri"
              stroke="#38bdf8"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
