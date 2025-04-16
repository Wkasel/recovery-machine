/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.SITE_URL || "https://27circles.com",
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 0.7,
  exclude: [
    "/api/*",
    "/auth/*",
    "/server-sitemap.xml", // Exclude server-side sitemap
    "/_next/*",
    "/static/*",
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/*", "/auth/*", "/_next/*", "/static/*"],
      },
    ],
    additionalSitemaps: [
      // Add any additional dynamic sitemaps here
      `${process.env.SITE_URL || "https://27circles.com"}/server-sitemap.xml`,
    ],
  },
  // Transform function to customize each URL entry
  transform: async (config, path) => {
    // Remove trailing slashes
    const normalizedPath = path.replace(/\/$/, "");

    return {
      loc: normalizedPath,
      changefreq: config.changefreq,
      priority:
        // Higher priority for main pages
        normalizedPath === ""
          ? 1.0
          : normalizedPath.split("/").length === 2
            ? 0.8
            : config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};

export default config;
