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
    <section
      className="
        flex flex-col
        w-full
        rounded-xl sm:rounded-2xl
        border border-white/10
        bg-[#0b0f14]
        px-3 sm:px-4
        py-4 sm:py-6
        h-auto
        md:h-[340px]
      "
    >
      {/* ================= NEW CHAT ================= */}
      <button
        onClick={onNewChat}
        className="
          mb-3 sm:mb-4
          flex items-center gap-2
          rounded-lg sm:rounded-xl
          bg-white/8
          px-3 py-2
          text-xs sm:text-sm
          hover:bg-white/5
          transition
        "
      >
        <Plus size={18} className="text-cyan-400 shrink-0" />
        <span className="font-medium">New Chat</span>
      </button>

      {/* ================= TITLE ================= */}
      <div className="mb-2 text-[10px] sm:text-xs uppercase tracking-wide text-white/50">
        History
      </div>

      {/* ================= HISTORY LIST ================= */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-1.5 sm:space-y-2 pr-1 scrollbar-hide">
        {history.length === 0 ? (
          <div className="mt-3 text-[10px] sm:text-xs text-white/40">
            No previous chats
          </div>
        ) : (
          history.map((item, idx) => (
            <div
              key={idx}
              className="
                flex items-center gap-2
                rounded-md sm:rounded-lg
                px-2 sm:px-3
                py-2
                text-xs sm:text-sm
                text-white/80
                hover:bg-white/5
                cursor-pointer
                transition
              "
            >
              <MessageSquare
                size={14}
                className="text-cyan-400 shrink-0"
              />
              <span className="truncate">{item}</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
