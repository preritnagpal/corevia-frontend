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

    // 🔥 FIRST MESSAGE → HISTORY
    if (!hasMessages && onFirstMessage) {
      onFirstMessage(text);
    }

    onSend(text);
    setText("");
  };

  /* 🔥 QUICK ACTION = DIRECT SEND */
  const handleQuickAction = (action: string) => {
    if (!hasMessages && onFirstMessage) {
      onFirstMessage(action);
    }

    onSend(action);
    setText("");
  };

  return (
    <div className="border-t border-white/5 p-4 space-y-3">
      {/* QUICK ACTIONS */}
      <div>
        <div className="mb-2 text-xs text-white/50">Quick actions</div>
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action}
              onClick={() => handleQuickAction(action)}
              className="
                rounded-full
                border border-white/10
                bg-[#0f141b]
                px-4 py-1.5
                text-xs
                text-white/80
                transition
                hover:border-cyan-400/50
                hover:text-white
                cursor-pointer
              "
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* INPUT ROW */}
      <div className="flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask anything about compliance..."
          className="flex-1 rounded-lg bg-[#0f141b] px-4 py-3 text-sm outline-none"
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />

        <button
          onClick={submit}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500 text-black cursor-pointer"
        >
          <Send size={20} />
        </button>
      </div>

      {/* HELPER TEXT */}
      <div className="text-xs flex items-center justify-center text-white/40">
        AI responses are generated for demonstration purposes.
      </div>
    </div>
  );
}
