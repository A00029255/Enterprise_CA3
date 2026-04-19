import { createClient } from "@/lib/supabase/server";
import { CampusMap } from "@/components/campus-map";
import type { MapLocation } from "@/lib/types";

export default async function MapPage() {
  const supabase = await createClient();

  const { data: locations } = await supabase
    .from("map_locations")
    .select("id, name, tag, latitude, longitude, description")
    .order("name");

  return (
    <div className="space-y-8">
      <section className="card p-8">
        <h1 className="page-title">Campus map</h1>
        <p className="page-subtitle">
          Open map with clear tags and visually contrasting markers. Add more
          map points directly in Supabase later.
        </p>
      </section>

      <CampusMap locations={(locations ?? []) as MapLocation[]} />
    </div>
  );
}