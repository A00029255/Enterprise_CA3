import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EventInterestButton } from "@/components/event-interest-button";

export default async function EventsPage() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("start_at", { ascending: true });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let interestedIds = new Set<string>();

  if (user) {
    const { data: interests } = await supabase
      .from("event_interests")
      .select("event_id")
      .eq("user_id", user.id);

    interestedIds = new Set((interests ?? []).map((item) => item.event_id));
  }

  return (
    <div className="space-y-8">
      <section className="card p-8">
        <h1 className="page-title">Events</h1>
        <p className="page-subtitle">
          Browse campus events, open a full detail page, and save whether you
          are interested. New events can be added directly in Supabase.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {(events ?? []).map((event) => (
          <article key={event.id} className="card overflow-hidden">
            <img
              src={event.image_url}
              alt={event.name}
              className="h-56 w-full object-cover"
            />
            <div className="p-6">
              <span className="badge">{event.tag}</span>
              <h2 className="mt-4 text-xl font-semibold">{event.name}</h2>
              <p className="mt-2 text-sm text-slate-600">{event.short_description}</p>
              <dl className="mt-4 space-y-2 text-sm text-slate-600">
                <div>
                  <dt className="sr-only">Date and time</dt>
                  <dd>
                    {new Date(event.start_at).toLocaleString("en-IE", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">Location</dt>
                  <dd>{event.location}</dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/events/${event.id}`} className="btn-secondary">
                  View details
                </Link>
                <EventInterestButton
                  eventId={event.id}
                  userId={user?.id ?? null}
                  initialInterested={interestedIds.has(event.id)}
                />
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}