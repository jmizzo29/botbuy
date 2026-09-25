import { notFound } from "next/navigation";
import { AdminChrome } from "@/components/admin-chrome";
import { AdminQuiet } from "@/components/admin-quiet";
import { isAdmin } from "@/lib/auth";
import {
  ADMIN_SIGNED_IN_HREFS,
  ADMIN_TITLE,
  adminPanelOf,
} from "@/lib/admin-quiet";
import { getOwnerFinance } from "@/lib/finance";

export const metadata = {
  title: ADMIN_TITLE,
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Owner-only. Buyer sessions 404. Not a phone tab — Done returns to the app.
 * CHO finance still runs so a blended burn cannot pass this route.
 */
export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ panel?: string }>;
}) {
  if (!(await isAdmin())) notFound();
  const finance = getOwnerFinance();
  if (finance.customerGmvUsd !== 0) {
    throw new Error("CHO BLOCK: customer GMV must stay 0.");
  }
  const { panel: raw } = await searchParams;
  const panel = adminPanelOf(raw);

  return (
    <AdminChrome
      panel={panel}
      doneHref={ADMIN_SIGNED_IN_HREFS.done}
      homeHref={ADMIN_SIGNED_IN_HREFS.done}
    >
      <AdminQuiet panel={panel} hrefs={ADMIN_SIGNED_IN_HREFS} />
    </AdminChrome>
  );
}
