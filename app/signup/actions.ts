"use server";

import { redirect } from "next/navigation";
import { persistSignup } from "@/lib/store";

export async function persistSignupAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email.includes("@")) {
    throw new Error("Email required");
  }
  persistSignup(email);
  redirect("/onboarding/intent");
}
