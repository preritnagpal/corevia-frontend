import { AlertTriangle } from "lucide-react";
import { Alert } from "@/types/alert";

export default function AlertItem({ alert }: { alert: Alert }) {
  const color =
    alert.severity === "critical"
      ? "border-red-500/40 bg-red-500/10"
      : alert.severity === "high"
      ? "border-orange-400/40 bg-orange-400/10"
      : "border-yellow-400/40 bg-yellow-400/10";

  return (
    <div
      className={`rounded-xl border p-3 text-sm text-white ${color}`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-1 h-4 w-4 text-yellow-400" />

        <div>
          <p className="font-medium">{alert.type.replace("_", " ")}</p>
          <p className="mt-0.5 text-xs text-gray-300">
            {alert.message}
          </p>
          <p className="mt-1 text-[11px] text-gray-400">
            {new Date(alert.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
