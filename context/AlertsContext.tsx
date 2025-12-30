"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert } from "@/types/alert";

interface AlertsContextType {
  dropdownAlerts: Alert[];
  panelAlerts: Alert[];
  unreadCount: number;

  markRead: (id: string) => Promise<void>;
  dismissDropdown: (id: string) => Promise<void>;
  deleteAlert: (id: string) => Promise<void>;
  deleteBulk: (ids: string[]) => Promise<void>;
}

const AlertsContext = createContext<AlertsContextType | null>(null);

export function useAlerts() {
  const ctx = useContext(AlertsContext);
  if (!ctx) throw new Error("useAlerts must be used inside AlertsProvider");
  return ctx;
}

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const [dropdownAlerts, setDropdownAlerts] = useState<Alert[]>([]);
  const [panelAlerts, setPanelAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [factoryId, setFactoryId] = useState<string | null>(null);

  /* LOAD FACTORY */
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setFactoryId(d?.user?._id || null));
  }, []);

  /* 🔔 DROPDOWN POLLING (15s) */
  useEffect(() => {
    if (!factoryId) return;

    const load = async () => {
      const res = await fetch(
        `/api/alerts/dropdown?factoryId=${factoryId}`
      );
      const data = await res.json();

      setDropdownAlerts(data.alerts || []);
      setUnreadCount(data.count || 0);
    };

    load();
    const i = setInterval(load, 15000);
    return () => clearInterval(i);
  }, [factoryId]);

  /* 📋 PANEL LOAD (initial only) */
  useEffect(() => {
    if (!factoryId) return;

    fetch(`/api/alerts/all?factoryId=${factoryId}`)
      .then((r) => r.json())
      .then((d) => setPanelAlerts(d.alerts || []));
  }, [factoryId]);

  /* ================= ACTIONS ================= */

  async function markRead(alertId: string) {
    await fetch("/api/alerts/mark-read", {
      method: "POST",
      body: JSON.stringify({ alertId }),
      headers: { "Content-Type": "application/json" },
    });

    setPanelAlerts((p) =>
      p.map((a) =>
        a._id === alertId ? { ...a, read: true } : a
      )
    );

    setDropdownAlerts((d) =>
      d.map((a) =>
        a._id === alertId ? { ...a, read: true } : a
      )
    );

    setUnreadCount((c) => Math.max(0, c - 1));
  }

  async function dismissDropdown(alertId: string) {
    await fetch("/api/alerts/dismiss-dropdown", {
      method: "POST",
      body: JSON.stringify({ alertId }),
      headers: { "Content-Type": "application/json" },
    });

    setDropdownAlerts((d) => d.filter((a) => a._id !== alertId));
    setUnreadCount((c) => Math.max(0, c - 1));
  }

  async function deleteAlert(alertId: string) {
    await fetch("/api/alert/delete", {
      method: "POST",
      body: JSON.stringify({ alertId }),
      headers: { "Content-Type": "application/json" },
    });

    setDropdownAlerts((d) => d.filter((a) => a._id !== alertId));
    setPanelAlerts((p) => p.filter((a) => a._id !== alertId));
    setUnreadCount((c) => Math.max(0, c - 1));
  }

  async function deleteBulk(alertIds: string[]) {
    if (!alertIds.length) return;

    await fetch("/api/alert/delete-bulk", {
      method: "POST",
      body: JSON.stringify({ alertIds }),
      headers: { "Content-Type": "application/json" },
    });

    setDropdownAlerts((d) =>
      d.filter((a) => !alertIds.includes(a._id))
    );
    setPanelAlerts((p) =>
      p.filter((a) => !alertIds.includes(a._id))
    );
    setUnreadCount((c) =>
      Math.max(0, c - alertIds.length)
    );
  }

  return (
    <AlertsContext.Provider
      value={{
        dropdownAlerts,
        panelAlerts,
        unreadCount,
        markRead,
        dismissDropdown,
        deleteAlert,
        deleteBulk,
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
}
