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
    <div className="mb-6 flex items-center justify-between gap-3">
      {/* LEFT */}
      <div>
        <h1 className="text-xl font-semibold md:text-2xl">
          Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Monitor factory emissions in real-time
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* ================= DESKTOP SEARCH ================= */}
        <div className="hidden lg:flex items-center gap-2 rounded-lg border border-white/10 bg-[#0b1220] px-3 py-2">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-44 bg-transparent text-sm outline-none"
          />
        </div>

        {/* ================= MOBILE / TABLET SEARCH ================= */}
        <div className="lg:hidden">
          {!mobileSearchOpen ? (
            <button
              onClick={() => setMobileSearchOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#0b1220] hover:bg-[#1F2A3A]"
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

        {/* ================= DATE ================= */}
        {!mobileSearchOpen && (
          <div className="sm:flex items-center gap-2 rounded-lg border border-white/10 bg-[#0b1220] px-3 py-3 text-sm">
            <Calendar className="hidden sm:block h-4 w-4 text-gray-400" />
            {today}
          </div>
        )}

        {/* ================= REFRESH ================= */}
        {!mobileSearchOpen && (
          <button
            onClick={handleRefresh}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#0b1220] hover:bg-[#1F2A3A] cursor-pointer"
          >
            <RefreshCcw
              className={`h-5 w-5 ${spinning ? "animate-spin" : ""}`}
            />
          </button>
        )}

        {/* ================= ALERT ================= */}
        {!mobileSearchOpen && <AlertBell />}
      </div>
    </div>
  );
}
