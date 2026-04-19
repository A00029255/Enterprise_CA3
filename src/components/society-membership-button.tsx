"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SocietyMembershipButton({
  societyId,
  userId,
  initialJoined,
}: {
  societyId: string;
  userId: string | null;
  initialJoined: boolean;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [joined, setJoined] = useState(initialJoined);
  const [busy, setBusy] = useState(false);

  const onToggle = async () => {
    if (!userId) {
      router.push("/auth");
      return;
    }

    setBusy(true);

    if (joined) {
      await supabase
        .from("society_memberships")
        .delete()
        .eq("society_id", societyId)
        .eq("user_id", userId);
      setJoined(false);
    } else {
      await supabase.from("society_memberships").insert({
        society_id: societyId,
        user_id: userId,
      });
      setJoined(true);
    }

    setBusy(false);
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={busy}
      aria-pressed={joined}
      className={joined ? "btn-primary" : "btn-secondary"}
    >
      {busy ? "Saving..." : joined ? "Joined" : "Join society"}
    </button>
  );
}