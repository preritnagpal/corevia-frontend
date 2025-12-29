import { Zap, Shield, BarChart3, Sparkles, X } from "lucide-react";
import ChatHistoryPanel from "./ChatHistoryPanel";

export default function RightPanel({
  history,
  onNewChat,
  onClose, // ✅ NEW
}: {
  history: string[];
  onNewChat: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="h-full space-y-6">
      {/* AI CAPABILITIES */}
      <section className="rounded-2xl border border-white/10 bg-[#0b0f14] p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-semibold">
            <Sparkles size={20} className="text-cyan-400" />
            <span>AI Capabilities</span>
          </h3>

          {/* CLOSE (ONLY WHEN PROVIDED – MOBILE) */}
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg p-1 hover:bg-white/10"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="space-y-3">
          <Capability
            icon={<Zap size={20} />}
            title="Real-time Analysis"
            desc="Instant compliance insights"
          />
          <Capability
            icon={<Shield size={20} />}
            title="Regulatory Updates"
            desc="Latest PCB guidelines"
          />
          <Capability
            icon={<BarChart3 size={20} />}
            title="Data Insights"
            desc="Emission trend analysis"
          />
        </div>
      </section>

      {/* CHAT HISTORY (NO HEADER HERE) */}
      <ChatHistoryPanel history={history} onNewChat={onNewChat} />
    </div>
  );
}

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
    <div className="flex items-start gap-4 rounded-xl bg-[#0f141b] px-4 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-cyan-500">
        {icon}
      </div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-xs text-white/50">{desc}</div>
      </div>
    </div>
  );
}
