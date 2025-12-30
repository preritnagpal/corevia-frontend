"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/factory/Sidebar/Sidebar";
import type { View } from "@/types/view";

import DashboardHeader from "@/components/factory/Dashboard/DashboardHeader";
import AlertHeader from "@/components/AlertPanel/AlertHeader";

import DashboardMain from "@/components/factory/Dashboard/DashboardMain";
import AlertsPanel from "@/components/AlertPanel/AlertsPanel";
import SettingsContainer from "@/components/factory/Settings/SettingsContainer";
import AIChatLayout from "@/components/factory/ai/AIChatLayout";

export default function FactoryPage() {
  const [active, setActive] = useState<View>("dashboard");
  const [search, setSearch] = useState("");
  const [dashboardRefresh, setDashboardRefresh] =
    useState<(() => void) | null>(null);

  const [user, setUser] = useState<{
    email: string;
    name?: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((j) => {
        if (j.loggedIn && j.user) {
          setUser({
            email: j.user.email,
            name: j.user.data?.factoryName,
          });
        }
      });
  }, []);

  return (
    <div className="h-[100dvh] bg-black text-white overflow-hidden">
      <Sidebar active={active} setActive={setActive} user={user} />

      <div className="md:ml-64 flex h-full flex-col p-6 overflow-hidden">
        {active === "dashboard" && (
          <DashboardHeader onRefresh={() => dashboardRefresh?.()} />
        )}

        {active === "alerts" && (
          <AlertHeader
            search={search}
            onSearchChange={setSearch}
            onRefresh={() => {}}
          />
        )}

        {/* 🔥 ONLY FIX IS HERE (BOTTOM SPACE) */}
        <main className="flex-1 overflow-y-auto scrollbar-hide pb-10">
          {active === "dashboard" && (
            <DashboardMain
              registerRefresh={(fn) => setDashboardRefresh(() => fn)}
            />
          )}

          {active === "ask-ai" && <AIChatLayout />}
          {active === "alerts" && <AlertsPanel search={search} />}
          {active === "settings" && <SettingsContainer />}
        </main>
      </div>
    </div>
  );
}

