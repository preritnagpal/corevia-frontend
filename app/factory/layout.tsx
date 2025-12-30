"use client";

import { AlertsProvider } from "@/context/AlertsContext";
import { Toaster } from "sonner";

export default function FactoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AlertsProvider>
      {children}

      {/* 🔔 Global Toasts */}
      <Toaster
        richColors
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
    </AlertsProvider>
  );
}
