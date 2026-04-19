"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function EventInterestButton({
  eventId,
  userId,
  initialInterested,
}: {
  eventId: string;
  userId: string | null;
  initialInterested: boolean;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [interested, setInterested] = useState(initialInterested);
  const [busy, setBusy] = useState(false);

  const onToggle = async () => {
    if (!userId) {
      router.push("/auth");
      return;
    }

    setBusy(true);

    if (interested) {
      await supabase
        .from("event_interests")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", userId);
      setInterested(false);
    } else {
      await supabase.from("event_interests").insert({
        event_id: eventId,
        user_id: userId,
      });
      setInterested(true);
    }

    setBusy(false);
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={busy}
      aria-pressed={interested}
      className={interested ? "btn-primary" : "btn-secondary"}
    >
      {busy ? "Saving..." : interested ? "Interested" : "I'm interested"}
    </button>
  );
}