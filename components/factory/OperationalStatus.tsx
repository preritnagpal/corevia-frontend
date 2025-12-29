"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Status = "Running" | "Closed";

export default function OperationalStatus() {
  const [status, setStatus] = useState<Status>("Running");
  const [loading, setLoading] = useState(false);

  // 🔹 fetch current status from Mongo
  useEffect(() => {
    fetch("/api/auth/me", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn && data.user?.data?.operationalStatus) {
          setStatus(data.user.data.operationalStatus as Status);
        }
      });
  }, []);

  async function updateStatus(newStatus: Status) {
    setLoading(true);

    const res = await fetch("/api/factory/operational-status", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // ✅ VERY IMPORTANT
      body: JSON.stringify({ status: newStatus }),
    });

    setLoading(false);

    if (res.ok) {
      setStatus(newStatus);
    } else {
      alert("Failed to update status");
    }
  }

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <h3 className="text-lg font-medium">Operational Status</h3>
          <p className="text-sm text-muted-foreground">
            Control your factory operation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 text-sm rounded-full ${
              status === "Running"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status}
          </span>

          <Button
            variant="outline"
            disabled={loading}
            onClick={() =>
              updateStatus(status === "Running" ? "Closed" : "Running")
            }
          >
            {loading
              ? "Updating..."
              : status === "Running"
              ? "Mark Closed"
              : "Mark Running"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
