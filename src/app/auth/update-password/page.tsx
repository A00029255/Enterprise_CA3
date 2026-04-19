"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Password updated.");
    router.push("/account");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="card p-8">
        <h1 className="text-2xl font-bold">Update password</h1>
        <p className="mt-3 text-slate-600">
          Use this page after opening the password reset link.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="new-password" className="label">
              New password
            </label>
            <input
              id="new-password"
              type="password"
              className="input"
              minLength={8}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            Save new password
          </button>

          {message ? <p className="text-sm">{message}</p> : null}
        </form>
      </div>
    </div>
  );
}