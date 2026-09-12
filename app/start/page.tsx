import { redirect } from "next/navigation";
import { MY_DEALS_HREF } from "@/lib/cpo-techlux";
import { hasPublicSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "BotBuyer",
};

/** Installed start: My deals if signed in, else land. */
export default async function InstalledStartPage() {
  if (await hasPublicSession()) redirect(MY_DEALS_HREF);
  redirect("/");
}
