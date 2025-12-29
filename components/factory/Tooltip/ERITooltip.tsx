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
    <div className="rounded-lg border border-white/10 bg-black/80 p-3 text-xs">
      <p className="text-gray-300">{d.date}</p>

      <p className="mt-1 text-sky-400 font-medium">
        ERI: {d.eri.toFixed(2)}
      </p>

      {/* 🔥 RISK LABEL */}
      <p className={`mt-1 font-semibold ${riskColor}`}>
        Risk: {d.category ?? "Unknown"}
      </p>

      <div className="mt-2 space-y-1 text-gray-400">
        <p>SO₂: {d.so2 !== null ? Math.abs(d.so2).toFixed(6) : "N/A"}</p>
        <p>NO₂: {d.no2 !== null ? d.no2.toFixed(6) : "N/A"}</p>
        <p>CO: {d.co !== null ? d.co.toFixed(4) + " ppm" : "N/A"}</p>
        <p>
          PM2.5:{" "}
          {d.pm25 !== null ? d.pm25.toFixed(1) + " µg/m³" : "N/A"}
        </p>
      </div>
    </div>
  );
}
