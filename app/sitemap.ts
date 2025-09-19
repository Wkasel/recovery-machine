import { MetadataRoute } from 'next';
import { siteMetadata } from '@/config/metadata';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteMetadata.siteUrl;
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/booking`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ];

  // Service pages for different locations
  const serviceAreas = [
    'los-angeles',
    'beverly-hills',
    'santa-monica',
    'west-hollywood',
    'manhattan-beach',
    'venice',
    'malibu'
  ];

  const services = [
    'cold-plunge',
    'infrared-sauna',
    'recovery-therapy',
    'wellness-sessions'
  ];

  // Generate location-based service pages
  const locationServicePages = serviceAreas.flatMap(area =>
    services.map(service => ({
      url: `${baseUrl}/services/${service}/${area}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  );

  // Blog/content pages (if they exist)
  const contentPages = [
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog/benefits-of-cold-plunge`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/blog/infrared-sauna-health-benefits`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/blog/recovery-best-practices`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
  ];

  return [
    ...staticPages,
    ...locationServicePages,
    ...contentPages,
  ];
}