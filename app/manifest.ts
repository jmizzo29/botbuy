import type { MetadataRoute } from "next";
import { LAND_META_LINE } from "@/lib/brand";
import { MY_DEALS_HREF, MY_DEALS_LABEL } from "@/lib/cpo-techlux";
import { THEME_BG } from "@/lib/ui-tokens";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "BotBuy",
    short_name: "BotBuy",
    description: LAND_META_LINE,
    start_url: MY_DEALS_HREF,
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "browser"],
    background_color: THEME_BG,
    theme_color: THEME_BG,
    lang: "en",
    prefer_related_applications: false,
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512-maskable.png",
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
