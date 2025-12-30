"use client";

import { Pencil, Check, X } from "lucide-react";

interface EditableRowProps {
  label: string;
  value: any;
  editing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

export default function EditableRow({
  label,
  value,
  editing,
  onEdit,
  onSave,
  onCancel,
  children,
}: EditableRowProps) {
  return (
    <div className="border-b border-white/10 py-4">
      <div className="flex items-start justify-between gap-4">
        {/* LEFT */}
        <div className="min-w-0 flex-1">
          <p className="text-sm text-gray-400">{label}</p>

          {!editing ? (
            <p className="mt-1 break-words text-white">
              {value ?? "-"}
            </p>
          ) : (
            <div className="mt-2 w-full max-w-xl">
              {children}
            </div>
          )}
        </div>

        {/* RIGHT (ALWAYS RIGHT) */}
        {!editing ? (
          <button
            onClick={onEdit}
            className="
              flex shrink-0 items-center gap-2
              rounded-lg bg-cyan-500 px-3 py-2
              text-sm font-medium text-black
              hover:bg-cyan-400
            "
          >
            <Pencil size={14} />
            <span className="hidden sm:inline">Edit</span>
          </button>
        ) : (
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={onSave}
              className="
                flex items-center gap-2
                rounded-lg bg-cyan-500 px-3 py-2
                text-sm font-medium text-black
                hover:bg-cyan-400
              "
            >
              <Check size={14} />
              <span className="hidden sm:inline">Save</span>
            </button>

            <button
              onClick={onCancel}
              className="
                rounded-lg border border-white/20
                p-2 text-gray-400
                hover:bg-white/5
              "
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
