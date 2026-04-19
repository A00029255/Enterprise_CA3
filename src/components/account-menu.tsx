"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AccountMenu() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <details className="relative">
      <summary className="btn-secondary cursor-pointer">My Account</summary>

      <div className="card absolute right-0 z-40 mt-3 w-56 p-2">
        <Link href="/account" className="block rounded-2xl px-4 py-3 hover:bg-slate-50">
          My account
        </Link>
        <Link
          href="/auth"
          className="block rounded-2xl px-4 py-3 hover:bg-slate-50"
        >
          Forgot password
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full rounded-2xl px-4 py-3 text-left hover:bg-slate-50"
        >
          Sign out
        </button>
      </div>
    </details>
  );
}