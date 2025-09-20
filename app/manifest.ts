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
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: "/screenshot-mobile.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
        label: "Recovery Machine Mobile App",
      },
      {
        src: "/screenshot-desktop.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Recovery Machine Desktop",
      },
    ],
    shortcuts: [
      {
        name: "Book Session",
        short_name: "Book",
        description: "Quickly book a recovery session",
        url: "/booking",
        icons: [
          {
            src: "/icon-book.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
      {
        name: "Services",
        short_name: "Services",
        description: "View our wellness services",
        url: "/services",
        icons: [
          {
            src: "/icon-services.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
    ],
  };
}
