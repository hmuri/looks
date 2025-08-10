// app/manifest.ts
import { SiteConfig } from "@/constants/config";

export default function manifest() {
  return {
    name: SiteConfig.title,
    short_name: SiteConfig.title,
    description: SiteConfig.description ?? SiteConfig.title,
    start_url: "/",
    scope: "/",
    display: "standalone", // ★ 풀스크린
    background_color: "#0b1720",
    theme_color: "#0b1720",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable any",
      },
    ],
  };
}
