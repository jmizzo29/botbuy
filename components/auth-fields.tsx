"use client";

import { useEffect } from "react";

/** Clerk ships light-mode placeholders and no email autofill. Fix the live fields. */
export function AuthFields() {
  useEffect(() => {
    function fix() {
      const root = document.querySelector(".bb-auth-shell");
      if (!root) return;
      root.querySelectorAll(".cl-header, .cl-headerTitle, .cl-headerSubtitle, .cl-logoBox, .cl-logoImage").forEach((el) => {
        const node = el as HTMLElement;
        node.style.setProperty("display", "none", "important");
        node.style.setProperty("height", "0", "important");
        node.style.setProperty("overflow", "hidden", "important");
        node.style.setProperty("visibility", "hidden", "important");
      });
      root.querySelectorAll("input").forEach((node) => {
        const input = node as HTMLInputElement;
        const name = input.name;
        if (name === "emailAddress" || name === "identifier") {
          if (input.placeholder !== "you@email.com") input.placeholder = "you@email.com";
          if (input.autocomplete !== "email") input.autocomplete = "email";
          if (input.inputMode !== "email") input.inputMode = "email";
        }
        if (name === "password") {
          const next =
            input.autocomplete === "new-password" ? "8+ characters" : "Your password";
          if (input.placeholder !== next) input.placeholder = next;
        }
      });
    }
    fix();
    const obs = new MutationObserver(fix);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, []);
  return null;
}
