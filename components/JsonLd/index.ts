/**
 * JSON-LD Components Barrel Export
 * 
 * Centralized exports for structured data components
 */

// === JSON-LD COMPONENTS ===
export { ServiceJsonLd } from './ServiceJsonLd'
export { LocalBusinessJsonLd } from './LocalBusinessJsonLd'

// === CORE JSON-LD COMPONENTS ===
export { 
  OrganizationJsonLd, 
  WebsiteJsonLd, 
  WebPageJsonLd, 
  ArticleJsonLd, 
  FAQJsonLd, 
  BreadcrumbJsonLd 
} from './index.tsx'