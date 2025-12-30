"use client";

export type Range = "7d" | "30d";

export function TimeRangeSelector({
  value,
  onChange,
}: {
  value: Range;
  onChange: (v: Range) => void;
}) {
  const options: Range[] = ["7d", "30d"];

  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {options.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`
            rounded-full
            px-2 sm:px-3
            py-1
            text-[10px] sm:text-xs
            transition
            ${
              value === r
                ? "bg-sky-500/20 text-sky-400 ring-1 ring-sky-500/30"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }
          `}
        >
          {r === "7d" && "7 Days"}
          {r === "30d" && "30 Days"}
        </button>
      ))}
    </div>
  );
}
