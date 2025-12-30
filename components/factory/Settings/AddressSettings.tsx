"use client";

import { useEffect, useState } from "react";
import EditableRow from "./EditableRow";
import { ChevronDown, ChevronUp } from "lucide-react";

type Field =
  | "address"
  | "area"
  | "district"
  | "pincode"
  | "latitude"
  | "longitude";

export default function AddressSettings() {
  const [data, setData] = useState<any>(null);
  const [editing, setEditing] = useState<Field | null>(null);
  const [value, setValue] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  /* LOAD DATA */
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then(res => setData(res.user?.data || {}));
  }, []);

  /* SAVE FIELD */
  async function save(field: Field) {
    const updated = { ...data, [field]: value };

    await fetch("/api/factory/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updated),
    });

    setData(updated);
    setEditing(null);
  }

  if (!data) {
    return <p className="text-sm text-gray-400">Loading address…</p>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Address</h1>
        <p className="text-sm text-gray-400">
          Location details used for satellite and environmental monitoring
        </p>
      </div>

      {/* BASIC ADDRESS FIELDS */}
      <EditableRow
        label="Address"
        value={data.address}
        editing={editing === "address"}
        onEdit={() => {
          setEditing("address");
          setValue(data.address || "");
        }}
        onSave={() => save("address")}
        onCancel={() => setEditing(null)}
      >
        <input
          autoFocus
          value={value}
          onChange={e => setValue(e.target.value)}
          className="w-full rounded-lg border border-cyan-400 bg-black px-3 py-2 text-white outline-none"
        />
      </EditableRow>

      <EditableRow
        label="Area"
        value={data.area}
        editing={editing === "area"}
        onEdit={() => {
          setEditing("area");
          setValue(data.area || "");
        }}
        onSave={() => save("area")}
        onCancel={() => setEditing(null)}
      >
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          className="w-full rounded-lg border border-cyan-400 bg-black px-3 py-2 text-white outline-none"
        />
      </EditableRow>

      <EditableRow
        label="District"
        value={data.district}
        editing={editing === "district"}
        onEdit={() => {
          setEditing("district");
          setValue(data.district || "");
        }}
        onSave={() => save("district")}
        onCancel={() => setEditing(null)}
      >
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          className="w-full rounded-lg border border-cyan-400 bg-black px-3 py-2 text-white outline-none"
        />
      </EditableRow>

      <EditableRow
        label="Pincode"
        value={data.pincode}
        editing={editing === "pincode"}
        onEdit={() => {
          setEditing("pincode");
          setValue(data.pincode || "");
        }}
        onSave={() => save("pincode")}
        onCancel={() => setEditing(null)}
      >
        <input
          type="number"
          value={value}
          onChange={e => setValue(e.target.value)}
          className="w-full rounded-lg border border-cyan-400 bg-black px-3 py-2 text-white outline-none"
        />
      </EditableRow>

      {/* STATE (READ ONLY) */}
      <div className="flex items-center justify-between border-b border-white/10 py-4">
        <div>
          <p className="text-sm text-gray-400">State</p>
          <p className="mt-1 text-white">{data.state || "-"}</p>
        </div>
        <span className="text-xs text-gray-500">Fixed</span>
      </div>

      {/* ADVANCED TOGGLE */}
      <button
        onClick={() => setShowAdvanced(v => !v)}
        className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
      >
        {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        Advanced location settings
      </button>

      {/* ADVANCED FIELDS */}
      {showAdvanced && (
        <>
          <EditableRow
            label="Latitude"
            value={data.latitude}
            editing={editing === "latitude"}
            onEdit={() => {
              setEditing("latitude");
              setValue(String(data.latitude || ""));
            }}
            onSave={() => save("latitude")}
            onCancel={() => setEditing(null)}
          >
            <input
              type="number"
              value={value}
              onChange={e => setValue(e.target.value)}
              className="w-full rounded-lg border border-cyan-400 bg-black px-3 py-2 text-white outline-none"
            />
          </EditableRow>

          <EditableRow
            label="Longitude"
            value={data.longitude}
            editing={editing === "longitude"}
            onEdit={() => {
              setEditing("longitude");
              setValue(String(data.longitude || ""));
            }}
            onSave={() => save("longitude")}
            onCancel={() => setEditing(null)}
          >
            <input
              type="number"
              value={value}
              onChange={e => setValue(e.target.value)}
              className="w-full rounded-lg border border-cyan-400 bg-black px-3 py-2 text-white outline-none"
            />
          </EditableRow>
        </>
      )}
    </div>
  );
}
