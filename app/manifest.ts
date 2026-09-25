import type { MetadataRoute } from "next";
import { LAND_META_LINE } from "@/lib/brand";
import {
  INSTALLED_START_HREF,
  MY_DEALS_HREF,
  MY_DEALS_LABEL,
} from "@/lib/cpo-techlux";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "BotBuyer",
    short_name: "BotBuyer",
    description: LAND_META_LINE,
    start_url: INSTALLED_START_HREF,
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "browser"],
    background_color: "#0B1F3A",
    theme_color: "#0B1F3A",
    lang: "en",
    prefer_related_applications: false,
    icons: [
      {
        src: "/brand/logo-soft-spine/app-icon/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/logo-soft-spine/app-icon/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/logo-soft-spine/app-icon/app-icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: MY_DEALS_LABEL,
        short_name: MY_DEALS_LABEL,
        url: MY_DEALS_HREF,
      },
      {
        name: "Vault",
        short_name: "Vault",
        url: "/vault",
      },
    ],
  };
}
