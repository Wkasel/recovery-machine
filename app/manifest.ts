import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Recovery Machine - Mobile Wellness Services",
    short_name: "Recovery Machine",
    description:
      "Mobile cold plunge & infrared sauna delivered to your door. Weekly wellness sessions for peak performance and recovery.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fffa", // Mint background from v2-design
    theme_color: "#B8D4CD", // Mint accent color for browser UI
    categories: ["health", "wellness", "lifestyle", "fitness"],
    lang: "en-US",
    scope: "/",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
