import { SettingsChrome } from "@/components/settings-chrome";
import { SettingsLogoutSheet, SettingsQuiet } from "@/components/settings-quiet";
import {
  SETTINGS_CRAFT_HREFS,
  SETTINGS_EXAMPLE_EMAIL,
  SETTINGS_TITLE,
  settingsPanelOf,
} from "@/lib/settings-quiet";

export const metadata = {
  title: SETTINGS_TITLE,
  robots: { index: false, follow: false },
};

export default async function SettingsCraftPage({
  searchParams,
}: {
  searchParams: Promise<{ panel?: string }>;
}) {
  const { panel: raw } = await searchParams;
  const panel = settingsPanelOf(raw);

  return (
    <SettingsChrome
      panel={panel}
      annotate
      doneHref={SETTINGS_CRAFT_HREFS.done}
      homeHref={SETTINGS_CRAFT_HREFS.done}
      sheet={
        panel === "logout" ? <SettingsLogoutSheet hrefs={SETTINGS_CRAFT_HREFS} /> : null
      }
    >
      <SettingsQuiet
        panel={panel}
        email={SETTINGS_EXAMPLE_EMAIL}
        exampleAccount
        hrefs={SETTINGS_CRAFT_HREFS}
      />
    </SettingsChrome>
  );
}
