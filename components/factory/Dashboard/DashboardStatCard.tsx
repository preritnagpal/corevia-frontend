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
      className={`
        relative overflow-hidden
        rounded-xl sm:rounded-2xl
        border bg-gradient-to-br
        from-[#0b1220] to-[#05080f]
        p-3 sm:p-4 lg:p-6
        ${glowBorderMap[glow]}
      `}
    >
      {/* 🔥 GLOW LAYER */}
      <div
        className={`
          absolute -inset-1
          rounded-2xl
          bg-gradient-to-r ${glowBgMap[glow]} to-transparent
          blur-xl sm:blur-2xl
          opacity-60
          -z-10
        `}
      />

      {/* ✨ INNER GLOSS */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

      {/* ===== CONTENT ===== */}
      <div className="relative z-10 flex flex-col justify-between gap-3 sm:gap-4">
        
        {/* ICON */}
        <div className="flex items-center justify-between">
          <div
            className="
              flex items-center justify-center
              h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10
              rounded-md sm:rounded-lg
              bg-white/5
              border border-white/10
              shrink-0
            "
          >
            {icon}
          </div>
        </div>

        {/* TEXT */}
        <div className="min-w-0">
          <p className="text-[9px] sm:text-[10px] md:text-xs tracking-widest text-gray-400 uppercase truncate">
            {title}
          </p>

          <h2 className="mt-1 text-sm sm:text-base md:text-lg font-semibold text-white break-words">
            {value}
          </h2>

          <p className="text-[11px] sm:text-xs md:text-sm text-gray-400 leading-snug">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
