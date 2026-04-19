import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SocietyMembershipButton } from "@/components/society-membership-button";
import { SocietyEventInterestButton } from "@/components/society-event-interest-button";

export default async function SocietiesPage() {
  const supabase = await createClient();

  const { data: societies } = await supabase
    .from("societies")
    .select("*")
    .order("name");

  const { data: societyEvents } = await supabase
    .from("society_events")
    .select("*")
    .order("start_at", { ascending: true });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let joinedSocietyIds = new Set<string>();
  let interestedSocietyEventIds = new Set<string>();

  if (user) {
    const { data: memberships } = await supabase
      .from("society_memberships")
      .select("society_id")
      .eq("user_id", user.id);

    const { data: interests } = await supabase
      .from("society_event_interests")
      .select("society_event_id")
      .eq("user_id", user.id);

    joinedSocietyIds = new Set((memberships ?? []).map((item) => item.society_id));
    interestedSocietyEventIds = new Set(
      (interests ?? []).map((item) => item.society_event_id),
    );
  }

  return (
    <div className="space-y-8">
      <section className="card p-8">
        <h1 className="page-title">Society events</h1>
        <p className="page-subtitle">
          Students can join one or more societies, browse all society events,
          and receive notifications only for societies they joined.
        </p>
      </section>

      <section className="space-y-8">
        {(societies ?? []).map((society) => {
          const items = (societyEvents ?? []).filter(
            (event) => event.society_id === society.id,
          );

          return (
            <article key={society.id} className="card overflow-hidden">
              <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
                <img
                  src={society.hero_image_url}
                  alt={society.name}
                  className="h-full min-h-72 w-full object-cover"
                />

                <div className="p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="badge">{society.tag}</span>
                    <SocietyMembershipButton
                      societyId={society.id}
                      userId={user?.id ?? null}
                      initialJoined={joinedSocietyIds.has(society.id)}
                    />
                  </div>

                  <h2 className="mt-5 text-2xl font-semibold">{society.name}</h2>
                  <p className="mt-3 max-w-2xl text-slate-600">
                    {society.description}
                  </p>

                  <div className="mt-8 space-y-4">
                    {items.map((event) => (
                      <article
                        key={event.id}
                        className="soft-card overflow-hidden"
                      >
                        <div className="grid gap-0 md:grid-cols-[220px_1fr]">
                          <img
                            src={event.image_url}
                            alt={event.name}
                            className="h-full min-h-52 w-full object-cover"
                          />

                          <div className="p-5">
                            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="text-lg font-semibold">
                                    {event.name}
                                  </h3>
                                  <span className="badge">{event.tag}</span>
                                </div>

                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                  {event.short_description}
                                </p>

                                <div className="mt-3 text-sm text-slate-600">
                                  {new Date(event.start_at).toLocaleString(
                                    "en-IE",
                                    {
                                      dateStyle: "medium",
                                      timeStyle: "short",
                                    },
                                  )}{" "}
                                  · {event.location}
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-3">
                                <Link
                                  href={`/societies/events/${event.id}`}
                                  className="btn-secondary"
                                >
                                  View details
                                </Link>

                                <SocietyEventInterestButton
                                  societyEventId={event.id}
                                  userId={user?.id ?? null}
                                  initialInterested={interestedSocietyEventIds.has(
                                    event.id,
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}

                    {items.length === 0 ? (
                      <p className="text-sm text-slate-600">
                        No events added for this society yet.
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}