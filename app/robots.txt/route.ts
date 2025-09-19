import { MetadataRoute } from 'next';

export function GET(): Response {
  const robotsTxt = `# Robots.txt for The Recovery Machine
# Mobile Wellness & Recovery Services

User-agent: *
Allow: /

# Allow search engines to index wellness and recovery content
Allow: /services
Allow: /booking
Allow: /about
Allow: /contact
Allow: /blog

# Disallow private and admin areas
Disallow: /api/
Disallow: /auth/
Disallow: /protected/
Disallow: /_next/
Disallow: /admin/
Disallow: /debug
Disallow: /error

# Disallow dynamic URLs with parameters that don't add value
Disallow: /*?
Allow: /booking?*
Allow: /services?*

# Special rules for wellness and health content
Allow: /wellness
Allow: /recovery
Allow: /cold-plunge
Allow: /infrared-sauna

# Crawl delay for respectful crawling
Crawl-delay: 1

# Sitemap location
Sitemap: ${process.env.NEXT_PUBLIC_APP_URL || 'https://therecoverymachine.com'}/sitemap.xml
Sitemap: ${process.env.NEXT_PUBLIC_APP_URL || 'https://therecoverymachine.com'}/server-sitemap.xml

# Special instructions for major search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot  
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 2

# Block problematic crawlers
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: SemrushBot
Disallow: /

# Allow wellness and health-focused crawlers
User-agent: HealthBot
Allow: /

# Social media crawlers
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: WhatsApp
Allow: /`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}