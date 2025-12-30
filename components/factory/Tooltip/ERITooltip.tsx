export default function ERITooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;

  const d = payload[0].payload;

  const riskColor =
    d.category === "Low"
      ? "text-green-400"
      : d.category === "Moderate"
      ? "text-yellow-400"
      : d.category === "High"
      ? "text-red-400"
      : "text-gray-400";

  return (
    <div
      className="
        w-auto min-w-[180px] max-w-[90vw] sm:max-w-xs
        rounded-lg border border-white/10
        bg-black/80 backdrop-blur
        p-2 sm:p-3
        text-[11px] sm:text-xs
        shadow-lg
      "
    >
      {/* DATE */}
      <p className="truncate text-gray-300">
        {d.date}
      </p>

      {/* ERI VALUE */}
      <p className="mt-1 font-medium text-sky-400">
        ERI: {d.eri.toFixed(2)}
      </p>

      {/* RISK */}
      <p className={`mt-1 font-semibold ${riskColor}`}>
        Risk: {d.category ?? "Unknown"}
      </p>

      {/* POLLUTANTS */}
      <div className="mt-2 space-y-0.5 text-gray-400">
        <p className="flex justify-between gap-2">
          <span>SO₂</span>
          <span className="truncate">
            {d.so2 !== null ? Math.abs(d.so2).toFixed(6) : "N/A"}
          </span>
        </p>

        <p className="flex justify-between gap-2">
          <span>NO₂</span>
          <span className="truncate">
            {d.no2 !== null ? d.no2.toFixed(6) : "N/A"}
          </span>
        </p>

        <p className="flex justify-between gap-2">
          <span>CO</span>
          <span className="truncate">
            {d.co !== null ? d.co.toFixed(4) + " ppm" : "N/A"}
          </span>
        </p>

        <p className="flex justify-between gap-2">
          <span>PM2.5</span>
          <span className="truncate">
            {d.pm25 !== null ? d.pm25.toFixed(1) + " µg/m³" : "N/A"}
          </span>
        </p>
      </div>
    </div>
  );
}
