import { ReactNode } from "react";

interface Props {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ReactNode;
  glow?: "green" | "blue" | "yellow" | "red";
}

const glowBgMap: Record<string, string> = {
  green: "from-emerald-400/40",
  blue: "from-sky-400/40",
  yellow: "from-yellow-400/40",
  red: "from-red-500/40",
};

const glowBorderMap: Record<string, string> = {
  green: "border-emerald-500/30",
  blue: "border-sky-500/30",
  yellow: "border-yellow-400/30",
  red: "border-red-500/30",
};

export default function DashboardStatCard({
  title,
  value,
  subtitle,
  icon,
  glow = "green",
}: Props) {
  return (
    <div
      className={`relative rounded-2xl border bg-gradient-to-br
      from-[#0b1220] to-[#05080f]
      p-4 sm:p-5 lg:p-6
      overflow-hidden
      ${glowBorderMap[glow]}`}
    >
      {/* 🔥 GLOW LAYER */}
      <div
        className={`absolute -inset-1 rounded-2xl
        bg-gradient-to-r ${glowBgMap[glow]} to-transparent
        blur-2xl opacity-60 -z-10`}
      />

      {/* ✨ INNER GLOSS */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

      {/* ===== CONTENT ===== */}
      <div className="relative z-10 space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div
            className="
              flex items-center justify-center
              h-9 w-9 sm:h-10 sm:w-10
              rounded-lg bg-white/5
              border border-white/10
            "
          >
            {icon}
          </div>
        </div>

        <div>
          <p className="text-[10px] sm:text-xs tracking-widest text-gray-400 uppercase">
            {title}
          </p>

          <h2 className="mt-1 text-base sm:text-lg font-semibold text-white break-words">
            {value}
          </h2>

          <p className="text-xs sm:text-sm text-gray-400">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
