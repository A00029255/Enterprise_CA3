"use client";

import dynamic from "next/dynamic";
import type { MapLocation } from "@/lib/types";

const CampusMapInner = dynamic(() => import("@/components/campus-map-inner"), {
  ssr: false,
  loading: () => (
    <div className="card flex h-[34rem] items-center justify-center">
      <p className="text-slate-600">Loading map…</p>
    </div>
  ),
});

export function CampusMap({ locations }: { locations: MapLocation[] }) {
  return <CampusMapInner locations={locations} />;
}