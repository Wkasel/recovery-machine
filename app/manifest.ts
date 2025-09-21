import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Recovery Machine - Mobile Wellness Services",
    short_name: "Recovery Machine",
    description:
      "Mobile cold plunge & infrared sauna delivered to your door. Weekly wellness sessions for peak performance and recovery.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0066cc",
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
