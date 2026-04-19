import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NotificationsList } from "@/components/notifications-list";

export default async function AccountPage() {
  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub as string | undefined;

  if (!userId) {
    redirect("/auth");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, selected_timetable_group_id")
    .eq("id", userId)
    .single();

  const { data: selectedGroup } = profile?.selected_timetable_group_id
    ? await supabase
        .from("timetable_groups")
        .select("code, title")
        .eq("id", profile.selected_timetable_group_id)
        .single()
    : { data: null };

  const { data: memberships } = await supabase
    .from("society_memberships")
    .select("id, societies(name)")
    .eq("user_id", userId);

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, title, body, href, is_read, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <section className="card p-8">
        <h1 className="page-title">My account</h1>
        <p className="page-subtitle">
          View your account details, joined societies, selected timetable group,
          and notifications.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-xl font-semibold">Profile</h2>
          <dl className="mt-5 space-y-4">
            <div>
              <dt className="text-sm font-medium text-slate-500">Name</dt>
              <dd className="mt-1 font-medium">{profile?.full_name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Email</dt>
              <dd className="mt-1 font-medium">{user?.email ?? profile?.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Selected timetable group</dt>
              <dd className="mt-1 font-medium">
                {selectedGroup ? `${selectedGroup.code} · ${selectedGroup.title}` : "Not selected yet"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold">Joined societies</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {memberships && memberships.length > 0 ? (
              memberships.map((membership: any) => (
                <span key={membership.id} className="badge">
                  {membership.societies?.name ?? "Society"}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-600">You have not joined any societies yet.</p>
            )}
          </div>
        </div>
      </section>

      <NotificationsList
        userId={userId}
        initialNotifications={(notifications ?? []) as any[]}
      />
    </div>
  );
}