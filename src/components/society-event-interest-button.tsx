"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SocietyEventInterestButton({
  societyEventId,
  userId,
  initialInterested,
}: {
  societyEventId: string;
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
        .from("society_event_interests")
        .delete()
        .eq("society_event_id", societyEventId)
        .eq("user_id", userId);
      setInterested(false);
    } else {
      await supabase.from("society_event_interests").insert({
        society_event_id: societyEventId,
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
      {busy ? "Saving..." : interested ? "Interested" : "Interested in event"}
    </button>
  );
}