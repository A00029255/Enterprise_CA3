"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  href: string | null;
  is_read: boolean;
  created_at: string;
};

export function NotificationsList({
  userId,
  initialNotifications,
}: {
  userId: string;
  initialNotifications: NotificationItem[];
}) {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);
  const supabase = useMemo(() => createClient(), []);

  const markAsRead = async (id: string) => {
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id)
      .eq("user_id", userId);

    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, is_read: true } : item,
      ),
    );
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((item) => !item.is_read).map((item) => item.id);
    if (!unreadIds.length) return;

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", unreadIds)
      .eq("user_id", userId);

    setNotifications((current) =>
      current.map((item) => ({ ...item, is_read: true })),
    );
  };

  return (
    <div className="card p-6" id="notifications">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <button type="button" onClick={markAllAsRead} className="btn-secondary">
          Mark all as read
        </button>
      </div>

      <div className="mt-5 space-y-4">
        {notifications.length === 0 ? (
          <p className="text-sm text-slate-600">No notifications yet.</p>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className="soft-card flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{item.title}</h3>
                  {!item.is_read ? (
                    <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                      New
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-slate-600">{item.body}</p>
                {item.href ? (
                  <a href={item.href} className="mt-2 inline-block text-sm font-medium text-blue-700 underline">
                    Open
                  </a>
                ) : null}
              </div>

              {!item.is_read ? (
                <button
                  type="button"
                  onClick={() => markAsRead(item.id)}
                  className="btn-secondary"
                >
                  Mark read
                </button>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}