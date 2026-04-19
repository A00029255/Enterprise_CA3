import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EventInterestButton } from "@/components/event-interest-button";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase.from("events").select("*").eq("id", id).single();

  if (!event) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let interested = false;

  if (user) {
    const { data } = await supabase
      .from("event_interests")
      .select("id")
      .eq("event_id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    interested = Boolean(data);
  }

  const { count } = await supabase
    .from("event_interests")
    .select("*", { count: "exact", head: true })
    .eq("event_id", id);

  return (
    <div className="space-y-8">
      <img
        src={event.image_url}
        alt={event.name}
        className="card h-[24rem] w-full object-cover"
      />

      <section className="card p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="badge">{event.tag}</span>
          <span className="badge">{count ?? 0} interested</span>
        </div>

        <h1 className="mt-5 text-3xl font-bold">{event.name}</h1>

        <dl className="mt-5 space-y-2 text-slate-600">
          <div>
            {new Date(event.start_at).toLocaleString("en-IE", {
              dateStyle: "full",
              timeStyle: "short",
            })}
          </div>
          <div>{event.location}</div>
        </dl>

        <p className="mt-6 max-w-3xl leading-7 text-slate-700">{event.description}</p>

        <div className="mt-8">
          <EventInterestButton
            eventId={event.id}
            userId={user?.id ?? null}
            initialInterested={interested}
          />
        </div>
      </section>
    </div>
  );
}