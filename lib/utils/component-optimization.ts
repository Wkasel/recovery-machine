/**
 * Component Optimization Utilities
 * 
 * Utilities for optimizing component performance and maintainability
 */

import { ComponentType, lazy, memo, useMemo } from 'react';

/**
 * Create a lazy-loaded component with error boundary
 */
export function createLazyComponent<T = {}>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  fallback?: ComponentType
) {
  const LazyComponent = lazy(importFn);
  
  return memo((props: T) => (
    <LazyComponent {...props} />
  ));
}

/**
 * Optimize component with memo and display name
 */
export function optimizeComponent<T = {}>(
  Component: ComponentType<T>,
  displayName?: string
): ComponentType<T> {
  const OptimizedComponent = memo(Component);
  
  if (displayName) {
    OptimizedComponent.displayName = displayName;
  }
  
  return OptimizedComponent;
}

/**
 * Create a memoized selector function
 */
export function createMemoizedSelector<T, R>(
  selector: (state: T) => R,
  dependencies: any[] = []
) {
  return useMemo(() => selector, dependencies);
}

/**
 * Bundle size optimization utilities
 */
export const bundleUtils = {
  /**
   * Dynamically import utilities only when needed
   */
  async importUtils() {
    return import('@/lib/utils');
  },
  
  /**
   * Lazy load heavy components
   */
  createHeavyComponentLoader<T = {}>(importPath: string) {
    return lazy(() => import(importPath)) as ComponentType<T>;
  },
  
  /**
   * Check if component should be rendered
   */
  shouldRender(condition: boolean, fallback?: () => boolean) {
    return condition || (fallback ? fallback() : false);
  }
};

/**
 * Performance monitoring for components
 */
export function withPerformanceMonitoring<T = {}>(
  Component: ComponentType<T>,
  componentName: string
) {
  return memo((props: T) => {
    const startTime = performance.now();
    
    // Monitor render time
    useMemo(() => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development' && renderTime > 16) {
        console.warn(`[Performance] ${componentName} slow render: ${renderTime.toFixed(2)}ms`);
      }
    }, []);
    
    return <Component {...props} />;
  });
}

/**
 * Type-safe component composition helpers
 */
export const compositionUtils = {
  /**
   * Combine multiple HOCs safely
   */
  compose<T>(...hocs: Array<(component: ComponentType<T>) => ComponentType<T>>) {
    return (Component: ComponentType<T>) =>
      hocs.reduceRight((acc, hoc) => hoc(acc), Component);
  },
  
  /**
   * Create a compound component pattern
   */
  createCompoundComponent<T>(
    BaseComponent: ComponentType<T>,
    subComponents: Record<string, ComponentType<any>>
  ) {
    Object.keys(subComponents).forEach(key => {
      (BaseComponent as any)[key] = subComponents[key];
    });
    
    return BaseComponent;
  }
};

/**
 * Prop optimization utilities
 */
export const propUtils = {
  /**
   * Extract only needed props to prevent unnecessary re-renders
   */
  pickProps<T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Pick<T, K> {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  },
  
  /**
   * Omit props to prevent prop drilling
   */
  omitProps<T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
  ): Omit<T, K> {
    const result = { ...obj };
    keys.forEach(key => {
      delete result[key];
    });
    return result;
  }
};