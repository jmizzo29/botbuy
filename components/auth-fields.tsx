"use client";

import { useEffect } from "react";
import {
  AUTH_EMAIL_LABEL,
  AUTH_EMAIL_PLACEHOLDER,
  AUTH_REQUEST_CTA,
} from "@/lib/auth-copy";

/** Clerk ships light placeholders and stock labels. Keep A1 copy on the live fields. */
export function AuthFields() {
  useEffect(() => {
    function hideNode(el: Element) {
      const node = el as HTMLElement;
      node.style.setProperty("display", "none", "important");
      node.style.setProperty("height", "0", "important");
      node.style.setProperty("overflow", "hidden", "important");
      node.style.setProperty("visibility", "hidden", "important");
    }

    function fix() {
      const root = document.querySelector(".bb-auth-shell");
      if (!root) return;
      const request = root.getAttribute("data-auth-screen") === "request";

      root
        .querySelectorAll(
          ".cl-header, .cl-headerTitle, .cl-headerSubtitle, .cl-logoBox, .cl-logoImage, .cl-footer, .cl-footerAction, .cl-footerPages, .cl-badge",
        )
        .forEach(hideNode);

      document
        .querySelectorAll("[class*='cl-'], [data-localization-key]")
        .forEach((el) => {
          const text = (el.textContent || "").replace(/\s+/g, " ").trim();
          if (
            text === "Development mode" ||
            text === "Development" ||
            text === "Secured by Clerk"
          ) {
            hideNode(el);
          }
        });

      if (request) {
        const passwordOpen = root.getAttribute("data-auth-password") === "open";
        root.querySelectorAll(".cl-formFieldRow__password input[name='password']").forEach((node) => {
          const input = node as HTMLInputElement;
          input.required = passwordOpen;
          input.tabIndex = passwordOpen ? 0 : -1;
        });
        root.querySelectorAll(".cl-formButtonPrimary").forEach((el) => {
          const button = el as HTMLElement;
          if (button.getAttribute("aria-label") !== AUTH_REQUEST_CTA) {
            button.setAttribute("aria-label", AUTH_REQUEST_CTA);
          }
        });
      }

      root.querySelectorAll(".cl-formFieldLabel, [data-localization-key^='formFieldLabel__email']").forEach((el) => {
        const node = el as HTMLElement;
        const text = (node.textContent || "").replace(/\s+/g, " ").trim();
        if (text === AUTH_EMAIL_LABEL || !/^email address/i.test(text)) return;
        if (node.childElementCount === 0) {
          node.textContent = AUTH_EMAIL_LABEL;
          return;
        }
        node.childNodes.forEach((child) => {
          if (
            child.nodeType === Node.TEXT_NODE &&
            /email address/i.test(child.textContent || "")
          ) {
            child.textContent = AUTH_EMAIL_LABEL;
          }
          if (child.nodeType === Node.ELEMENT_NODE) {
            const inner = child as HTMLElement;
            if (
              inner.childElementCount === 0 &&
              /^email address/i.test((inner.textContent || "").trim())
            ) {
              inner.textContent = AUTH_EMAIL_LABEL;
            }
          }
        });
      });

      root.querySelectorAll("input").forEach((node) => {
        const input = node as HTMLInputElement;
        const name = input.name;
        if (name === "emailAddress" || name === "identifier") {
          if (input.placeholder !== AUTH_EMAIL_PLACEHOLDER) {
            input.placeholder = AUTH_EMAIL_PLACEHOLDER;
          }
          if (input.autocomplete !== "email") input.autocomplete = "email";
          if (input.inputMode !== "email") input.inputMode = "email";
        }
      });
    }

    function onPrimaryClick(event: MouseEvent) {
      const root = document.querySelector(".bb-auth-shell");
      if (!root || root.getAttribute("data-auth-screen") !== "request") return;
      if (root.getAttribute("data-auth-password") === "open") return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const button = target.closest(".cl-formButtonPrimary");
      if (!button || !root.contains(button)) return;
      const email = root.querySelector(
        "input[name='emailAddress']",
      ) as HTMLInputElement | null;
      if (!email?.value.trim()) return;
      event.preventDefault();
      event.stopPropagation();
      root.setAttribute("data-auth-password", "open");
      const password = root.querySelector(
        "input[name='password']",
      ) as HTMLInputElement | null;
      if (password) {
        password.required = true;
        password.tabIndex = 0;
        password.focus();
      }
    }

    fix();
    const obs = new MutationObserver(fix);
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
    document.addEventListener("click", onPrimaryClick, true);
    return () => {
      obs.disconnect();
      document.removeEventListener("click", onPrimaryClick, true);
    };
  }, []);
  return null;
}
