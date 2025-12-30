"use client";

import { useEffect, useState, useCallback } from "react";
import MainDashboardStats from "./MainDashboardStats";
import GasOverviewPanel from "../Gas/GasOverviewPanel";
import ERITrendChart from "../Charts/ERITrendChart";
import { TimeRangeSelector } from "../Charts/TimeRangeSelector";
import SingleGasTrendChart from "../Charts/SingleGasTrendChart";

type Range = "7d" | "30d";

export default function DashboardMain({
  registerRefresh,
}: {
  registerRefresh?: (fn: () => void) => void;
}) {
  const [data, setData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [range, setRange] = useState<Range>("7d");
  const [factoryId, setFactoryId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ================= AUTH ================= */
  useEffect(() => {
    fetch("/api/auth/me", {
      credentials: "include",
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((j) => {
        if (j.loggedIn && j.user?._id) {
          setFactoryId(j.user._id);
        }
      });
  }, []);

  /* ================= LOAD DASHBOARD ================= */
  const loadDashboard = useCallback(async () => {
    if (!factoryId) return;
    const res = await fetch(
      `/api/factory/dashboard?factoryId=${factoryId}`,
      { cache: "no-store" }
    );
    const json = await res.json();
    setData(json);
  }, [factoryId]);

  /* ================= LOAD HISTORY ================= */
  const loadHistory = useCallback(async () => {
    if (!factoryId) return;

    const res = await fetch(
      `/api/factory/history?factoryId=${factoryId}&range=${range}`,
      { cache: "no-store" }
    );
    const json = await res.json();

    const mapped = json.data
      .sort(
        (a: any, b: any) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      )
      .map((r: any) => ({
        date: r.date,
        eri: r.eri,
        category: r.category,
        so2: r.gases?.so2 ?? null,
        no2: r.gases?.no2 ?? null,
        co: r.gases?.co ?? null,
        pm25: r.gases?.pm25 ?? null,
      }));

    setHistory(mapped);
  }, [factoryId, range]);

  const loadOnly = useCallback(async () => {
    await loadDashboard();
    await loadHistory();
  }, [loadDashboard, loadHistory]);

  const refreshWithIngest = useCallback(async () => {
    if (!factoryId) return;

    setRefreshing(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_FASTAPI_URL}/satellite/daily-ingest`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ factoryId }),
        }
      );

      if (!res.ok) throw new Error("Daily ingest failed");

      await loadOnly();
    } catch (err) {
      setError("Failed to refresh data");
    } finally {
      setTimeout(() => setRefreshing(false), 400);
    }
  }, [factoryId, loadOnly]);

  useEffect(() => {
    if (!factoryId) return;
    loadOnly();
  }, [factoryId, range, loadOnly]);

  useEffect(() => {
    registerRefresh?.(refreshWithIngest);
  }, [registerRefresh, refreshWithIngest]);

  /* ================= UI ================= */
  if (!data) return <div className="text-gray-500">Loading dashboard…</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  const e = data.emissions || {};
  const emissionLoadKg = data?.emissionEstimate?.dailyKgEstimate ?? null;

  const confidencePercent =
    data?.coverage?.coverage_percent ??
    Math.min(100, Math.round((history.length / 7) * 100));

  const confidenceLevel =
    confidencePercent >= 80
      ? "high"
      : confidencePercent >= 50
      ? "medium"
      : "low";

  return (
    <div className={`space-y-4 sm:space-y-6 ${refreshing ? "opacity-60" : ""}`}>
      
      {/* ===== TOP STATS ===== */}
      <MainDashboardStats
        eri={data.eri?.value ?? 0}
        satellite="Daily Pass"
        emissionLoad={emissionLoadKg}
        confidencePercent={confidencePercent}
        confidenceLevel={confidenceLevel}
      />

      {/* ===== ERI + GAS OVERVIEW ===== */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl sm:rounded-2xl border border-white/10 bg-[#0b1220] p-3 sm:p-5">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-semibold">
                Environmental Risk Trend
              </h3>
              <p className="text-xs sm:text-sm text-gray-400">
                AI-smoothed ERI ({range})
              </p>
            </div>
            <TimeRangeSelector value={range} onChange={setRange} />
          </div>

          <ERITrendChart data={history} />
        </div>

        <GasOverviewPanel gases={e} />
      </div>

      {/* ===== SINGLE GAS CHARTS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <SingleGasTrendChart
          data={history}
          gas="no2"
          label="NO₂"
          color="#38bdf8"
          unit="ppm"
        />
        <SingleGasTrendChart
          data={history}
          gas="so2"
          label="SO₂"
          color="#22c55e"
          unit="ppm"
        />
        <SingleGasTrendChart
          data={history}
          gas="co"
          label="CO"
          color="#facc15"
          unit="ppm"
        />
        <SingleGasTrendChart
          data={history}
          gas="pm25"
          label="PM2.5"
          color="#ef4444"
          unit="µg/m³"
        />
      </div>
    </div>
  );
}
