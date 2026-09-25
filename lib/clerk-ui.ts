import {
  AUTH_EMAIL_LABEL,
  AUTH_EMAIL_PLACEHOLDER,
  AUTH_GOOGLE_LABEL,
  AUTH_LOGIN_ALT_LEAD,
  AUTH_LOGIN_ALT_LINK,
  AUTH_LOGIN_H1,
  AUTH_LOGIN_SUB,
  AUTH_OR,
  AUTH_REQUEST_ALT_LEAD,
  AUTH_REQUEST_ALT_LINK,
  AUTH_REQUEST_H1,
  AUTH_REQUEST_SUB,
} from "@/lib/auth-copy";

/** Quiet Capital A1. Panel is ours; Clerk card stays flush and transparent. */
export const CLERK_APPEARANCE = {
  options: {
    elevation: "flush" as const,
    socialButtonsPlacement: "top" as const,
    socialButtonsVariant: "blockButton" as const,
    logoPlacement: "none" as const,
    privacyPageUrl: "/privacy",
    termsPageUrl: "/terms",
    unsafe_disableDevelopmentModeWarnings: true,
    shimmer: false,
  },
  layout: {
    socialButtonsPlacement: "top" as const,
    socialButtonsVariant: "blockButton" as const,
    logoPlacement: "none" as const,
    privacyPageUrl: "/privacy",
    termsPageUrl: "/terms",
    unsafe_disableDevelopmentModeWarnings: true,
    shimmer: false,
  },
  variables: {
    colorPrimary: "#2DD4BF",
    colorBackground: "#0B1F3A",
    colorNeutral: "#F7F8FA",
    colorText: "#F7F8FA",
    colorTextSecondary: "rgba(247,248,250,0.62)",
    colorTextOnPrimaryBackground: "#042F2E",
    colorInputBackground: "#081422",
    colorInputText: "#F7F8FA",
    colorDanger: "#FB7185",
    colorSuccess: "#2DD4BF",
    borderRadius: "8px",
    fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
    fontSize: "16px",
  },
  elements: {
    rootBox: "bb-clerk-root w-full max-w-full",
    card: "bb-clerk-card w-full max-w-full border-0 bg-transparent p-0 shadow-none ring-0",
    cardBox: "bb-clerk-cardbox w-full max-w-full shadow-none",
    main: "bb-clerk-main w-full max-w-full",
    header: "hidden",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    logoBox: "hidden",
    logoImage: "hidden",
    footer: "hidden",
    footerAction: "hidden",
    footerActionText: "hidden",
    footerActionLink: "hidden",
    footerPages: "hidden",
    footerPagesLink: "hidden",
    badge: "hidden",
    formFieldLabel: "bb-clerk-label text-[13px] font-medium text-white/75",
    formFieldInput:
      "bb-clerk-input h-12 rounded-[8px] border border-white/15 bg-[#081422] px-3.5 text-base text-[#F7F8FA] shadow-none placeholder:text-white/40",
    formButtonPrimary:
      "bb-clerk-primary h-12 w-full rounded-[8px] bg-[#2DD4BF] text-[#042F2E] shadow-none hover:bg-[#5EEAD4]",
    socialButtonsBlockButton:
      "bb-clerk-google h-12 rounded-[8px] border border-white/20 bg-transparent text-[#F7F8FA] shadow-none",
    socialButtonsBlockButtonText: "text-[#F7F8FA] font-medium",
    dividerLine: "bg-white/12",
    dividerText: "text-[12px] text-white/40",
    formFieldInputShowPasswordButton: "text-white/50",
    identityPreview: "bg-transparent ring-1 ring-white/15",
    identityPreviewText: "text-[#F7F8FA]",
    identityPreviewEditButton: "text-[#5EEAD4]",
    formFieldErrorText: "text-[#fb7185]",
    alert: "rounded-[8px] bg-white/[0.06] text-[#F7F8FA] ring-1 ring-white/12",
  },
};

/**
 * Clerk 7 localization lives on ClerkProvider, not SignIn/SignUp.
 * Request access paints its primary through auth CSS so Log in can keep Continue.
 */
export const CLERK_AUTH_LOCALIZATION = {
  socialButtonsBlockButton: AUTH_GOOGLE_LABEL.replace(
    "Google",
    "{{provider|titleize}}",
  ),
  dividerText: AUTH_OR,
  formFieldLabel__emailAddress: AUTH_EMAIL_LABEL,
  formFieldLabel__emailAddress_username: AUTH_EMAIL_LABEL,
  formFieldInputPlaceholder__emailAddress: AUTH_EMAIL_PLACEHOLDER,
  formFieldInputPlaceholder__emailAddress_username: AUTH_EMAIL_PLACEHOLDER,
  signIn: {
    start: {
      title: AUTH_LOGIN_H1,
      titleCombined: AUTH_LOGIN_H1,
      subtitle: AUTH_LOGIN_SUB,
      subtitleCombined: AUTH_LOGIN_SUB,
      actionText: AUTH_LOGIN_ALT_LEAD,
      actionLink: AUTH_LOGIN_ALT_LINK,
    },
  },
  signUp: {
    start: {
      title: AUTH_REQUEST_H1,
      titleCombined: AUTH_REQUEST_H1,
      subtitle: AUTH_REQUEST_SUB,
      subtitleCombined: AUTH_REQUEST_SUB,
      actionText: AUTH_REQUEST_ALT_LEAD,
      actionLink: AUTH_REQUEST_ALT_LINK,
    },
  },
};
