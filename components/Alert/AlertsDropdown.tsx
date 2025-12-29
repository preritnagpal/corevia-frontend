"use client";

import { AlertTriangle, X } from "lucide-react";
import { useAlerts } from "@/context/AlertsContext";
import { Alert } from "@/types/alert";

export default function AlertsDropdown({
  alerts,
  onClose,
}: {
  alerts: Alert[];
  onClose: () => void;
}) {
  
  const { dismissDropdown } = useAlerts();
  

  return (
    <div className="absolute right-0 top-12 z-50 w-[360px] rounded-2xl border border-white/10 bg-gradient-to-br from-[#0b1220] to-[#05080f] shadow-xl">
      
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div>
          <h3 className="text-sm font-semibold text-white">Active Alerts</h3>
          <p className="text-xs text-gray-400">Recent notifications</p>
        </div>

        {/* Close dropdown */}
        <button onClick={onClose}>
          <X className="h-4 w-4 text-gray-400 hover:text-white" />
        </button>
      </div>

      {/* ALERT LIST */}
      <div className="max-h-[320px] overflow-y-auto p-3 space-y-3">
        {alerts.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">
            No new alerts
          </p>
        )}

        {alerts
        .map((a) => (
          <div
            key={a._id}
            className={`relative rounded-xl border p-3 ${
              a.severity === "critical"
                ? "border-red-500/30 bg-red-500/10"
                : "border-yellow-500/30 bg-yellow-500/10"
            }`}
          >
            {/* ❌ DISMISS (ONLY DROPDOWN) */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // 🚨 VERY IMPORTANT
                dismissDropdown(a._id);
              }}
              className="absolute right-2 top-2 text-gray-400 hover:text-white"
            >
              <X size={14} />
            </button>

            <div className="flex gap-2">
              <AlertTriangle
                className={`h-4 w-4 ${
                  a.severity === "critical"
                    ? "text-red-400"
                    : "text-yellow-400"
                }`}
              />

              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  {a.type.replace("_", " ")}
                </p>
                <p className="text-xs text-gray-300 mt-1">
                  {a.message}
                </p>
                <p className="mt-1 text-[11px] text-gray-400">
                  {new Date(a.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
