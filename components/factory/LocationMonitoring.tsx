"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function LocationMonitoring() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(res => {
        if (res.loggedIn) {
          setData(res.user.data);
        }
      });
  }, []);

  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location & Monitoring</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        {/* Address */}
        <div>
          <p className="text-muted-foreground">Registered Address</p>
          <p className="font-medium">
            {data.address}, {data.district}, {data.state} – {data.pincode}
          </p>
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-muted-foreground">Latitude</p>
            <p className="font-medium">{data.latitude}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Longitude</p>
            <p className="font-medium">{data.longitude}</p>
          </div>
        </div>

        {/* Monitoring Status */}
        <div className="flex items-center justify-between rounded-md border p-4">
          <div>
            <p className="font-medium">Monitoring Status</p>
            <p className="text-muted-foreground text-sm">
              Data source: {data.monitoringMethod || "Satellite"}
            </p>
          </div>

          <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
            Active
          </span>
        </div>

        {/* Map placeholder */}
        <div className="rounded-md border border-dashed p-6 text-center text-muted-foreground text-sm">
          Map preview (coming soon)
        </div>
      </CardContent>
    </Card>
  );
}
