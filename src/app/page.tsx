import Link from "next/link";
import {
  CalendarDays,
  MapPinned,
  PartyPopper,
  ShieldQuestion,
  Users,
} from "lucide-react";

const cards = [
  {
    href: "/timetable",
    title: "Timetable",
    text: "Weekly academic timetable with group selection and week navigation.",
    icon: CalendarDays,
  },
  {
    href: "/events",
    title: "Events",
    text: "Browse campus events, view details, and save your interest.",
    icon: PartyPopper,
  },
  {
    href: "/societies",
    title: "Society Events",
    text: "Join one or more societies and receive updates about their events.",
    icon: Users,
  },
  {
    href: "/map",
    title: "Map",
    text: "Open campus map with clear tags and high contrast location markers.",
    icon: MapPinned,
  },
  {
    href: "/student-support",
    title: "Lost and Found + Helpdesk",
    text: "Submit support messages and lost or found items through one page.",
    icon: ShieldQuestion,
  },
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="card overflow-hidden p-8 sm:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <span className="badge">Campus Companion</span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              A modern first-year campus app built for clarity and accessibility.
            </h1>
            <p className="page-subtitle">
              Students can sign in, manage their profile, save a timetable
              group, mark interest in events, join societies, receive
              notifications, submit support requests, and use accessibility
              settings from the top-right gear icon.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/auth" className="btn-primary">
                Sign up or log in
              </Link>
              <Link href="/events" className="btn-secondary">
                Explore events
              </Link>
            </div>
          </div>

          <div className="soft-card p-6">
            <h2 className="text-lg font-semibold">What this starter includes</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>Accessible account menu and gear settings</li>
              <li>Supabase auth, profiles, RLS, and saved preferences</li>
              <li>Separate pages for timetable, events, societies, and map</li>
              <li>Shared support page with a sidebar switcher</li>
              <li>Notification bell with unread red dot for signed-in users</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ href, title, text, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="card group p-6 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
              <span className="rounded-2xl bg-slate-100 p-3">
                <Icon className="h-5 w-5" />
              </span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}