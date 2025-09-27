/**
 * Layout Components Barrel Export
 * 
 * Centralized exports for layout and spacing components
 */

// === SPACING COMPONENTS ===
export {
  Stack,
  Inline,
  Container,
  Spacer,
  stackVariants,
  inlineVariants,
  containerVariants,
  spacerVariants,
  spacingScale,
  getSpacingValue,
  type SpacingValue
} from './Spacing'

// === GRID COMPONENTS (if they exist) ===
// Export Grid components when they're created

// === LAYOUT UTILITY TYPES ===
export type {
  StackProps,
  InlineProps,
  ContainerProps,
  SpacerProps
} from './Spacing'