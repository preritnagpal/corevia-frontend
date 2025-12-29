"use client";

import { useState, useRef } from "react";
import ChatWindow from "./ChatWindow";
import RightPanel from "./RightPanel";
import { ChatMessage } from "./types";

/* ================= TIME HELPERS ================= */

function getCurrentTime() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function createWelcomeMessage(): ChatMessage {
  return {
    role: "ai",
    text: "Hello! I'm your AI assistant. How can I help you today?",
    time: getCurrentTime(),
    createdAt: new Date().toISOString(), // ✅ FIX
  };
}

/* ================= COMPONENT ================= */

export default function AIChatLayout() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createWelcomeMessage(),
  ]);

  const [history, setHistory] = useState<string[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);

  // 👉 swipe support
  const touchStartX = useRef<number | null>(null);

  /* ================= NEW CHAT ================= */
  const startNewChat = () => {
    setMessages([createWelcomeMessage()]); // ✅ NEW instance
    setPanelOpen(false);                   // ✅ auto close sidebar
  };

  const addToHistory = (text: string) => {
    setHistory((prev) => [text, ...prev]);
  };

  /* ================= SWIPE CLOSE ================= */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;

    // swipe right → close
    if (diff > 70) setPanelOpen(false);

    touchStartX.current = null;
  };

  return (
    <div className="relative flex h-full text-white">
      {/* ================= CHAT AREA ================= */}
      <div className="relative flex flex-1 flex-col rounded-lg border border-white/10 bg-[#0b0f14] overflow-hidden">
        <ChatWindow
          messages={messages}
          setMessages={setMessages}
          addToHistory={addToHistory}
          onMenuClick={() => setPanelOpen(true)}
        />
      </div>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <div className="ml-6 hidden w-[360px] lg:block">
        <RightPanel history={history} onNewChat={startNewChat} />
      </div>

      {/* ================= MOBILE / TABLET DRAWER ================= */}
      <div
        className={`
          fixed inset-0 z-40 lg:hidden
          transition-all duration-300
          ${panelOpen ? "pointer-events-auto" : "pointer-events-none"}
        `}
      >
        {/* OVERLAY */}
        <div
          className={`
            absolute inset-0 bg-black/60 backdrop-blur-sm
            transition-opacity duration-300
            ${panelOpen ? "opacity-100" : "opacity-0"}
          `}
          onClick={() => setPanelOpen(false)}
        />

        {/* SLIDE PANEL */}
        <div
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className={`
            absolute right-0 top-0 h-full w-[85%] max-w-sm
            bg-black border-l border-white/10 p-4
            transform transition-transform duration-300 ease-out
            ${panelOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          <RightPanel
            history={history}
            onNewChat={startNewChat}
            onClose={() => setPanelOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}
