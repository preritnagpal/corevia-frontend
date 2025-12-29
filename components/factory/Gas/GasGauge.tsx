"use client";

interface GasGaugeProps {
  label: string;
  value: number | null;        // AI-normalized score (0–100)
  rawValue?: number | null;    // real satellite value
  unit: string;
  color: string;
  source?: string;
}

export default function GasGauge({
  label,
  value,
  rawValue,
  unit,
  color,
  source,
}: GasGaugeProps) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;

  // 🔒 HARD SAFETY (NaN / null / undefined proof)
  const safeValue: number | null =
    Number.isFinite(value) ? (value as number) : null;

  const percentage =
    safeValue !== null
      ? Math.min(100, Math.max(0, safeValue))
      : 0;

  const offset =
    circumference - (circumference * percentage) / 100;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* ===== RING ===== */}
      <div className="relative h-28 w-28">
        <svg className="h-full w-full -rotate-90">
          {/* Background ring */}
          <circle
            cx="56"
            cy="56"
            r={radius}
            stroke="#1f2937"
            strokeWidth="8"
            fill="none"
          />

          {/* Active ring */}
          <circle
            cx="56"
            cy="56"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{
  transition: "stroke-dashoffset 0.6s ease",
  opacity: safeValue !== null ? 1 : 0.35,
}}

          />
        </svg>

        {/* ===== CENTER CONTENT ===== */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {safeValue !== null ? (
            <>
              <span className="text-lg font-semibold text-white">
                {Math.round(safeValue)}
              </span>
              <span className="text-[10px] text-gray-400">
                Index
              </span>
            </>
          ) : (
            <>
              <span className="text-sm text-gray-500">
                No data
              </span>
              <span className="text-[10px] text-gray-600">
                Satellite gap
              </span>
            </>
          )}
        </div>
      </div>

      {/* ===== LABEL ===== */}
      <span className="text-xs text-gray-300">
        {label}
      </span>

      {/* ===== RAW SATELLITE VALUE ===== */}
      {rawValue !== undefined && (
        <span className="text-[10px] text-gray-500 text-center">
          Raw:{" "}
          {rawValue !== null && Number.isFinite(rawValue)
            ? `${Math.abs(rawValue).toFixed(
                unit === "µg/m³" ? 1 : 6
              )} ${unit}`
            : "N/A"}
          {source ? ` · ${source}` : ""}
        </span>
      )}
    </div>
  );
}
