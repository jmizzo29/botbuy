import { redirect } from "next/navigation";
import { MY_DEALS_HREF } from "@/lib/cpo-techlux";
import { hasPublicSession } from "@/lib/session";

/**
 * Signed-in visitors never see the marketing land fold.
 * Land primary is always Sign up for cold readers.
 * Soft-signal HOLD.
 */
export async function redirectSignedInFromLand() {
  if (await hasPublicSession()) {
    redirect(MY_DEALS_HREF);
  }
}
