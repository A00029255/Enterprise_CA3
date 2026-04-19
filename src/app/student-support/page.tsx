import { createClient } from "@/lib/supabase/server";
import { SupportClient } from "@/components/support-client";

export default async function StudentSupportPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-8">
      <section className="card p-8">
        <h1 className="page-title">Student support</h1>
        <p className="page-subtitle">
          Lost and Found and Helpdesk live on one page with a sidebar switcher.
          Submitted records go into Supabase.
        </p>
      </section>

      <SupportClient userId={user?.id ?? null} email={user?.email ?? null} />
    </div>
  );
}