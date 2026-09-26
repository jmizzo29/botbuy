"use client";

import { useState } from "react";
import {
  SETTINGS_NEEDS_YOU_ALERT,
  SETTINGS_NEEDS_YOU_ALERT_HELP,
} from "@/lib/settings-quiet";

/**
 * Track F row + switch. Default on. Opt-out only.
 * Does not flip auto-approve.
 */
export function SettingsNeedsYouAlert({
  initialOn = true,
  persist = false,
}: {
  initialOn?: boolean;
  persist?: boolean;
}) {
  const [on, setOn] = useState(initialOn);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    const next = !on;
    setOn(next);
    if (!persist) return;
    setError(null);
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ needsYouAlerts: next }),
    });
    if (!response.ok) {
      setOn(!next);
      setError("Could not save this alert.");
    }
  }

  return (
    <div className="bb-settings-row">
      <div className="bb-settings-row-copy">
        <p className="bb-settings-row-label" id="bb-needs-you-alert-label">
          {SETTINGS_NEEDS_YOU_ALERT}
        </p>
        <p className="bb-settings-row-meta">{SETTINGS_NEEDS_YOU_ALERT_HELP}</p>
        {error ? <p className="bb-settings-row-meta">{error}</p> : null}
      </div>
      <button
        type="button"
        className={on ? "bb-settings-switch is-on" : "bb-settings-switch"}
        role="switch"
        aria-checked={on}
        aria-labelledby="bb-needs-you-alert-label"
        data-needs-you-alert={on ? "on" : "off"}
        onClick={() => {
          void toggle();
        }}
      >
        <span className="bb-settings-switch-knob" aria-hidden="true" />
      </button>
    </div>
  );
}
