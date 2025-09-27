/**
 * Root Barrel Export System for Components
 * 
 * This file serves as the main entry point for all component imports.
 * It provides a centralized, tree-shakeable export system that simplifies
 * imports throughout the application.
 * 
 * Usage:
 * import { Button, Card, Heading, Stack } from '@/components'
 * 
 * instead of:
 * import { Button } from '@/components/ui/button'
 * import { Card } from '@/components/ui/card'
 * import { Heading } from '@/components/typography/Typography'
 * import { Stack } from '@/components/layout/Spacing'
 */

// === UI COMPONENTS (shadcn/ui based) ===
export * from './ui'

// === LAYOUT COMPONENTS ===
export * from './layout'

// === TYPOGRAPHY COMPONENTS ===
export * from './typography'

// === FORM COMPONENTS ===
export * from './form'

// === AUTH COMPONENTS ===
export * from './auth'

// === ADMIN COMPONENTS ===
export * from './admin'

// === NAVIGATION COMPONENTS ===
export * from './nav'

// === BOOKING COMPONENTS ===
export * from './booking'

// === SECTIONS COMPONENTS ===
export * from './sections'

// === SEO COMPONENTS ===
export * from './seo'
export { SearchEngineVerifications } from './seo/SearchEngineVerifications'
export { WellnessBusinessSchema } from './seo/WellnessBusinessSchema' 
export { HealthcareDisclaimer } from './seo/HealthcareDisclaimer'

// === ANALYTICS COMPONENTS ===
export * from './analytics'

// === ERROR BOUNDARY COMPONENTS ===
export * from './error-boundary'

// === PAYMENT COMPONENTS ===
export * from './payments'

// === MODAL COMPONENTS ===
export * from './modals'

// === DASHBOARD COMPONENTS ===
export * from './dashboard'

// === SOCIAL COMPONENTS ===
export * from './social'

// === PERFORMANCE COMPONENTS ===
export * from './performance'

// === REVIEWS COMPONENTS ===
export * from './reviews'

// === INSTAGRAM COMPONENTS ===
export * from './instagram'

// === JSON-LD COMPONENTS ===
export * from './JsonLd'

// === INDIVIDUAL COMPONENT EXPORTS ===
// For components that don't have category barrels yet

export { default as Hero } from './hero'
export { HomePageClient } from './HomePageClient'
export { ThemeSwitcher } from './theme-switcher'
export { SubmitButton } from './submit-button'
export { default as HeaderAuth } from './header-auth'

// === DEBUG COMPONENTS ===
export { OfferModalDebug } from './debug/OfferModalDebug'
export { AuthDebug } from './debug/AuthDebug'

// === TYPE EXPORTS ===
export type { VariantProps } from 'class-variance-authority'