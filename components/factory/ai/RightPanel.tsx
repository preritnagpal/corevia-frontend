import { Zap, Shield, BarChart3, Sparkles, X } from "lucide-react";
import ChatHistoryPanel from "./ChatHistoryPanel";

export default function RightPanel({
  history,
  onNewChat,
  onClose,
}: {
  history: string[];
  onNewChat: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="h-full space-y-4 sm:space-y-6">
      
      {/* ================= AI CAPABILITIES ================= */}
      <section
        className="
          rounded-xl sm:rounded-2xl
          border border-white/10
          bg-[#0b0f14]
          p-3 sm:p-4
        "
      >
        <div className="mb-3 sm:mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm sm:text-base font-semibold">
            <Sparkles size={18} className="text-cyan-400 sm:size-[20px]" />
            <span>AI Capabilities</span>
          </h3>

          {/* CLOSE (MOBILE / DRAWER ONLY) */}
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 hover:bg-white/10"
            >
              <X size={16} className="sm:size-[18px]" />
            </button>
          )}
        </div>

        <div className="space-y-2 sm:space-y-3">
          <Capability
            icon={<Zap size={18} />}
            title="Real-time Analysis"
            desc="Instant compliance insights"
          />
          <Capability
            icon={<Shield size={18} />}
            title="Regulatory Updates"
            desc="Latest PCB guidelines"
          />
          <Capability
            icon={<BarChart3 size={18} />}
            title="Data Insights"
            desc="Emission trend analysis"
          />
        </div>
      </section>

      {/* ================= CHAT HISTORY ================= */}
      <ChatHistoryPanel history={history} onNewChat={onNewChat} />
    </div>
  );
}

/* ================= CAPABILITY CARD ================= */

function Capability({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div
      className="
        flex items-start gap-3 sm:gap-4
        rounded-lg sm:rounded-xl
        bg-[#0f141b]
        px-3 sm:px-4
        py-2.5 sm:py-3
      "
    >
      <div
        className="
          flex h-8 w-8 sm:h-10 sm:w-10
          shrink-0
          items-center justify-center
          rounded-lg
          bg-white/5
          text-cyan-500
        "
      >
        {icon}
      </div>

      <div className="min-w-0">
        <div className="text-xs sm:text-sm font-medium truncate">
          {title}
        </div>
        <div className="text-[10px] sm:text-xs text-white/50">
          {desc}
        </div>
      </div>
    </div>
  );
}
