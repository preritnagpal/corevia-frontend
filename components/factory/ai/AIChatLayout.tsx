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
    createdAt: new Date().toISOString(),
  };
}

export default function AIChatLayout() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createWelcomeMessage(),
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);

  const touchStartX = useRef<number | null>(null);

  const startNewChat = () => {
    setMessages([createWelcomeMessage()]);
    setPanelOpen(false);
  };

  const addToHistory = (text: string) => {
    setHistory((prev) => [text, ...prev]);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 70) setPanelOpen(false);
    touchStartX.current = null;
  };

  return (
    <div className="relative flex h-full w-full overflow-hidden text-white">
      {/* CHAT AREA */}
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-lg border border-white/10 bg-[#0b0f14]">
        <ChatWindow
          messages={messages}
          setMessages={setMessages}
          addToHistory={addToHistory}
          onMenuClick={() => setPanelOpen(true)}
        />
      </div>

      {/* DESKTOP SIDEBAR */}
      <div className="ml-4 hidden w-[300px] xl:w-[360px] lg:block">
        <RightPanel history={history} onNewChat={startNewChat} />
      </div>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          panelOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${
            panelOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setPanelOpen(false)}
        />

        <div
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className={`absolute right-0 top-0 h-full w-[90%] sm:w-[80%] max-w-sm
            bg-black border-l border-white/10 p-3 sm:p-4
            transition-transform duration-300
            ${panelOpen ? "translate-x-0" : "translate-x-full"}`}
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
