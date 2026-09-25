import { GoliveChrome } from "@/components/golive-chrome";
import { GoliveQuiet } from "@/components/golive-quiet";
import { GO_LIVE_PRIMARY_LABEL } from "@/lib/designer-wire-notes";
import { GOLIVE_EXAMPLE, golivePanelOf } from "@/lib/golive-quiet";

export const metadata = {
  title: "Go live",
  robots: { index: false, follow: false },
};

export default async function GoliveCraftPage({
  searchParams,
}: {
  searchParams: Promise<{ panel?: string }>;
}) {
  const { panel: raw } = await searchParams;
  const panel = golivePanelOf(raw);
  const model = GOLIVE_EXAMPLE[panel];

  return (
    <GoliveChrome
      panel={panel}
      annotate
      homeHref={`/craft/golive?panel=${panel}`}
      settingsHref="/settings"
    >
      <GoliveQuiet
        model={model}
        runLabel={GO_LIVE_PRIMARY_LABEL}
        runHref={panel === "ready" ? "/craft/golive?panel=running" : undefined}
        searchesHref="/craft/quiet?panel=searches"
      />
    </GoliveChrome>
  );
}
