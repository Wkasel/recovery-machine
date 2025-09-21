/**
 * Production Safeguards for Payment System
 * 
 * This file contains safeguards to ensure dev bypass functionality
 * never accidentally runs in production.
 */

import { isDevelopmentEnvironment } from './dev-bypass';

export class ProductionSafeguardError extends Error {
  constructor(message: string) {
    super(`🚨 PRODUCTION SAFEGUARD: ${message}`);
    this.name = 'ProductionSafeguardError';
  }
}

/**
 * Validates that certain operations only run in development
 */
export function requireDevelopmentEnvironment(operation: string): void {
  if (!isDevelopmentEnvironment()) {
    throw new ProductionSafeguardError(
      `${operation} attempted in production environment. This operation is only allowed in development.`
    );
  }
}

/**
 * Runtime check for production deployment
 * This will throw an error if dev-bypass code is loaded in production
 */
export function validateProductionDeployment(): void {
  // Check if we're in production and dev bypass is loaded
  if (typeof window !== 'undefined') {
    const isProduction = process.env.NODE_ENV === 'production' && 
                        !process.env.NEXT_PUBLIC_DEV_MODE;
    
    if (isProduction) {
      // Check if dev bypass functionality is available
      try {
        // This will fail if dev-bypass is not loaded
        require('./dev-bypass');
        
        // If we get here, dev bypass is loaded in production - CRITICAL ERROR
        console.error('🚨 CRITICAL SECURITY ALERT: Dev payment bypass detected in production!');
        
        // In production, we want to be extra safe
        throw new ProductionSafeguardError(
          'Development payment bypass code detected in production environment. Deployment blocked for security.'
        );
      } catch (error) {
        // If require fails, that's good - dev bypass is not loaded
        if (error instanceof ProductionSafeguardError) {
          throw error;
        }
        // Otherwise, continue - this means dev-bypass is not available, which is correct
      }
    }
  }
}

/**
 * Validates order creation in production
 */
export function validateOrderCreation(orderData: any): void {
  // Check for dev bypass markers
  if (orderData.metadata?.dev_bypass && !isDevelopmentEnvironment()) {
    throw new ProductionSafeguardError(
      'Development bypass order detected in production. This indicates a security breach.'
    );
  }
  
  // Validate Bolt checkout ID format in production
  if (!isDevelopmentEnvironment() && orderData.bolt_checkout_id?.startsWith('dev_')) {
    throw new ProductionSafeguardError(
      'Development checkout ID format detected in production payment processing.'
    );
  }
}

/**
 * System repercussions accounting
 */
export interface SystemRepercussions {
  dataIntegrity: string[];
  securityRisks: string[];
  businessLogic: string[];
  auditTrail: string[];
}

export function getSystemRepercussions(): SystemRepercussions {
  return {
    dataIntegrity: [
      'Dev orders marked with metadata.dev_bypass = true',
      'Fake Bolt checkout IDs with dev_ prefix',
      'Orders with $0 amount but status = "paid"',
      'Bookings immediately confirmed without real payment'
    ],
    securityRisks: [
      'Payment bypass only works in development environment',
      'All dev codes return 403 Forbidden in production',
      'Environment validation on every API call',
      'Production safeguard checks on order creation'
    ],
    businessLogic: [
      'Booking status set to "confirmed" immediately',
      'Credit transactions not created for dev bypasses',
      'Email confirmations still sent (if enabled)',
      'Calendar slots still marked as booked'
    ],
    auditTrail: [
      'All dev bypass attempts logged with 🔧 DEV MODE prefix',
      'Order metadata includes creation source',
      'Payment method tracked as "dev_bypass"',
      'Timestamps preserved for debugging'
    ]
  };
}

// Run validation on module load
if (typeof window !== 'undefined') {
  try {
    validateProductionDeployment();
  } catch (error) {
    console.error('Production safeguard validation failed:', error);
  }
}