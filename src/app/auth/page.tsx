"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        setMessage(error.message);
        setBusy(false);
        return;
      }

      if (data.session) {
        router.push("/account");
        router.refresh();
      } else {
        setMessage("Account created. Check your email if confirmation is enabled.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        setBusy(false);
        return;
      }

      router.push("/account");
      router.refresh();
    }

    setBusy(false);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <section className="card p-8 sm:p-10">
          <span className="badge">Account access</span>
          <h1 className="mt-5 text-3xl font-bold">Sign up or log in</h1>
          <p className="mt-3 max-w-xl text-slate-600">
            Signed-in students can save event interest, choose a timetable
            group, join societies, receive society notifications, and manage
            accessibility preferences.
          </p>
        </section>

        <section className="card p-8">
          <div className="mb-6 flex gap-2 rounded-2xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-2xl px-4 py-2 font-medium ${
                mode === "signup" ? "bg-white shadow-sm" : ""
              }`}
            >
              Sign up
            </button>
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-2xl px-4 py-2 font-medium ${
                mode === "login" ? "bg-white shadow-sm" : ""
              }`}
            >
              Log in
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {mode === "signup" ? (
              <div>
                <label htmlFor="name" className="label">
                  Full name
                </label>
                <input
                  id="name"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            ) : null}

            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
            </div>

            <button type="submit" disabled={busy} className="btn-primary w-full">
              {busy
                ? "Please wait..."
                : mode === "signup"
                  ? "Create account"
                  : "Log in"}
            </button>

            <div className="flex items-center justify-between gap-4 text-sm">
              <Link href="/auth/update-password" className="text-blue-700 underline">
                Update password page
              </Link>
              <Link href="/auth?forgot=1" className="text-blue-700 underline">
                Forgot password
              </Link>
            </div>

            {message ? (
              <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm">{message}</p>
            ) : null}
          </form>

          <PasswordResetRequest />
        </section>
      </div>
    </div>
  );
}

function PasswordResetRequest() {
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const onReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    const redirectTo = `${window.location.origin}/auth/update-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    setMessage(error ? error.message : "Password reset email sent.");
    setBusy(false);
  };

  return (
    <div className="mt-8 border-t border-slate-200 pt-6">
      <h2 className="text-lg font-semibold">Forgot password</h2>
      <p className="mt-2 text-sm text-slate-600">
        Send a password reset email to yourself.
      </p>

      <form onSubmit={onReset} className="mt-4 space-y-4">
        <input
          type="email"
          className="input"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={busy} className="btn-secondary w-full">
          {busy ? "Sending..." : "Send reset email"}
        </button>
        {message ? <p className="text-sm">{message}</p> : null}
      </form>
    </div>
  );
}