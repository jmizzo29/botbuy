import { AppShell } from "@/components/app-shell";
import {
  QuietDeal,
  QuietNeedsEmpty,
  QuietNeedsList,
  QuietSearchesEmpty,
  QuietSearchesList,
} from "@/components/quiet-desk";
import { quietFont } from "@/lib/quiet-font";
import {
  QUIET_APPROVE,
  QUIET_EXAMPLE_DEAL,
  QUIET_EXAMPLE_NEEDS,
  QUIET_EXAMPLE_SEARCHES,
  QUIET_REJECT,
} from "@/lib/quiet-capital";
import type { User } from "@/lib/types";

const previewUser: User = {
  id: "quiet-preview",
  name: "Preview",
  email: "preview@botbuyer.ai",
  company: "",
  role: "customer",
};

export const metadata = {
  title: "Searches",
  robots: { index: false, follow: false },
};

function ExampleDecision() {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
      <span className="inline-flex min-h-11 items-center justify-center rounded-[8px] bg-[#2DD4BF] text-sm font-semibold text-[#042F2E]">
        {QUIET_APPROVE}
      </span>
      <span className="inline-flex min-h-11 items-center justify-center rounded-[8px] border border-white/30 text-sm font-semibold text-white/90">
        {QUIET_REJECT}
      </span>
    </div>
  );
}

export default async function QuietCraftPage({
  searchParams,
}: {
  searchParams: Promise<{ panel?: string }>;
}) {
  const { panel = "searches-empty" } = await searchParams;
  const path =
    panel === "needs" || panel === "needs-empty"
      ? "/deals"
      : panel === "deal"
        ? "/deals/quiet-example"
        : "/home";
  const needs =
    panel === "needs" || panel === "deal" || panel === "searches" ? 1 : 0;

  let body = <QuietSearchesEmpty />;
  if (panel === "searches") body = <QuietSearchesList rows={QUIET_EXAMPLE_SEARCHES} />;
  if (panel === "needs-empty") body = <QuietNeedsEmpty />;
  if (panel === "needs") body = <QuietNeedsList rows={QUIET_EXAMPLE_NEEDS} />;
  if (panel === "deal") {
    body = <QuietDeal detail={QUIET_EXAMPLE_DEAL} actions={<ExampleDecision />} />;
  }

  return (
    <div className={quietFont.className}>
      <AppShell user={previewUser} needsYouCount={needs} path={path}>
        {body}
      </AppShell>
    </div>
  );
}
