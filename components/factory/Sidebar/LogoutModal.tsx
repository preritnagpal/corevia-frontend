"use client";

import { LogOut } from "lucide-react";

export default function LogoutModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0b1220] p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-red-500/10 p-2 text-red-400">
            <LogOut />
          </div>
          <h2 className="text-lg font-semibold">Logout</h2>
        </div>

        <p className="mt-3 text-sm text-gray-400">
          Are you sure you want to logout from this account?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
