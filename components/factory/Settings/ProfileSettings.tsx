"use client";

import { useEffect, useState } from "react";
import EditableRow from "./EditableRow";
import { toast } from "sonner";

type Field =
  | "factoryName"
  | "ownerName"
  | "designation"
  | "factoryType"
  | "employees"
  | "establishedYear";

export default function ProfileSettings() {
  const [data, setData] = useState<any>(null);
  const [editing, setEditing] = useState<Field | null>(null);
  const [value, setValue] = useState("");

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
    toast.success("Updated successfully");
    setData(updated);
    setEditing(null);
  }

  if (!data) {
    return <p className="text-sm text-gray-400">Loading profile…</p>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Profile</h1>
        <p className="text-sm text-gray-400">
          Basic factory and ownership details
        </p>
      </div>

      {/* ROWS */}
      <EditableRow
        label="Factory Name"
        value={data.factoryName}
        editing={editing === "factoryName"}
        onEdit={() => {
          setEditing("factoryName");
          setValue(data.factoryName || "");
        }}
        onSave={() => save("factoryName")}
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
        label="Owner Name"
        value={data.ownerName}
        editing={editing === "ownerName"}
        onEdit={() => {
          setEditing("ownerName");
          setValue(data.ownerName || "");
        }}
        onSave={() => save("ownerName")}
        onCancel={() => setEditing(null)}
      >
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          className="w-full rounded-lg border border-cyan-400 bg-black px-3 py-2 text-white outline-none"
        />
      </EditableRow>

      <EditableRow
        label="Designation"
        value={data.designation}
        editing={editing === "designation"}
        onEdit={() => {
          setEditing("designation");
          setValue(data.designation || "");
        }}
        onSave={() => save("designation")}
        onCancel={() => setEditing(null)}
      >
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          className="w-full rounded-lg border border-cyan-400 bg-black px-3 py-2 text-white outline-none"
        />
      </EditableRow>

      <EditableRow
        label="Factory Type"
        value={data.factoryType}
        editing={editing === "factoryType"}
        onEdit={() => {
          setEditing("factoryType");
          setValue(data.factoryType || "");
        }}
        onSave={() => save("factoryType")}
        onCancel={() => setEditing(null)}
      >
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          className="w-full rounded-lg border border-cyan-400 bg-black px-3 py-2 text-white outline-none"
        />
      </EditableRow>

      <EditableRow
        label="Number of Employees"
        value={data.employees}
        editing={editing === "employees"}
        onEdit={() => {
          setEditing("employees");
          setValue(String(data.employees || ""));
        }}
        onSave={() => save("employees")}
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
        label="Established Year"
        value={data.establishedYear}
        editing={editing === "establishedYear"}
        onEdit={() => {
          setEditing("establishedYear");
          setValue(String(data.establishedYear || ""));
        }}
        onSave={() => save("establishedYear")}
        onCancel={() => setEditing(null)}
      >
        <input
          type="number"
          value={value}
          onChange={e => setValue(e.target.value)}
          className="w-full rounded-lg border border-cyan-400 bg-black px-3 py-2 text-white outline-none"
        />
      </EditableRow>
    </div>
  );
}
