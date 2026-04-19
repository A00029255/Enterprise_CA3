"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { TimetableEntry, TimetableGroup } from "@/lib/types";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const hours = Array.from({ length: 9 }, (_, index) => index + 8);

function getMonday(date: Date) {
  const cloned = new Date(date);
  const day = cloned.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  cloned.setDate(cloned.getDate() + diff);
  cloned.setHours(0, 0, 0, 0);
  return cloned;
}

function formatDay(date: Date) {
  return new Intl.DateTimeFormat("en-IE", {
    day: "numeric",
    month: "short",
  }).format(date);
}

export function TimetableView({
  groups,
  entries,
  initialGroupId,
  userId,
}: {
  groups: TimetableGroup[];
  entries: TimetableEntry[];
  initialGroupId: string;
  userId: string | null;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedGroupId, setSelectedGroupId] = useState(initialGroupId);
  const [saving, setSaving] = useState(false);

  const monday = getMonday(new Date());
  monday.setDate(monday.getDate() + weekOffset * 7);

  const days = weekdays.map((label, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return {
      label,
      formatted: formatDay(date),
      dayOfWeek: index + 1,
    };
  });

  const visibleEntries = entries.filter((entry) => entry.group_id === selectedGroupId);

  const savePreferredGroup = async (groupId: string) => {
    if (!userId) return;

    setSaving(true);
    await supabase
      .from("profiles")
      .update({ selected_timetable_group_id: groupId })
      .eq("id", userId);
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="page-title">Timetable</h1>
            <p className="page-subtitle">
              Week view from 08:00 to 17:00. Students can view all groups and
              save one preferred timetable group to their profile.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-[auto_auto]">
            <div>
              <label htmlFor="group-select" className="label">
                Timetable group
              </label>
              <select
                id="group-select"
                className="input"
                value={selectedGroupId}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedGroupId(value);
                  void savePreferredGroup(value);
                }}
              >
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.code} · {group.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => setWeekOffset((current) => current - 1)}
                className="btn-secondary"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous week
              </button>
              <button
                type="button"
                onClick={() => setWeekOffset((current) => current + 1)}
                className="btn-secondary"
              >
                Next week
                <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {userId ? (
          <p className="mt-4 text-sm text-slate-600">
            {saving ? "Saving preferred group..." : "Preferred group is saved to your account."}
          </p>
        ) : (
          <p className="mt-4 text-sm text-slate-600">
            Sign in to save one timetable group to your account.
          </p>
        )}
      </div>

      <div className="card overflow-x-auto">
        <table className="min-w-full border-collapse">
          <caption className="sr-only">Weekly timetable</caption>
          <thead>
            <tr>
              <th className="border-b p-4 text-left">Time</th>
              {days.map((day) => (
                <th key={day.label} className="border-b p-4 text-left">
                  <div className="font-semibold">{day.label}</div>
                  <div className="text-sm text-slate-500">{day.formatted}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((hour) => (
              <tr key={hour} className="align-top">
                <th className="border-b p-4 text-left text-sm font-semibold">
                  {String(hour).padStart(2, "0")}:00
                </th>

                {days.map((day) => {
                  const cellEntries = visibleEntries.filter(
                    (entry) =>
                      entry.day_of_week === day.dayOfWeek &&
                      Number(entry.start_time.slice(0, 2)) === hour,
                  );

                  return (
                    <td key={`${hour}-${day.label}`} className="border-b p-3">
                      {cellEntries.length === 0 ? (
                        <div className="min-h-24 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-3 text-sm text-slate-400">
                          Free
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {cellEntries.map((entry) => (
                            <article
                              key={entry.id}
                              className="min-h-24 rounded-2xl border border-blue-200 bg-blue-50 p-3"
                            >
                              <div className="text-sm font-semibold">
                                {entry.module_code}
                              </div>
                              <div className="mt-1 text-sm">{entry.module_name}</div>
                              <div className="mt-2 text-xs text-slate-600">
                                {entry.start_time.slice(0, 5)}–{entry.end_time.slice(0, 5)}
                              </div>
                              <div className="text-xs text-slate-600">
                                {entry.lecturer_name}
                              </div>
                              <div className="text-xs text-slate-600">
                                {entry.room_name}
                              </div>
                            </article>
                          ))}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}