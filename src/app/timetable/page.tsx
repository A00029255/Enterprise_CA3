import { createClient } from "@/lib/supabase/server";
import { TimetableView } from "@/components/timetable-view";
import type { TimetableEntry, TimetableGroup } from "@/lib/types";

export default async function TimetablePage() {
  const supabase = await createClient();

  const { data: groups } = await supabase
    .from("timetable_groups")
    .select("id, code, title")
    .order("code");

  const { data: entries } = await supabase
    .from("timetable_entries")
    .select(
      "id, group_id, day_of_week, start_time, end_time, module_code, module_name, lecturer_name, room_name",
    )
    .order("day_of_week")
    .order("start_time");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initialGroupId = groups?.[0]?.id ?? "";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("selected_timetable_group_id")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.selected_timetable_group_id) {
      initialGroupId = profile.selected_timetable_group_id;
    }
  }

  return (
    <TimetableView
      groups={(groups ?? []) as TimetableGroup[]}
      entries={(entries ?? []) as TimetableEntry[]}
      initialGroupId={initialGroupId}
      userId={user?.id ?? null}
    />
  );
}