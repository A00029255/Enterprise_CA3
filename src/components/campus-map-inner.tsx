"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import type { MapLocation } from "@/lib/types";

const markerIcon = L.divIcon({
  className: "",
  html: `
    <div
      style="
        width:20px;
        height:20px;
        border-radius:9999px;
        background:#ef4444;
        border:3px solid #ffffff;
        box-shadow:0 0 0 3px #111827;
      "
    ></div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export default function CampusMapInner({
  locations,
}: {
  locations: MapLocation[];
}) {
  const first = locations[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="card overflow-hidden">
        <MapContainer
          center={[
            Number(first?.latitude ?? 53.349805),
            Number(first?.longitude ?? -6.26031),
          ]}
          zoom={16}
          style={{ height: "34rem", width: "100%" }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {locations.map((location) => (
            <Marker
              key={location.id}
              position={[Number(location.latitude), Number(location.longitude)]}
              icon={markerIcon}
            >
              <Popup>
                <div className="space-y-2">
                  <div className="font-semibold">{location.name}</div>
                  <div className="text-sm">{location.tag}</div>
                  {location.description ? (
                    <div className="text-sm">{location.description}</div>
                  ) : null}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <aside className="space-y-4">
        {locations.map((location) => (
          <div key={location.id} className="card p-5">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full bg-red-500" />
              <h2 className="font-semibold">{location.name}</h2>
            </div>
            <p className="mt-2 text-sm font-medium text-slate-700">{location.tag}</p>
            <p className="mt-2 text-sm text-slate-600">{location.description}</p>
          </div>
        ))}
      </aside>
    </div>
  );
}