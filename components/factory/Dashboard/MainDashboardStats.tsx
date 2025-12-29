// components/MainDashboardStats.tsx
"use client";

import {
  Satellite,
  Activity,
  Gauge,
  Brain,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DashboardStatCard from "./DashboardStatCard";

interface Props {
  eri: number;
  satellite: string;
  emissionLoad: number | null;
  confidencePercent: number;
  confidenceLevel: "high" | "medium" | "low";
}

export default function MainDashboardStats({
  eri,
  satellite,
  emissionLoad,
  confidencePercent,
  confidenceLevel,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0); // 0 = first pair, 1 = second pair

  /* ---------- AUTO SCROLL (MOBILE ONLY) ---------- */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (window.innerWidth >= 768) return; // desktop = no auto scroll

    let pairIndex = 0;

    // ✅ ensure FIRST cards visible on load
    el.scrollTo({ left: 0 });

    const interval = setInterval(() => {
      pairIndex = pairIndex === 0 ? 1 : 0;
      setActiveIndex(pairIndex);

      const cardIndex = pairIndex * 2; // 0 or 2
      const card = el.children[cardIndex] as HTMLElement;

      if (!card) return;

      el.scrollTo({
        left: card.offsetLeft,
        behavior: "smooth",
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  /* ---------- SYNC DOTS ON MANUAL SCROLL ---------- */
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const cardWidth = el.children[0]?.clientWidth || 1;
    const index = Math.round(el.scrollLeft / cardWidth);

    setActiveIndex(index >= 2 ? 1 : 0);
  };

  return (
    <>
      {/* ================= CARDS ================= */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="
          -mx-0
          flex gap-4 overflow-x-auto px-6
          snap-x snap-mandatory
          scrollbar-hide
          md:mx-0 md:grid md:grid-cols-2 xl:grid-cols-4
          md:gap-6 md:overflow-visible md:px-0
        "
      >
        <div className="min-w-[48%] snap-start md:min-w-0">
          <DashboardStatCard
            title="Environmental Risk Index"
            value={eri.toFixed(2)}
            subtitle="Overall Risk Level"
            glow="green"
            icon={<Gauge className="h-5 w-5 text-emerald-400" />}
          />
        </div>

        <div className="min-w-[48%] snap-start md:min-w-0">
          <DashboardStatCard
            title="Daily Emission Load"
            value={
              typeof emissionLoad === "number" && emissionLoad > 0
                ? `${emissionLoad.toFixed(2)} kg/day`
                : "Satellite data gap"
            }
            subtitle="Today"
            glow="yellow"
            icon={<Activity className="h-5 w-5 text-yellow-400" />}
          />
        </div>

        <div className="min-w-[48%] snap-start md:min-w-0">
          <DashboardStatCard
            title="Satellite Coverage"
            value={satellite}
            subtitle="Monitoring Active"
            glow="blue"
            icon={<Satellite className="h-5 w-5 text-sky-400" />}
          />
        </div>

        <div className="min-w-[48%] snap-start md:min-w-0">
          <DashboardStatCard
            title="AI Confidence"
            value={`${confidencePercent}%`}
            subtitle={
              confidenceLevel === "high"
                ? "Stable satellite coverage"
                : confidenceLevel === "medium"
                ? "Partial data variability"
                : "Low data confidence"
            }
            glow={
              confidenceLevel === "high"
                ? "green"
                : confidenceLevel === "medium"
                ? "yellow"
                : "red"
            }
            icon={<Brain className="h-5 w-5 text-cyan-400" />}
          />
        </div>
      </div>

      {/* ================= DOTS (MOBILE ONLY) ================= */}
      <div className="mt-3 flex justify-center gap-2 md:hidden">
        {[0, 1].map((i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full transition ${
              activeIndex === i ? "bg-blue-400" : "bg-white/20"
            }`}
          />
        ))}
      </div>
    </>
  );
}
