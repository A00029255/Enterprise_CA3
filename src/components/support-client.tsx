"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type TabKey = "lost-found" | "helpdesk";

export function SupportClient({
  userId,
  email,
}: {
  userId: string | null;
  email: string | null;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [tab, setTab] = useState<TabKey>("lost-found");
  const [message, setMessage] = useState("");

  const submitLostFound = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userId) {
      router.push("/auth");
      return;
    }

    const form = new FormData(event.currentTarget);

    const { error } = await supabase.from("lost_found_items").insert({
      user_id: userId,
      item_type: form.get("itemType"),
      title: form.get("title"),
      description: form.get("description"),
      location: form.get("location"),
      contact_email: form.get("contactEmail"),
    });

    setMessage(error ? error.message : "Lost and found item submitted.");
    if (!error) event.currentTarget.reset();
  };

  const submitHelpdesk = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userId) {
      router.push("/auth");
      return;
    }

    const form = new FormData(event.currentTarget);

    const { error } = await supabase.from("helpdesk_messages").insert({
      user_id: userId,
      subject: form.get("subject"),
      category: form.get("category"),
      message: form.get("message"),
    });

    setMessage(error ? error.message : "Helpdesk message submitted.");
    if (!error) event.currentTarget.reset();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.28fr_0.72fr]">
      <aside className="card p-4">
        <button
          type="button"
          onClick={() => setTab("lost-found")}
          className={`mb-2 w-full rounded-2xl px-4 py-3 text-left font-medium ${
            tab === "lost-found" ? "bg-slate-900 text-white" : "bg-slate-100"
          }`}
        >
          Lost and Found
        </button>

        <button
          type="button"
          onClick={() => setTab("helpdesk")}
          className={`w-full rounded-2xl px-4 py-3 text-left font-medium ${
            tab === "helpdesk" ? "bg-slate-900 text-white" : "bg-slate-100"
          }`}
        >
          Helpdesk
        </button>
      </aside>

      <section className="card p-8">
        {tab === "lost-found" ? (
          <>
            <h2 className="text-2xl font-semibold">Lost and Found</h2>
            <p className="mt-3 text-slate-600">
              Students can submit lost or found items. Records are stored in
              Supabase for admin follow-up.
            </p>

            <form onSubmit={submitLostFound} className="mt-6 space-y-5">
              <div>
                <label htmlFor="itemType" className="label">
                  Item type
                </label>
                <select id="itemType" name="itemType" className="input" required>
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </div>

              <div>
                <label htmlFor="title" className="label">
                  Item title
                </label>
                <input id="title" name="title" className="input" required />
              </div>

              <div>
                <label htmlFor="description" className="label">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="input min-h-32"
                  required
                />
              </div>

              <div>
                <label htmlFor="location" className="label">
                  Location
                </label>
                <input id="location" name="location" className="input" required />
              </div>

              <div>
                <label htmlFor="contactEmail" className="label">
                  Contact email
                </label>
                <input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  defaultValue={email ?? ""}
                  className="input"
                  required
                />
              </div>

              <button className="btn-primary" type="submit">
                Submit item
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold">Helpdesk</h2>
            <p className="mt-3 text-slate-600">
              Students can send help messages that go straight into Supabase for
              staff review.
            </p>

            <form onSubmit={submitHelpdesk} className="mt-6 space-y-5">
              <div>
                <label htmlFor="subject" className="label">
                  Subject
                </label>
                <input id="subject" name="subject" className="input" required />
              </div>

              <div>
                <label htmlFor="category" className="label">
                  Category
                </label>
                <select id="category" name="category" className="input" required>
                  <option value="General">General</option>
                  <option value="Technical">Technical</option>
                  <option value="Accessibility">Accessibility</option>
                  <option value="Timetable">Timetable</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="label">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="input min-h-40"
                  required
                />
              </div>

              <button className="btn-primary" type="submit">
                Send message
              </button>
            </form>
          </>
        )}

        {message ? (
          <p className="mt-6 rounded-2xl bg-slate-100 px-4 py-3 text-sm">
            {message}
          </p>
        ) : null}
      </section>
    </div>
  );
}