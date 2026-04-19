"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { AccessibilityPreferences, TextScale } from "@/lib/types";

type AccessibilityContextValue = {
  preferences: AccessibilityPreferences;
  setHighContrast: (value: boolean) => void;
  setTextScale: (value: TextScale) => void;
};

const AccessibilityContext = createContext<
  AccessibilityContextValue | undefined
>(undefined);

export function AccessibilityProvider({
  children,
  initialPreferences,
  userId,
}: {
  children: ReactNode;
  initialPreferences: AccessibilityPreferences;
  userId: string | null;
}) {
  const [preferences, setPreferences] =
    useState<AccessibilityPreferences>(initialPreferences);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const saved = window.localStorage.getItem("cc_accessibility");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as AccessibilityPreferences;
      setPreferences(parsed);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.dataset.contrast = preferences.high_contrast
      ? "high"
      : "default";
    document.documentElement.dataset.textScale = preferences.text_scale;
    window.localStorage.setItem(
      "cc_accessibility",
      JSON.stringify(preferences),
    );

    if (!userId) return;

    const save = async () => {
      await supabase.from("accessibility_preferences").upsert(
        {
          user_id: userId,
          high_contrast: preferences.high_contrast,
          text_scale: preferences.text_scale,
        },
        { onConflict: "user_id" },
      );
    };

    void save();
  }, [preferences, userId, supabase]);

  return (
    <AccessibilityContext.Provider
      value={{
        preferences,
        setHighContrast: (value) =>
          setPreferences((current) => ({ ...current, high_contrast: value })),
        setTextScale: (value) =>
          setPreferences((current) => ({ ...current, text_scale: value })),
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);

  if (!context) {
    throw new Error("useAccessibility must be used inside AccessibilityProvider");
  }

  return context;
}