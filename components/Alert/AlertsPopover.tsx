"use client";

import { AlertTriangle, X } from "lucide-react";
import { useAlerts } from "@/context/AlertsContext";

export default function AlertsPopover({ onClose }: { onClose: () => void }) {
  const { dropdownAlerts, dismissDropdown } = useAlerts();

  return (
    <div className="absolute right-0 mt-6 w-[380px] rounded-2xl border border-white/10 bg-gradient-to-br from-[#0b1220] to-[#05080f] shadow-2xl z-50">
      
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div>
          <h3 className="text-sm font-semibold text-white">Active Alerts</h3>
          <p className="text-xs text-gray-400">Recent notifications</p>
        </div>
        <button onClick={onClose}>
          <X className="h-4 w-4 text-gray-400 hover:text-white" />
        </button>
      </div>

      {/* LIST */}
      <div className="max-h-[420px] overflow-y-auto p-3 space-y-3">
        {dropdownAlerts.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">
            No new alerts 🎉
          </p>
        )}

        {dropdownAlerts.map((a) => {
          const isCritical = a.severity === "critical";

          return (
            <div
              key={a._id}
              className={`relative rounded-xl border p-4 ${
                isCritical
                  ? "border-red-500/30 bg-red-500/10"
                  : "border-yellow-500/30 bg-yellow-500/10"
              }`}
            >
              {/* MARK READ */}
              <button
                onClick={() => dismissDropdown(a._id)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
                title="Mark as read"
              >
                <X size={14} />
              </button>

              <div className="flex gap-3">
                <AlertTriangle
                  className={`mt-0.5 h-4 w-4 ${
                    isCritical ? "text-red-400" : "text-yellow-400"
                  }`}
                />

                <div>
                  <p className="text-sm font-medium text-white">
                    {a.type.replace("_", " ")}
                  </p>
                  <p className="mt-1 text-xs text-gray-300">
                    {a.message}
                  </p>
                  <p className="mt-2 text-[11px] text-gray-400">
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
