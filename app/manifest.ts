import type { MetadataRoute } from "next";
import { LAND_META_LINE } from "@/lib/brand";
import { THEME_BG } from "@/lib/ui-tokens";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BotBuy",
    short_name: "BotBuy",
    description: LAND_META_LINE,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: THEME_BG,
    theme_color: THEME_BG,
    lang: "en",
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
  };
}
