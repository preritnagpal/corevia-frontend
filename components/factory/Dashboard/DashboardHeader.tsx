"use client";

import { Search, Calendar, RefreshCcw, X } from "lucide-react";
import { useMemo, useState } from "react";
import AlertBell from "@/components/Alert/AlertBell";

export default function DashboardHeader({
  onRefresh,
}: {
  onRefresh: () => Promise<void> | void;
}) {
  const [spinning, setSpinning] = useState(false);
  const [search, setSearch] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const today = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, []);

  const handleRefresh = async () => {
    setSpinning(true);
    await onRefresh();
    setTimeout(() => setSpinning(false), 800);
  };

  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      
      {/* ================= LEFT ================= */}
      <div className="min-w-0">
        <h1 className="text-lg font-semibold sm:text-xl md:text-2xl truncate">
          Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 truncate">
          Monitor factory emissions in real-time
        </p>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="flex flex-wrap items-center gap-2 md:flex-nowrap md:gap-3">
        
        {/* DESKTOP SEARCH */}
        <div className="hidden lg:flex items-center gap-2 rounded-lg border border-white/10 bg-[#0b1220] px-3 py-2">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-44 bg-transparent text-sm outline-none"
          />
        </div>

        {/* MOBILE SEARCH */}
        <div className="lg:hidden">
          {!mobileSearchOpen ? (
            <button
              onClick={() => setMobileSearchOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#0b1220]"
            >
              <Search className="h-5 w-5" />
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-40 bg-transparent text-sm outline-none"
              />
              <button
                onClick={() => {
                  setMobileSearchOpen(false);
                  setSearch("");
                }}
              >
                <X className="h-4 w-4 text-gray-400 hover:text-white" />
              </button>
            </div>
          )}
        </div>

        {/* DATE (ALWAYS VISIBLE) */}
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0b1220] px-3 py-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-400" />
          {today}
        </div>

        {/* REFRESH */}
        <button
          onClick={handleRefresh}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#0b1220]"
        >
          <RefreshCcw
            className={`h-5 w-5 ${spinning ? "animate-spin" : ""}`}
          />
        </button>

        {/* ALERT BELL (ALWAYS VISIBLE) */}
        <AlertBell />
      </div>
    </div>
  );
}
