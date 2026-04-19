import type { Metadata } from "next";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { AccessibilityProvider } from "@/components/accessibility-provider";
import { SiteHeader } from "@/components/site-header";
import type { AccessibilityPreferences } from "@/lib/types";

export const metadata: Metadata = {
  title: "Campus Companion",
  description: "Accessible student companion for first-year students",
};

const defaultPreferences: AccessibilityPreferences = {
  high_contrast: false,
  text_scale: "base",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initialPreferences = defaultPreferences;

  if (user) {
    const { data } = await supabase
      .from("accessibility_preferences")
      .select("high_contrast, text_scale")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      initialPreferences = data as AccessibilityPreferences;
    }
  }

  return (
    <html lang="en">
      <body>
        <AccessibilityProvider
          initialPreferences={initialPreferences}
          userId={user?.id ?? null}
        >
          <div className="min-h-screen">
            <SiteHeader />
            <main className="container-shell py-8">{children}</main>
          </div>
        </AccessibilityProvider>
      </body>
    </html>
  );
}