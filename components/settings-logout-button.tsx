"use client";

import { SignOutButton } from "@clerk/nextjs";
import { SETTINGS_LOG_OUT } from "@/lib/settings-quiet";

/** Signed-in confirm. Does not expose an auto-approve control. */
export function SettingsLogoutButton() {
  return (
    <SignOutButton redirectUrl="/">
      <button type="button" className="bb-settings-btn-out" data-settings="logout">
        {SETTINGS_LOG_OUT}
      </button>
    </SignOutButton>
  );
}
