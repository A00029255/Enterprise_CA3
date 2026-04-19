import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AccessibilityPanel } from "@/components/accessibility-panel";
import { AccountMenu } from "@/components/account-menu";
import { NotificationBell } from "@/components/notification-bell";

const links = [
  { href: "/timetable", label: "Timetable" },
  { href: "/events", label: "Events" },
  { href: "/societies", label: "Society Events" },
  { href: "/map", label: "Map" },
  { href: "/student-support", label: "Support" },
];

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let unreadCount = 0;

  if (user) {
    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    unreadCount = count ?? 0;
  }

  return (
    <header className="border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="container-shell flex min-h-20 flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Campus Companion
          </Link>

          <nav aria-label="Primary navigation" className="hidden gap-2 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {user ? <AccountMenu /> : <Link href="/auth" className="btn-secondary">Login / Sign up</Link>}
          {user ? (
            <NotificationBell userId={user.id} initialUnreadCount={unreadCount} />
          ) : null}
          <AccessibilityPanel />
        </div>

        <nav aria-label="Mobile navigation" className="flex flex-wrap gap-2 lg:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}