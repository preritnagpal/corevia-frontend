"use client";

import GasGauge from "./GasGauge";
import { gasToScore } from "@/utils/gasScore";

interface Props {
  gases: {
    so2?: number | null;
    no2?: number | null;
    co?: number | null;
    pm25?: number | null;
    thermal?: number | null;
  };
}

export default function GasOverviewPanel({ gases }: Props) {
  // 🔥 AI-normalized scores (0–100)
  const so2Score = gasToScore(gases.so2 ?? null, "so2");
  const no2Score = gasToScore(gases.no2 ?? null, "no2");
  const coScore = gasToScore(gases.co ?? null, "co");
  const pm25Score = gasToScore(gases.pm25 ?? null, "pm25");

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#0b1220] to-[#05080f] p-5">
      <h3 className="mb-0.5 text-md font-semibold text-white">
        Gases Overview
      </h3>

      <p className="mb-4 text-sm text-gray-400">
        AI-normalized impact derived from satellite data
      </p>

      <div className="grid grid-cols-2 gap-6">
        {/* SO₂ */}
        <GasGauge
          label="SO₂"
          value={so2Score}
          rawValue={gases.so2}
          unit="ppm"
          color="#22c55e"
          source="Sentinel-5P"
        />

        {/* NO₂ */}
        <GasGauge
          label="NO₂"
          value={no2Score}
          rawValue={gases.no2}
          unit="ppm"
          color="#eab308"
          source="Sentinel-5P"
        />

        {/* CO */}
        <GasGauge
          label="CO"
          value={coScore}
          rawValue={gases.co}
          unit="ppm"
          color="#eab308"
          source="Sentinel-5P"
        />

        {/* PM2.5 */}
        <GasGauge
          label="PM2.5"
          value={pm25Score}
          rawValue={gases.pm25}
          unit="µg/m³"
          color="#eab308"
          source="MODIS / MAIAC"
        />
      </div>
    </div>
  );
}
