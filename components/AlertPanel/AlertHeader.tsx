"use client";

import { Search, Calendar, RefreshCcw, X } from "lucide-react";
import { useMemo, useState } from "react";
import AlertBell from "@/components/Alert/AlertBell";

export default function AlertHeader({
  search,
  onSearchChange,
  onRefresh,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  onRefresh: () => Promise<void> | void;
}) {
  const [spinning, setSpinning] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const today = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, []);

  async function handleRefresh() {
    setSpinning(true);
    await onRefresh();
    setTimeout(() => setSpinning(false), 800);
  }

  return (
    <div className="mb-6 flex items-center justify-between gap-3">
      {/* LEFT */}
      <div>
        <h1 className="text-xl font-semibold md:text-2xl text-white">
          Alerts
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          System & government notifications
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* ================= DESKTOP SEARCH ================= */}
        <div className="hidden lg:flex items-center gap-2 rounded-lg border border-white/10 bg-[#0b1220] px-3 py-2">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search alerts..."
            className="w-48 bg-transparent text-sm text-white outline-none placeholder-gray-500"
          />
        </div>

        {/* ================= MOBILE / TABLET SEARCH ================= */}
        <div className="lg:hidden">
          {!mobileSearchOpen ? (
            <button
              onClick={() => setMobileSearchOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#0b1220] hover:bg-[#1F2A3A]"
            >
              <Search className="h-5 w-5 text-white" />
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                autoFocus
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search alerts..."
                className="w-40 bg-transparent text-sm text-white outline-none placeholder-gray-500"
              />
              <button
                onClick={() => {
                  setMobileSearchOpen(false);
                  onSearchChange("");
                }}
              >
                <X className="h-4 w-4 text-gray-400 hover:text-white" />
              </button>
            </div>
          )}
        </div>

        {/* ================= DATE ================= */}
        {!mobileSearchOpen && (
          <div className="hidden sm:flex items-center gap-2 rounded-lg border border-white/10 bg-[#0b1220] px-3 py-2 text-sm text-white">
            <Calendar className="h-4 w-4 text-gray-400" />
            {today}
          </div>
        )}

        {/* ================= REFRESH ================= */}
        {!mobileSearchOpen && (
          <button
            onClick={handleRefresh}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#0b1220] hover:bg-[#1F2A3A]"
          >
            <RefreshCcw
              className={`h-5 w-5 text-white ${
                spinning ? "animate-spin" : ""
              }`}
            />
          </button>
        )}

        {/* ================= ALERT BELL ================= */}
        {!mobileSearchOpen && <AlertBell />}
      </div>
    </div>
  );
}
