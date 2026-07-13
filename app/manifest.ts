import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ERAC - ชมรมวิทยุสมัครเล่น กฟผ.",
    short_name: "ERAC",
    description: "Egat Radio Amateur Club · 144.700 MHz",
    start_url: "/",
    display: "standalone",
    background_color: "#1a1a2e",
    theme_color: "#facc15",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
