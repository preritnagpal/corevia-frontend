"use client";

import { Trash2 } from "lucide-react";

export type AlertTab = "all" | "system" | "government";

interface Props {
  activeTab: AlertTab;
  onTabChange: (tab: AlertTab) => void;
  selectedCount: number;
  onDeleteSelected: () => void;
}

export default function AlertsSubHeader({
  activeTab,
  onTabChange,
  selectedCount,
  onDeleteSelected,
}: Props) {
  const tabs: { key: AlertTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "system", label: "System" },
    { key: "government", label: "Govt" },
  ];

  return (
    <div className="border-b border-white/10 bg-black">
      {/* TABS + ACTION */}
      <div className="flex items-center justify-between px-4 pt-3">
        {/* TABS */}
        <div className="flex gap-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => onTabChange(t.key)}
              className={`pb-3 text-sm transition ${
                activeTab === t.key
                  ? "border-b-2 border-blue-500 text-white"
                  : "text-gray-400 hover:text-white cursor-pointer"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* DELETE SELECTED */}
        {selectedCount > 0 && (
          <button
            onClick={onDeleteSelected}
            className="flex items-center gap-2 rounded-md bg-red-600/10 px-3 py-1.5 text-sm text-red-400 hover:bg-red-600/20"
          >
            <Trash2 className="h-4 w-4" />
            Delete ({selectedCount})
          </button>
        )}
      </div>
    </div>
  );
}
