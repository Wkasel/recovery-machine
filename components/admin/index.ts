/**
 * Admin Components Barrel Export
 * 
 * Centralized exports for admin panel components
 */

// === MAIN ADMIN COMPONENTS ===
export { AdminDashboard } from './AdminDashboard'
export { AdminHeader } from './AdminHeader'
export { AdminPanelClient } from './AdminPanelClient'
export { AdminSidebar } from './AdminSidebar'

// === MANAGER COMPONENTS ===
export { BookingManager } from './BookingManager'
export { PaymentManager } from './PaymentManager'
export { ReferralManager } from './ReferralManager'
export { UserManager } from './UserManager'
export { default as ReviewsManager } from './ReviewsManager'
export { AvailabilityManager } from './AvailabilityManager'
export { default as ExportsManager } from './ExportsManager'
export { default as NotificationsManager } from './NotificationsManager'
export { ServiceAreaManager } from './ServiceAreaManager'
export { EmailTemplateManager } from './EmailTemplateManager'

// === EMAIL COMPONENTS ===
export { EmailTemplateEditor } from './email-template-editor'

// === SETTINGS COMPONENTS ===
export { BusinessSettingsManager } from './settings/BusinessSettingsManager'
export { BusinessHoursEditor } from './settings/BusinessHoursEditor'
export { BookingPolicySettings } from './settings/BookingPolicySettings'
export { BusinessInfoSettings } from './settings/BusinessInfoSettings'
export { IntegrationSettings } from './settings/IntegrationSettings'
export { NotificationSettings } from './settings/NotificationSettings'
export { SystemSettings } from './settings/SystemSettings'
export { PricingSettings } from './settings/PricingSettings'