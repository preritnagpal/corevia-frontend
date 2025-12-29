"use client";

import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Bot, Sparkles, Menu } from "lucide-react";
import { ChatMessage as ChatMessageType } from "./types";
import { typeWriter } from "./useTypewriter";

/* ================= TIME HELPERS ================= */

function getCurrentTime() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getDateLabel(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString())
    return "Yesterday";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ================= COMPONENT ================= */

export default function ChatWindow({
  messages,
  setMessages,
  addToHistory,
  onMenuClick,
}: {
  messages: ChatMessageType[];
  setMessages: React.Dispatch<
    React.SetStateAction<ChatMessageType[]>
  >;
  addToHistory: (text: string) => void;
  onMenuClick: () => void;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    /* ---------- USER MESSAGE ---------- */
    let userMsgIndex = -1;
    const nowIso = new Date().toISOString();

    setMessages((prev) => {
      if (prev.length === 1) addToHistory(text);

      userMsgIndex = prev.length;
      return [
        ...prev,
        {
          role: "user",
          text: "",
          time: getCurrentTime(), // ✅ once
          createdAt: nowIso,      // ✅ string
        },
      ];
    });

    typeWriter(
      text,
      (partial) => {
        setMessages((prev) => {
          const updated = [...prev];
          if (updated[userMsgIndex]) {
            updated[userMsgIndex].text = partial;
          }
          return updated;
        });
      },
      15
    );

    /* ---------- AI MESSAGE ---------- */
    const aiResponse =
      "This is a real-time AI typing response. Replace this with streaming API later.";

    let aiMsgIndex = -1;

    setTimeout(() => {
      const aiIso = new Date().toISOString();

      setMessages((prev) => {
        aiMsgIndex = prev.length;
        return [
          ...prev,
          {
            role: "ai",
            text: "",
            time: getCurrentTime(), // ✅ once
            createdAt: aiIso,       // ✅ string
          },
        ];
      });

      typeWriter(
        aiResponse,
        (partial) => {
          setMessages((prev) => {
            const updated = [...prev];
            if (updated[aiMsgIndex]) {
              updated[aiMsgIndex].text = partial;
            }
            return updated;
          });
        },
        18
      );
    }, 300);
  };

  /* ================= RENDER ================= */

  let lastLabel: string | null = null;

  return (
    <div className="flex h-full flex-col">
      {/* ================= HEADER ================= */}
      <div className="shrink-0 border-b border-white/5 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500">
              <Bot size={22} className="text-black" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 ring-2 ring-[#0b0f14]" />
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm font-bold">
                AI Assistant{" "}
                <Sparkles size={16} className="text-cyan-400" />
              </div>
              <div className="text-xs text-white/50">
                Always here to help
              </div>
            </div>
          </div>

          {/* ☰ MENU — mobile + tablet only */}
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* ================= CHAT BODY ================= */}
      <div className="flex-1 overflow-y-auto px-4 scrollbar-hide">
        <div className="flex min-h-full flex-col justify-end py-6 space-y-6">
          {messages.map((m, i) => {
            const label = getDateLabel(m.createdAt);
            const showLabel = label !== lastLabel;
            lastLabel = label;

            return (
              <div key={i}>
                {showLabel && (
                  <div className="my-4 text-center text-xs text-white/40">
                    {label}
                  </div>
                )}
                <ChatMessage {...m} />
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ================= INPUT ================= */}
      <ChatInput
        onSend={sendMessage}
        onFirstMessage={addToHistory}
        hasMessages={messages.length > 1}
      />
    </div>
  );
}
