"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  BarChart3,
  AlertCircle,
} from "lucide-react";

type Range = "7d" | "30d";

type RecordItem = {
    date: string;
    eri?: number;
    category?: string;
    gases?: {
    no2?: number | null;
    so2?: number | null;
    co?: number | null;
    pm25?: number | null;
    };
    emissionEstimate?: {
    dailyKgEstimate?: number | null;
  };
};

type HistoryResponse = {
  data?: RecordItem[];
  eri_smooth?: number[];
};

const pollutants = [
  { key: "no2", label: "NO₂", color: "#38bdf8", limit: 0.00004 },
  { key: "so2", label: "SO₂", color: "#22c55e", limit: 0.00002 },
  { key: "co", label: "CO", color: "#facc15", limit: 0.05 },
  { key: "pm25", label: "PM2.5", color: "#f87171", limit: 60 },
] as const;

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-white/10 bg-[#0b1220] p-4 sm:p-5">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-white sm:text-base">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function MetricCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-[#0b1220] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-gray-400 sm:text-sm">{title}</p>
        <span className="text-blue-400">{icon}</span>
      </div>
      <p className="mt-4 break-words text-2xl font-semibold text-white">
        {value}
      </p>
      <p className="mt-1 text-xs text-gray-500">{description}</p>
    </div>
  );
}

function TrendChart({ records }: { records: RecordItem[] }) {
  const points = records.filter(
    (record) => typeof record.eri === "number" && Number.isFinite(record.eri),
  );

  if (points.length === 0) {
    return (
      <div className="flex min-h-52 flex-col items-center justify-center text-center">
        <BarChart3 size={30} className="mb-3 text-gray-600" />
        <p className="text-sm text-gray-300">No ERI history available</p>
        <p className="mt-1 text-xs text-gray-500">
          Available historical readings will appear here.
        </p>
      </div>
    );
  }

  const width = 700;
  const height = 245;
  const left = 38;
  const right = 16;
  const top = 16;
  const bottom = 30;
  const chartHeight = height - top - bottom;
  const chartWidth = width - left - right;

  const coordinates = points.map((record, index) => ({
    x:
      points.length === 1
        ? width / 2
        : left + (index / (points.length - 1)) * chartWidth,
    y: top + (1 - Math.max(0, Math.min(100, record.eri!)) / 100) * chartHeight,
    record,
  }));

  const line = coordinates.map((point) => `${point.x},${point.y}`).join(" ");

  const area = `${left},${height - bottom} ${line} ${
    width - right
  },${height - bottom}`;

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Environmental Risk Index historical trend"
      >
        {[0, 25, 50, 75, 100].map((value) => {
          const y = top + (1 - value / 100) * chartHeight;
          return (
            <g key={value}>
              <line
                x1={left}
                x2={width - right}
                y1={y}
                y2={y}
                stroke="#293548"
                strokeDasharray="4 5"
              />
              <text x="2" y={y + 4} fill="#8995a7" fontSize="11">
                {value}
              </text>
            </g>
          );
        })}

        {coordinates.length > 1 && (
          <polygon points={area} fill="#60a5fa" fillOpacity="0.09" />
        )}

        {coordinates.length > 1 && (
          <polyline
            points={line}
            fill="none"
            stroke="#60a5fa"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {coordinates.map((point, index) => (
          <g key={`${point.record.date}-${index}`}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#60a5fa"
              stroke="#0b1220"
              strokeWidth="2"
            />
            <title>
              {point.record.date}: ERI {point.record.eri}
            </title>
          </g>
        ))}

        <text x={left} y={height - 7} fill="#8995a7" fontSize="11">
          {points[0].date}
        </text>
        <text
          x={width - right}
          y={height - 7}
          textAnchor="end"
          fill="#8995a7"
          fontSize="11"
        >
          {points[points.length - 1].date}
        </text>
      </svg>
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
        <span>{points.length} available readings</span>
        <span>·</span>
        <span>ERI scale: 0–100</span>
      </div>
    </div>
  );
}

export default function AnalyticsMain() {
  const [factoryId, setFactoryId] = useState<string | null>(null);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [range, setRange] = useState<Range>("7d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/auth/me", {
      credentials: "include",
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Could not verify your login.");
        }
        return response.json();
      })
      .then((json) => {
        if (cancelled) return;

        if (json.loggedIn && json.user?._id) {
          setFactoryId(String(json.user._id));
        } else {
          setError("Please log in again to view analytics.");
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message || "Unable to load your account.");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const loadHistory = useCallback(async () => {
    if (!factoryId) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/factory/history?factoryId=${encodeURIComponent(
          factoryId,
        )}&range=${range}`,
        {
          credentials: "include",
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(`History request failed (${response.status}).`);
      }

      const json = (await response.json()) as HistoryResponse;

      const sortedRecords = (json.data ?? [])
        .filter((record) => record.date)
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

      setRecords(sortedRecords);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load analytics history.",
      );
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [factoryId, range]);

  useEffect(() => {
    if (factoryId) {
      void loadHistory();
    }
  }, [factoryId, range, reloadKey, loadHistory]);

  const latest = records[records.length - 1];
  const previous = records[records.length - 2];

  const change =
    typeof latest?.eri === "number" && typeof previous?.eri === "number"
      ? Number((latest.eri - previous.eri).toFixed(2))
      : null;

  const emission = latest?.emissionEstimate?.dailyKgEstimate;

  return (
    <div className="min-w-0 space-y-5 pb-8 sm:space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-blue-400">
            Environmental Intelligence
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
            Analytics Overview
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Historical environmental risk, pollutant readings and emission
            estimates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            aria-label="History date range"
            value={range}
            onChange={(event) => setRange(event.target.value as Range)}
            className="rounded-lg border border-white/10 bg-[#0b1220] px-3 py-2.5 text-sm text-white outline-none focus:border-blue-400"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>

          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0b1220] px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </header>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-200">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="font-medium">Unable to load analytics</p>
            <p className="mt-1 break-words text-amber-100/70">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="ml-auto shrink-0 underline underline-offset-4"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Current ERI"
          value={
            loading
              ? "Loading…"
              : typeof latest?.eri === "number"
                ? latest.eri.toFixed(2)
                : "—"
          }
          description={latest?.category ?? "Environmental Risk Index"}
          icon={<Activity size={19} />}
        />

        <MetricCard
          title="Reading change"
          value={change === null ? "—" : `${change > 0 ? "+" : ""}${change}`}
          description="Compared with previous available record"
          icon={
            change === null ? (
              <Minus size={19} />
            ) : change > 0 ? (
              <TrendingUp size={19} />
            ) : change < 0 ? (
              <TrendingDown size={19} />
            ) : (
              <Minus size={19} />
            )
          }
        />

        <MetricCard
          title="Daily emission estimate"
          value={typeof emission === "number" ? emission.toLocaleString() : "—"}
          description="Estimated kg/day"
          icon={<BarChart3 size={19} />}
        />

        <MetricCard
          title="Records available"
          value={loading ? "…" : String(records.length)}
          description={`For the selected ${range === "7d" ? "7-day" : "30-day"} period`}
          icon={<Activity size={19} />}
        />
      </div>

      <Panel
        title="Environmental Risk Index · ERI"
        subtitle="Historical risk trend · Scale 0–100"
      >
        {loading ? (
          <div className="flex min-h-52 items-center justify-center text-sm text-gray-500">
            Loading historical readings…
          </div>
        ) : (
          <TrendChart records={records} />
        )}
      </Panel>

      <Panel
        title="Latest pollutant readings"
        subtitle="Most recent available historical record"
      >
        {!latest ? (
          <p className="py-8 text-center text-sm text-gray-500">
            {loading
              ? "Loading pollutant readings…"
              : "No pollutant data is available for this period."}
          </p>
        ) : (
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {pollutants.map((pollutant) => {
              const value = latest.gases?.[pollutant.key];
              const valid =
                typeof value === "number" &&
                Number.isFinite(value) &&
                value > 0;

              const barWidth = valid
                ? Math.min(100, Math.max(3, (value / pollutant.limit) * 50))
                : 0;

              return (
                <div key={pollutant.key} className="min-w-0">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm text-gray-300">
                      {pollutant.label}
                    </span>
                    <span className="break-all text-right text-sm font-medium text-white">
                      {valid ? value.toExponential(3) : "No data"}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: pollutant.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <p className="mt-5 text-xs leading-5 text-gray-500">
          Values are displayed as stored in the backend. Satellite-derived
          estimates are not direct factory-stack measurements; missing readings
          are shown as unavailable.
        </p>
      </Panel>

      <Panel
        title="Historical readings"
        subtitle="Daily records returned by the existing history API"
      >
        {loading ? (
          <p className="text-sm text-gray-500">Loading records…</p>
        ) : records.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            No records found for this date range.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs text-gray-500">
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 pr-4 font-medium">ERI</th>
                  <th className="pb-3 pr-4 font-medium">Category</th>
                  <th className="pb-3 font-medium">Emission estimate</th>
                </tr>
              </thead>
              <tbody>
                {[...records].reverse().map((record, index) => (
                  <tr
                    key={`${record.date}-${index}`}
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className="py-3 pr-4 text-gray-300">{record.date}</td>
                    <td className="py-3 pr-4 font-medium text-white">
                      {typeof record.eri === "number"
                        ? record.eri.toFixed(2)
                        : "—"}
                    </td>
                    <td className="py-3 pr-4 text-gray-400">
                      {record.category ?? "—"}
                    </td>
                    <td className="py-3 text-gray-400">
                      {typeof record.emissionEstimate?.dailyKgEstimate ===
                      "number"
                        ? `${record.emissionEstimate.dailyKgEstimate.toLocaleString()} kg/day`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
