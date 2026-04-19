"use client";

import { Settings2 } from "lucide-react";
import { useAccessibility } from "@/components/accessibility-provider";

export function AccessibilityPanel() {
  const { preferences, setHighContrast, setTextScale } = useAccessibility();

  return (
    <details className="relative">
      <summary
        className="btn-secondary cursor-pointer px-3 py-2"
        aria-label="Accessibility settings"
      >
        <Settings2 className="h-5 w-5" />
      </summary>

      <div className="card absolute right-0 z-40 mt-3 w-80 p-5">
        <h2 className="text-lg font-semibold">Accessibility settings</h2>

        <div className="mt-5 space-y-5">
          <label className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium">High contrast mode</span>
            <input
              type="checkbox"
              checked={preferences.high_contrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              className="h-5 w-5"
            />
          </label>

          <div>
            <label htmlFor="text-scale" className="label">
              Text size
            </label>
            <select
              id="text-scale"
              className="input"
              value={preferences.text_scale}
              onChange={(e) =>
                setTextScale(e.target.value as "sm" | "base" | "lg")
              }
            >
              <option value="sm">Smaller</option>
              <option value="base">Default</option>
              <option value="lg">Larger</option>
            </select>
          </div>
        </div>
      </div>
    </details>
  );
}