"use client";

import { useState } from "react";
import { Send } from "lucide-react";

const QUICK_ACTIONS = [
  "Analyze my emission data",
  "Check compliance status",
  "Generate monthly report",
  "Review sensor alerts",
];

export default function ChatInput({
  onSend,
  onFirstMessage,
  hasMessages,
}: {
  onSend: (text: string) => void;
  onFirstMessage?: (text: string) => void;
  hasMessages?: boolean;
}) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;

    if (!hasMessages && onFirstMessage) {
      onFirstMessage(text);
    }

    onSend(text);
    setText("");
  };

  const handleQuickAction = (action: string) => {
    if (!hasMessages && onFirstMessage) {
      onFirstMessage(action);
    }

    onSend(action);
    setText("");
  };

  return (
    <div className="border-t border-white/5 px-3 py-3 sm:px-4 sm:py-4 space-y-3">
      
      {/* ================= QUICK ACTIONS ================= */}
      <div>
        <div className="mb-1.5 text-[10px] sm:text-xs text-white/50">
          Quick actions
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action}
              onClick={() => handleQuickAction(action)}
              className="
                rounded-full
                border border-white/10
                bg-[#0f141b]
                px-3 sm:px-4
                py-1 sm:py-1.5
                text-[10px] sm:text-xs
                text-white/80
                transition
                hover:border-cyan-400/50
                hover:text-white
                cursor-pointer
                truncate
                max-w-full
              "
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* ================= INPUT ROW ================= */}
      <div className="flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask anything about compliance..."
          className="
            flex-1
            rounded-lg
            bg-[#0f141b]
            px-3 sm:px-4
            py-2.5 sm:py-3
            text-xs sm:text-sm
            outline-none
          "
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />

        <button
          onClick={submit}
          className="
            flex
            h-9 w-9 sm:h-10 sm:w-10
            items-center justify-center
            rounded-lg
            bg-cyan-500
            text-black
            cursor-pointer
            shrink-0
          "
        >
          <Send size={18} />
        </button>
      </div>

      {/* ================= HELPER TEXT ================= */}
      <div className="text-[10px] sm:text-xs flex items-center justify-center text-white/40 text-center">
        AI responses are generated for demonstration purposes.
      </div>
    </div>
  );
}
