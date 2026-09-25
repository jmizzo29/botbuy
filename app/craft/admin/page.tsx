import { AdminChrome } from "@/components/admin-chrome";
import { AdminQuiet } from "@/components/admin-quiet";
import { ADMIN_CRAFT_HREFS, ADMIN_TITLE, adminPanelOf } from "@/lib/admin-quiet";

export const metadata = {
  title: ADMIN_TITLE,
  robots: { index: false, follow: false },
};

export default async function AdminCraftPage({
  searchParams,
}: {
  searchParams: Promise<{ panel?: string }>;
}) {
  const { panel: raw } = await searchParams;
  const panel = adminPanelOf(raw);

  return (
    <AdminChrome
      panel={panel}
      annotate
      doneHref={ADMIN_CRAFT_HREFS.done}
      homeHref={ADMIN_CRAFT_HREFS.done}
    >
      <AdminQuiet panel={panel} hrefs={ADMIN_CRAFT_HREFS} />
    </AdminChrome>
  );
}
