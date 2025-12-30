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
      <div className="flex items-start gap-2 sm:gap-3 max-w-[95%] sm:max-w-[85%]">
        {/* 🤖 AI ICON */}
        <div
          className="
            flex
            h-8 w-8 sm:h-9 sm:w-9
            shrink-0
            items-center justify-center
            rounded-lg
            bg-gradient-to-br from-cyan-500 to-teal-500
          "
        >
          <Bot size={16} className="text-black sm:size-[18px]" />
        </div>

        {/* AI BUBBLE */}
        <div className="min-w-0">
          <div
            className="
              rounded-lg sm:rounded-xl
              bg-[#151b22]
              px-3 sm:px-4
              py-2.5 sm:py-3
              text-xs sm:text-sm
              leading-relaxed
              break-words
              whitespace-pre-wrap
            "
          >
            {text ? text : <span className="opacity-40">▍</span>}
          </div>

          {/* TIME */}
          {time && (
            <div className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-white/40">
              {time}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ================= USER MESSAGE ================= */
  return (
    <div className="ml-auto flex max-w-[95%] sm:max-w-[80%] justify-end">
      <div className="text-right min-w-0">
        <div
          className="
            inline-block
            rounded-lg sm:rounded-xl
            bg-gradient-to-r from-cyan-500 to-teal-500
            px-3 sm:px-4
            py-2.5 sm:py-3
            text-xs sm:text-sm
            text-black
            leading-relaxed
            break-words
            whitespace-pre-wrap
          "
        >
          {text}
        </div>

        {/* TIME */}
        {time && (
          <div className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-white/40">
            {time}
          </div>
        )}
      </div>
    </div>
  );
}
