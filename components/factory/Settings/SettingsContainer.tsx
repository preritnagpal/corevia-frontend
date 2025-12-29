"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import ProfileSettings from "./ProfileSettings";
import SecuritySettings from "./SecuritySettings";
import AddressSettings from "./AddressSettings";
import ComplianceSettings from "./ComplianceSettings";
import ContactPage from "./ContactPage"; // ✅ ADD

type Tab =
  | "profile"
  | "security"
  | "address"
  | "compliance"
  | "contact"; // ✅ ADD

export default function SettingsContainer() {
  const [tab, setTab] = useState<Tab>("profile");
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      router.push("/factory/login");
    }
  }

  return (
    <div className="relative max-w-4xl">
      {/* ================= STICKY HEADER ================= */}
      <div className="sticky top-0 z-30 bg-black pb-4">
        {/* TITLE + LOGOUT */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-white">
            Settings
          </h1>

          {/* MOBILE ONLY LOGOUT */}
          <button
            onClick={handleLogout}
            className="
              flex md:hidden items-center gap-2 rounded-lg
              bg-red-500/10 px-3 py-2
              text-sm text-red-400
              hover:bg-red-500/20 cursor-pointer
            "
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-6 border-b border-white/10 text-sm">
          <TabButton label="Profile" active={tab==="profile"} onClick={()=>setTab("profile")} />
          <TabButton label="Security" active={tab==="security"} onClick={()=>setTab("security")} />
          <TabButton label="Address" active={tab==="address"} onClick={()=>setTab("address")} />
          <TabButton label="Compliance" active={tab==="compliance"} onClick={()=>setTab("compliance")} />
          <TabButton label="Contact" active={tab==="contact"} onClick={()=>setTab("contact")} />
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="pt-6">
        {tab === "profile" && <ProfileSettings />}
        {tab === "security" && <SecuritySettings />}
        {tab === "address" && <AddressSettings />}
        {tab === "compliance" && <ComplianceSettings />}
        {tab === "contact" && <ContactPage />} {/* ✅ ADD */}
      </div>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer pb-2 transition ${
        active
          ? "border-b-2 border-cyan-400 text-white"
          : "text-gray-400 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
