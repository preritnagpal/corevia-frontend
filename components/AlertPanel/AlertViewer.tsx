"use client";

import { Alert } from "@/types/alert";
import { Bot, Send } from "lucide-react";
import { useState } from "react";

export default function AlertViewer({ alert }: { alert: Alert | null }) {
  const [aiQuery, setAiQuery] = useState("");
  const [showAi, setShowAi] = useState(false);

  if (!alert) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-500">
        Select an alert to view details
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-black/40">
      {/* HEADER */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {alert.message}
            </h2>

            <div className="mt-1 flex items-center gap-4 text-xs text-gray-400">
              <span className="uppercase tracking-wide">
                {alert.source ?? "System"}
              </span>
              <span>•</span>
              <span>
                {new Date(alert.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          {/* SEVERITY */}
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              alert.severity === "high"
                ? "bg-red-500/20 text-red-400"
                : alert.severity === "medium"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-green-500/20 text-green-400"
            }`}
          >
            {alert.severity ?? "info"}
          </span>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* DETAILS CARD */}
        <div className="rounded-xl border border-white/10 bg-[#0b1220] p-5">
          <h3 className="mb-3 text-sm font-semibold text-white">
            Alert Details
          </h3>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <p className="text-xs text-gray-500">Type</p>
              <p>{alert.type}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p>{alert.date}</p>
            </div>
            {alert.value !== undefined && (
              <div>
                <p className="text-xs text-gray-500">Value</p>
                <p>{alert.value}</p>
              </div>
            )}
            {alert.baseline !== undefined && (
              <div>
                <p className="text-xs text-gray-500">Baseline</p>
                <p>{alert.baseline}</p>
              </div>
            )}
          </div>
        </div>

        {/* AI ACTION */}
        <div className="rounded-xl border border-white/10 bg-[#0b1220] p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Bot size={18} />
              <h3 className="text-sm font-semibold">
                AI Assistant
              </h3>
            </div>

            <button
              onClick={() => setShowAi((p) => !p)}
              className="rounded-md bg-blue-600/20 px-3 py-1.5 text-xs text-blue-400 hover:bg-blue-600/30"
            >
              Ask AI to explain
            </button>
          </div>

          {/* AI CHAT AREA */}
          {showAi && (
            <div className="mt-4 space-y-3">
              {/* AI RESPONSE (placeholder) */}
              <div className="rounded-md bg-white/5 p-3 text-sm text-gray-300">
                🤖 <span className="text-gray-400">AI:</span>  
                This alert indicates a change detected compared to the
                7-day average. You can ask me to explain it in simple
                terms or suggest actions.
              </div>

              {/* USER INPUT */}
              <div className="flex items-center gap-2">
                <input
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Ask something about this alert..."
                  className="flex-1 rounded-md bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder-gray-500"
                />
                <button
                  className="rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700"
                  title="Send"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
