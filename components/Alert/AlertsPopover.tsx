"use client";

import { AlertTriangle, X } from "lucide-react";
import { useAlerts } from "@/context/AlertsContext";

export default function AlertsPopover({
  onClose,
}: {
  onClose: () => void;
}) {
  const { dropdownAlerts, dismissDropdown } = useAlerts();

  return (
    <div
      className="
        fixed z-50
        top-36 right-6
        w-[92vw] sm:w-[360px] lg:w-[380px] sm:top-36 md:top-25
        max-w-[420px]
        rounded-xl sm:rounded-2xl
        border border-white/10
        bg-gradient-to-br from-[#0b1220] to-[#05080f]
        shadow-2xl
      "
    >
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between px-3 py-3 sm:p-4 border-b border-white/10">
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-white">
            Active Alerts
          </h3>
          <p className="text-[10px] sm:text-xs text-gray-400">
            Recent notifications
          </p>
        </div>

        <button onClick={onClose}>
          <X className="h-4 w-4 text-gray-400 hover:text-white" />
        </button>
      </div>

      {/* ================= LIST ================= */}
      <div
        className="
          max-h-[60vh] sm:max-h-[420px]
          overflow-y-auto
          px-2 py-3 sm:p-3
          space-y-2 sm:space-y-3
          scrollbar-hide
        "
      >
        {dropdownAlerts.length === 0 && (
          <p className="text-center text-xs sm:text-sm text-gray-400 py-6">
            No new alerts 🎉
          </p>
        )}

        {dropdownAlerts.map((a) => {
          const isCritical = a.severity === "critical";

          return (
            <div
              key={a._id}
              className={`
                relative
                rounded-lg sm:rounded-xl
                border
                px-3 py-3 sm:p-4
                ${
                  isCritical
                    ? "border-red-500/30 bg-red-500/10"
                    : "border-yellow-500/30 bg-yellow-500/10"
                }
              `}
            >
              {/* MARK AS READ */}
              <button
                onClick={() => dismissDropdown(a._id)}
                className="absolute right-2 top-2 text-gray-400 hover:text-white"
                title="Mark as read"
              >
                <X size={14} />
              </button>

              <div className="flex gap-2 sm:gap-3">
                <AlertTriangle
                  className={`mt-0.5 h-4 w-4 shrink-0 ${
                    isCritical ? "text-red-400" : "text-yellow-400"
                  }`}
                />

                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-white">
                    {a.type.replace("_", " ")}
                  </p>

                  <p className="mt-1 text-[11px] sm:text-xs text-gray-300 break-words">
                    {a.message}
                  </p>

                  <p className="mt-2 text-[10px] sm:text-[11px] text-gray-400">
                    {new Date(a.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
