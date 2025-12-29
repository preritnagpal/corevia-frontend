"use client";

import { Bot } from "lucide-react";

type Props = {
  role: "user" | "ai";
  text: string;
  time?: string;
};

export default function ChatMessage({ role, text, time }: Props) {
  /* ================= AI MESSAGE ================= */
  if (role === "ai") {
    return (
      <div className="flex items-start gap-3 max-w-[85%]">
        {/* 🤖 AI ICON */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500">
          <Bot size={18} className="text-black" />
        </div>

        {/* AI BUBBLE */}
        <div>
          <div className="rounded-xl bg-[#151b22] px-4 py-3 text-sm leading-relaxed">
            {text ? text : <span className="opacity-40">▍</span>}
          </div>

          {/* TIME */}
          {time && (
            <div className="mt-1 text-xs text-white/40">
              {time}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ================= USER MESSAGE ================= */
  return (
    <div className="ml-auto flex max-w-[80%] justify-end">
      <div className="text-right">
        <div className="inline-block rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-3 text-sm text-black leading-relaxed">
          {text}
        </div>

        {/* TIME */}
        {time && (
          <div className="mt-1 text-xs text-white/40">
            {time}
          </div>
        )}
      </div>
    </div>
  );
}
