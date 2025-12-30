"use client";

import {
  LayoutDashboard,
  LineChart,
  Bell,
  Bot,
  Settings,
  LogOut,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { View } from "@/types/view";
import LogoutModal from "./LogoutModal";

interface SidebarProps {
  active: View;
  setActive: (v: View) => void;
  user: {
    email: string;
    name?: string;
  } | null;
}

export default function Sidebar({
  active,
  setActive,
  user,
}: SidebarProps) {
  // 🔴 Logout modal open/close state
  const [logoutOpen, setLogoutOpen] = useState(false);

  // 🔁 Navigation ke liye
  const router = useRouter();

  /* =====================================================
     USER KA AVATAR LETTER
     - Name ho to first letter
     - Nahi ho to email ka first letter
     - Kuch bhi nahi to default "F"
  ===================================================== */
  const initials = useMemo(() => {
    if (user?.name) return user.name[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return "F";
  }, [user]);

  /* =====================================================
     LOGOUT FLOW
     - API hit karega
     - Cookie/session clear
     - Login page pe redirect
  ===================================================== */
  async function handleConfirmLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setLogoutOpen(false);
      router.push("/factory/login");
    }
  }

  return (
    <>
      {/* =====================================================
          DESKTOP SIDEBAR
          - Sirf md+ screens pe dikhega
          - Fixed rahega left side
      ===================================================== */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-white/10 bg-black md:flex">
        
        {/* -------- LOGO / APP NAME -------- */}
        <div className="px-5 py-5">
          <h2 className="text-lg font-semibold text-white">Corevia</h2>
          <p className="text-xs text-gray-400">
            Centralized Monitoring Platform
          </p>
        </div>

        {/* -------- MAIN MENU ITEMS -------- */}
        <div className="flex-1 space-y-1 px-3 overflow-y-auto">
          <Item
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active={active === "dashboard"}
            onClick={() => setActive("dashboard")}
          />

          <Item
            icon={<LineChart size={18} />}
            label="Analytics"
            active={active === "analytics"}
            onClick={() => setActive("analytics")}
          />

          {/* 🔔 Alerts direct panel open karega */}
          <Item
            icon={<Bell size={18} />}
            label="Alerts"
            active={active === "alerts"}
            onClick={() => setActive("alerts")}
          />

          <Item
            icon={<Bot size={18} />}
            label="Ask AI"
            active={active === "ask-ai"}
            onClick={() => setActive("ask-ai")}
          />

          <Item
            icon={<Settings size={18} />}
            label="Settings"
            active={active === "settings"}
            onClick={() => setActive("settings")}
          />
        </div>

        {/* -------- USER PROFILE CARD -------- */}
        <div className="border-t border-white/10 p-4">
          
          {/* Profile click karte hi settings open */}
          <div
            onClick={() => setActive("settings")}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10"
          >
            <div className="relative">
              {/* Avatar circle */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white">
                {initials}
              </div>

              {/* Online green dot */}
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-black bg-green-500" />
            </div>

            {/* Name + Email (truncate taaki overflow na ho) */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {user?.name || "Factory"}
              </p>
              <p className="truncate text-xs text-gray-400">
                {user?.email || "loading..."}
              </p>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={() => setLogoutOpen(true)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-red-500/10 py-2 text-sm text-red-400 hover:bg-red-500/20"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* =====================================================
          MOBILE BOTTOM NAV
          - Sirf mobile screens pe
          - Fixed bottom
      ===================================================== */}
      <MobileBottomNav active={active} setActive={setActive} />

      {/* -------- LOGOUT CONFIRM MODAL -------- */}
      <LogoutModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}

/* =====================================================
   DESKTOP SIDEBAR ITEM
   - Icon + Label
   - Active state highlight
===================================================== */
function Item({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition ${
        active
          ? "bg-white/10 text-white"
          : "text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </div>
  );
}

/* =====================================================
   MOBILE BOTTOM NAV BAR
   - Dashboard, Analytics, Alerts, AI, Settings
===================================================== */
function MobileBottomNav({
  active,
  setActive,
}: {
  active: View;
  setActive: (v: View) => void;
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-white/20 bg-black py-2 md:hidden">
      <MobileItem
        icon={<LayoutDashboard size={22} />}
        label="Dashboard"
        active={active === "dashboard"}
        onClick={() => setActive("dashboard")}
      />
      <MobileItem
        icon={<LineChart size={22} />}
        label="Analytics"
        active={active === "analytics"}
        onClick={() => setActive("analytics")}
      />
      <MobileItem
        icon={<Bell size={22} />}
        label="Alerts"
        active={active === "alerts"}
        onClick={() => setActive("alerts")}
      />
      <MobileItem
        icon={<Bot size={22} />}
        label="AI"
        active={active === "ask-ai"}
        onClick={() => setActive("ask-ai")}
      />
      <MobileItem
        icon={<Settings size={22} />}
        label="Settings"
        active={active === "settings"}
        onClick={() => setActive("settings")}
      />
    </nav>
  );
}

/* =====================================================
   SINGLE MOBILE ITEM
   - Icon + Small label
   - Active hone pe top blue line
===================================================== */
function MobileItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex cursor-pointer flex-col items-center justify-center
        px-3 py-2 transition
        ${active ? "text-blue-400" : "text-gray-400 hover:text-white"}
      `}
    >
      {/* 🔵 Active tab indicator */}
      {active && (
        <span className="absolute -top-1 h-[2px] w-10 rounded-full bg-blue-400" />
      )}

      {icon}

      {/* Label niche chhota sa */}
      <span className="mt-0.5 text-[10px] font-medium leading-none">
        {label}
      </span>
    </button>
  );
}
