"use client";

import { Bell } from "lucide-react";
import { useAlerts } from "@/context/AlertsContext";
import { useState } from "react";
import AlertsPopover from "./AlertsPopover";

export default function AlertBell() {
  const { unreadCount } = useAlerts(); // ❌ alerts hata diya
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* OUTER BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#0b1220] hover:bg-[#1F2A3A] transition cursor-pointer"
      >
        {/* BELL ICON */}
        <Bell className="h-5 w-5 text-white" />

        {/* 🔴 COUNT BADGE — BORDER CORNER */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white shadow-md">
            {unreadCount}
          </span>
        )}
      </button>

      {/* POPOVER */}
      {open && <AlertsPopover onClose={() => setOpen(false)} />}
    </div>
  );
}
