"use client";

import { useState, useMemo, useEffect } from "react";
import { useAlerts } from "@/context/AlertsContext";
import AlertsSubHeader, { AlertTab } from "./AlertsSubHeader";
import AlertViewer from "./AlertViewer";
import { Alert } from "@/types/alert";
import { toast } from "sonner";
import { Trash2, ArrowLeft } from "lucide-react";

export default function AlertsPanel({
  search,
  onRefreshRegister,
}: {
  search: string;
  onRefreshRegister?: (fn: () => Promise<void>) => void;
}) {
  const { panelAlerts, markRead, deleteAlert, deleteBulk } = useAlerts();

  const [tab, setTab] = useState<AlertTab>("all");
  const [activeAlert, setActiveAlert] = useState<Alert | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [visibleAlerts, setVisibleAlerts] = useState<Alert[]>([]);

  /* ---------- INITIAL SYNC ---------- */
  useEffect(() => {
    setVisibleAlerts(panelAlerts);
  }, [panelAlerts]);

  /* ---------- MANUAL REFRESH ---------- */
  async function manualRefresh() {
    setVisibleAlerts(panelAlerts);
    setActiveAlert(null);
    setSelectedIds([]);
    toast.success("Alerts refreshed");
  }

  useEffect(() => {
    onRefreshRegister?.(manualRefresh);
  }, [onRefreshRegister, panelAlerts]);

  /* ---------- FILTER ---------- */
  const filtered = useMemo(() => {
    return visibleAlerts.filter((a) => {
      const src = a.source?.toLowerCase() ?? "system";
      if (tab === "government" && src !== "government") return false;
      if (tab === "system" && src === "government") return false;
      if (search && !a.message.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [visibleAlerts, tab, search]);

  /* ---------- OPEN ALERT ---------- */
  function openAlert(alert: Alert) {
    setActiveAlert(alert);
    if (!alert.read) markRead(alert._id);
  }

  function toggleSelect(id: string) {
    setSelectedIds((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );
  }

  /* ---------- DELETE (UNDO SUPPORT) ---------- */
  function softDelete(alert: Alert) {
    setVisibleAlerts((p) => p.filter((a) => a._id !== alert._id));
    setSelectedIds((s) => s.filter((id) => id !== alert._id));
    if (activeAlert?._id === alert._id) setActiveAlert(null);

    let undone = false;
    const timer = setTimeout(() => {
      if (!undone) deleteAlert(alert._id);
    }, 30000);

    toast("Alert deleted", {
      duration: 30000,
      action: {
        label: "Undo",
        onClick: () => {
          undone = true;
          clearTimeout(timer);
          setVisibleAlerts((p) => [alert, ...p]);
        },
      },
    });
  }

  function bulkSoftDelete() {
    const toDelete = visibleAlerts.filter((a) =>
      selectedIds.includes(a._id)
    );

    setVisibleAlerts((p) =>
      p.filter((a) => !selectedIds.includes(a._id))
    );
    setSelectedIds([]);
    setActiveAlert(null);

    let undone = false;
    const timer = setTimeout(() => {
      if (!undone) deleteBulk(toDelete.map((a) => a._id));
    }, 30000);

    toast(`${toDelete.length} alerts deleted`, {
      duration: 30000,
      action: {
        label: "Undo",
        onClick: () => {
          undone = true;
          clearTimeout(timer);
          setVisibleAlerts((p) => [...toDelete, ...p]);
        },
      },
    });
  }

  /* ================= FULL SCREEN VIEWER ================= */
  if (activeAlert) {
    return (
      <div className="flex h-full flex-col rounded-xl border border-white/10 bg-[#0b1220]">
        {/* BACK HEADER */}
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <button
            onClick={() => setActiveAlert(null)}
            className="flex items-center gap-1 text-sm text-gray-300 hover:text-white cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        {/* VIEWER */}
        <div className="flex-1 overflow-y-auto">
          <AlertViewer alert={activeAlert} />
        </div>
      </div>
    );
  }

  /* ================= ALERT LIST ================= */
  return (
    <div className="flex h-full flex-col rounded-xl border border-white/10 bg-[#0b1220]">
      <AlertsSubHeader
        activeTab={tab}
        onTabChange={setTab}
        selectedCount={selectedIds.length}
        onDeleteSelected={bulkSoftDelete}
      />

      <div className="divide-y divide-white/5 overflow-y-auto">
        {filtered.map((a) => (
          <div
            key={a._id}
            onClick={() => openAlert(a)}
            className="flex cursor-pointer items-center gap-4 px-4 py-3 hover:bg-white/5"
          >
            <input
              className="cursor-pointer"
              type="checkbox"
              checked={selectedIds.includes(a._id)}
              onClick={(e) => e.stopPropagation()}
              onChange={() => toggleSelect(a._id)}
            />

            <div className="w-28 text-xs uppercase text-gray-400">
              {a.source ?? "System"}
            </div>

            <div className="flex-1 truncate">
              {a.message}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                softDelete(a);
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
