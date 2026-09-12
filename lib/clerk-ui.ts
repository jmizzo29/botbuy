/** Techlux light — Clerk chrome on BotBuy tokens. Soft-signal HOLD. */
export const CLERK_APPEARANCE = {
  variables: {
    colorPrimary: "#2DD4BF",
    colorBackground: "#FFFFFF",
    colorNeutral: "#0A0A0A",
    colorText: "#0A0A0A",
    colorTextSecondary: "#737373",
    colorDanger: "#E11D48",
    colorSuccess: "#059669",
    borderRadius: "999px",
  },
  elements: {
    rootBox: "w-full",
    card: "w-full border-0 bg-transparent p-0 shadow-none ring-0",
    cardBox: "w-full shadow-none",
    footer: "bg-transparent",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    formFieldInput:
      "h-12 rounded-full border-0 bg-background px-5 text-[15px] text-[#0A0A0A] ring-1 ring-[rgba(0,0,0,0.07)]",
    formButtonPrimary:
      "h-12 w-full rounded-full bg-[#2DD4BF] text-[#042F2E] shadow-none hover:bg-[#5EEAD4]",
    socialButtonsBlockButton:
      "h-12 rounded-full bg-surface text-[#0A0A0A] shadow-none ring-1 ring-[rgba(0,0,0,0.07)]",
    footerActionLink: "text-[#0A0A0A] underline-offset-2",
  },
};
