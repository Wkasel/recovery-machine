/**
 * Comprehensive Test Setup Configuration
 * Global test utilities, mocks, and configurations for all test suites
 */

import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { jest } from '@jest/globals';
import React from 'react';

// Configure React Testing Library
configure({
  testIdAttribute: 'data-testid',
  // Increase timeout for slower CI environments
  asyncUtilTimeout: 5000,
  // Better error messages
  getElementError: (message, container) => {
    const error = new Error(message);
    error.name = 'TestingLibraryElementError';
    error.stack = undefined;
    return error;
  },
});

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    pop: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    isLocaleDomain: true,
    isReady: true,
    isPreview: false,
  }),
}));

// Mock Next.js navigation (App Router)
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pop: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
    getAll: jest.fn(),
    has: jest.fn(),
    keys: jest.fn(),
    values: jest.fn(),
    entries: jest.fn(),
    forEach: jest.fn(),
    toString: jest.fn(),
  }),
  usePathname: () => '/',
  useParams: () => ({}),
}));

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return React.createElement('img', { src, alt, ...props });
  };
});

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return React.createElement('a', { href, ...props }, children);
  };
});

// Mock Next.js dynamic imports
jest.mock('next/dynamic', () => {
  return function mockDynamic(fn: () => Promise<any>) {
    const Component = function DynamicComponent(props: any) {
      return React.createElement('div', { 'data-testid': 'dynamic-component', ...props });
    };
    Component.displayName = 'DynamicComponent';
    return Component;
  };
});

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
    resolvedTheme: 'light',
    themes: ['light', 'dark'],
    systemTheme: 'light',
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
      getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signIn: jest.fn().mockResolvedValue({ data: {}, error: null }),
      signUp: jest.fn().mockResolvedValue({ data: {}, error: null }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      then: jest.fn().mockResolvedValue({ data: [], error: null }),
    })),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn().mockResolvedValue({ data: null, error: null }),
        download: jest.fn().mockResolvedValue({ data: null, error: null }),
        remove: jest.fn().mockResolvedValue({ data: null, error: null }),
        list: jest.fn().mockResolvedValue({ data: [], error: null }),
        getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/image.jpg' } }),
      })),
    },
  })),
  createServerClient: jest.fn(),
  createBrowserClient: jest.fn(),
}));

// Mock React Query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({
    data: undefined,
    error: null,
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
  })),
  useMutation: jest.fn(() => ({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    data: undefined,
    error: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
  })),
  useQueryClient: jest.fn(() => ({
    invalidateQueries: jest.fn(),
    setQueryData: jest.fn(),
    getQueryData: jest.fn(),
  })),
  QueryClient: jest.fn(() => ({
    invalidateQueries: jest.fn(),
    setQueryData: jest.fn(),
    getQueryData: jest.fn(),
  })),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock FullCalendar
jest.mock('@fullcalendar/react', () => {
  return function MockFullCalendar(props: any) {
    return <div data-testid="fullcalendar" {...props} />;
  };
});

// Mock React Hook Form
jest.mock('react-hook-form', () => ({
  useForm: () => ({
    register: jest.fn(),
    handleSubmit: jest.fn((fn) => fn),
    formState: { errors: {}, isSubmitting: false, isValid: true },
    setValue: jest.fn(),
    getValue: jest.fn(),
    watch: jest.fn(),
    reset: jest.fn(),
    control: {},
  }),
  Controller: ({ render }: any) => render({ field: { onChange: jest.fn(), value: '' } }),
  useFormContext: () => ({
    register: jest.fn(),
    formState: { errors: {} },
    setValue: jest.fn(),
    getValue: jest.fn(),
    watch: jest.fn(),
    control: {},
  }),
}));

// Mock Radix UI components
jest.mock('@radix-ui/react-dialog', () => ({
  Root: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-root">{children}</div>,
  Trigger: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  Content: ({ children, ...props }: any) => <div data-testid="dialog-content" {...props}>{children}</div>,
  Header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
  Title: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
  Description: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  Close: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

jest.mock('@radix-ui/react-tabs', () => ({
  Root: ({ children, ...props }: any) => <div data-testid="tabs-root" {...props}>{children}</div>,
  List: ({ children, ...props }: any) => <div data-testid="tabs-list" role="tablist" {...props}>{children}</div>,
  Trigger: ({ children, ...props }: any) => <button role="tab" {...props}>{children}</button>,
  Content: ({ children, ...props }: any) => <div role="tabpanel" {...props}>{children}</div>,
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => {
  const icons = [
    'Moon', 'Sun', 'Menu', 'X', 'ChevronDown', 'ChevronUp', 'ChevronLeft', 'ChevronRight',
    'Search', 'User', 'Settings', 'Home', 'Calendar', 'Mail', 'Phone', 'MapPin',
    'Star', 'Heart', 'Share', 'Download', 'Upload', 'Edit', 'Trash', 'Plus', 'Minus',
    'Check', 'X', 'AlertCircle', 'Info', 'HelpCircle', 'Eye', 'EyeOff', 'Lock', 'Unlock',
  ];
  
  const mockIcons: Record<string, any> = {};
  icons.forEach(iconName => {
    mockIcons[iconName] = function MockIcon(props: any) {
      return <span data-testid={`icon-${iconName.toLowerCase()}`} {...props} />;
    };
  });
  
  return mockIcons;
});

// Mock Google APIs
global.google = {
  accounts: {
    id: {
      initialize: jest.fn(),
      prompt: jest.fn(),
      renderButton: jest.fn(),
    },
  },
  maps: {
    Map: jest.fn(),
    Marker: jest.fn(),
    InfoWindow: jest.fn(),
    places: {
      Autocomplete: jest.fn(),
      PlacesService: jest.fn(),
    },
  },
} as any;

// Mock Stripe
(global as any).Stripe = jest.fn(() => ({
  elements: jest.fn(() => ({
    create: jest.fn(() => ({
      mount: jest.fn(),
      unmount: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
    })),
  })),
  confirmCardPayment: jest.fn(),
  createPaymentMethod: jest.fn(),
}));

// Mock Bolt
(global as any).Bolt = jest.fn(() => ({
  create: jest.fn(),
  mount: jest.fn(),
  unmount: jest.fn(),
  on: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
  })
) as jest.Mock;

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-object-url');
global.URL.revokeObjectURL = jest.fn();

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByType: jest.fn(() => []),
    getEntriesByName: jest.fn(() => []),
    timing: {},
    memory: {
      usedJSHeapSize: 1000000,
      totalJSHeapSize: 2000000,
      jsHeapSizeLimit: 4000000,
    },
  },
});

// Mock crypto API
Object.defineProperty(window, 'crypto', {
  value: {
    getRandomValues: jest.fn((arr: any[]) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    }),
    randomUUID: jest.fn(() => 'mock-uuid-' + Math.random().toString(36).substr(2, 9)),
  },
});

// Mock geolocation
Object.defineProperty(navigator, 'geolocation', {
  value: {
    getCurrentPosition: jest.fn((success) => 
      success({
        coords: {
          latitude: 40.7128,
          longitude: -74.0060,
          accuracy: 10,
        },
      })
    ),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
  },
});

// Global test utilities
export const testUtils = {
  // Simulate user interactions
  createMockUser: (overrides = {}) => ({
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    created_at: new Date().toISOString(),
    ...overrides,
  }),

  // Create mock booking data
  createMockBooking: (overrides = {}) => ({
    id: 'test-booking-id',
    user_id: 'test-user-id',
    service: 'Test Service',
    date: new Date().toISOString(),
    time: '10:00',
    status: 'confirmed',
    price: 100,
    ...overrides,
  }),

  // Create mock API response
  createMockApiResponse: (data = {}, success = true) => ({
    data: success ? data : null,
    error: success ? null : new Error('Test error'),
    success,
  }),

  // Wait for element to appear
  waitFor: async (callback: () => void, timeout = 5000) => {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      try {
        callback();
        return;
      } catch (error) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    throw new Error(`Timeout waiting for condition after ${timeout}ms`);
  },

  // Create mock theme context
  createMockThemeProvider: (theme = 'light') => ({
    theme,
    setTheme: jest.fn(),
    resolvedTheme: theme,
    themes: ['light', 'dark'],
    systemTheme: 'light',
  }),

  // Create mock form data
  createMockFormData: (data = {}) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    return formData;
  },

  // Simulate file upload
  createMockFile: (name = 'test.jpg', type = 'image/jpeg', size = 1024) => {
    const file = new File(['mock file content'], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  },

  // Mock console methods for testing
  mockConsole: () => {
    const originalConsole = { ...console };
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
    console.info = jest.fn();
    
    return {
      restore: () => {
        Object.assign(console, originalConsole);
      },
    };
  },

  // Create test wrapper with providers
  createTestWrapper: (options: {
    theme?: string;
    user?: any;
    queryClient?: any;
  } = {}) => {
    return function TestWrapper({ children }: { children: React.ReactNode }) {
      return (
        <div data-testid="test-wrapper" data-theme={options.theme || 'light'}>
          {children}
        </div>
      );
    };
  },
};

// Global test assertions
export const customMatchers = {
  // Check if element has proper accessibility attributes
  toHaveAccessibleName: (element: HTMLElement, expectedName?: string) => {
    const accessibleName = element.getAttribute('aria-label') || 
                          element.getAttribute('aria-labelledby') || 
                          element.textContent;
    
    const pass = expectedName ? accessibleName === expectedName : !!accessibleName;
    
    return {
      pass,
      message: () => pass 
        ? `Expected element not to have accessible name ${expectedName}`
        : `Expected element to have accessible name ${expectedName}, but got ${accessibleName}`,
    };
  },

  // Check if element is properly themed
  toBeProperlyThemed: (element: HTMLElement, theme: string) => {
    const hasThemeClass = element.classList.contains(theme) || 
                         element.closest(`.${theme}`) !== null;
    
    return {
      pass: hasThemeClass,
      message: () => hasThemeClass 
        ? `Expected element not to be themed with ${theme}`
        : `Expected element to be themed with ${theme}`,
    };
  },

  // Check if element meets performance expectations
  toRenderWithinBudget: (renderTime: number, budget: number) => {
    const pass = renderTime <= budget;
    
    return {
      pass,
      message: () => pass 
        ? `Expected render time ${renderTime}ms to exceed budget ${budget}ms`
        : `Expected render time ${renderTime}ms to be within budget ${budget}ms`,
    };
  },
};

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveAccessibleName(expectedName?: string): R;
      toBeProperlyThemed(theme: string): R;
      toRenderWithinBudget(budget: number): R;
    }
  }
}

// Setup custom matchers
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
  
  // Reset localStorage and sessionStorage
  localStorageMock.clear();
  sessionStorageMock.clear();
  
  // Reset fetch mock
  (global.fetch as jest.Mock).mockClear();
  
  // Reset performance mock
  (window.performance.now as jest.Mock).mockClear();
});

// Cleanup after each test
afterEach(() => {
  // Clean up any remaining timers
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  
  // Clean up DOM
  document.body.innerHTML = '';
  document.head.innerHTML = '';
  
  // Reset console mocks
  if (console.log && (console.log as any).mockClear) {
    (console.log as any).mockClear();
    (console.warn as any).mockClear();
    (console.error as any).mockClear();
    (console.info as any).mockClear();
  }
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process in test environment
});

// Export for use in tests
export { jest };
export default testUtils;