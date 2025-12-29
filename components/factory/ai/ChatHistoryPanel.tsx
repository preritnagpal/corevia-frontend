"use client";

import { Plus, MessageSquare } from "lucide-react";

export default function ChatHistoryPanel({
  history,
  onNewChat,
}: {
  history: string[];
  onNewChat: () => void;
}) {
  return (
    <section className="h-[346px] flex flex-col px-4 py-6 border-white/10 border rounded-2xl bg-[#0b0f14]">
      
      {/* NEW CHAT (FIXED) */}
      <button
        onClick={onNewChat}
        className="mb-4 flex cursor-pointer items-center gap-2 rounded-xl bg-white/8 px-3 py-2 text-sm hover:bg-white/5 transition"
      >
        <Plus size={18} className="text-cyan-400" />
        <span className="font-medium">New Chat</span>
      </button>

      {/* HISTORY TITLE (FIXED) */}
      <div className="mb-2 text-xs uppercase tracking-wide text-white/50">
        History
      </div>

      {/* 🔥 SCROLLABLE HISTORY AREA */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-2 pr-1 scrollbar-hide">
        {history.length === 0 ? (
          <div className="mt-4 text-xs text-white/40">
            No previous chats
          </div>
        ) : (
          history.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5 cursor-pointer transition"
            >
              <MessageSquare size={14} className="text-cyan-400" />
              <span className="truncate">{item}</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
