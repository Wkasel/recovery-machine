/**
 * Loading State Management for Critical User Flows
 */

import { create } from "zustand";

interface LoadingState {
  // Payment flow loading states
  paymentProcessing: boolean;
  checkoutCreating: boolean;
  orderValidating: boolean;

  // Booking flow loading states
  bookingCreating: boolean;
  availabilityLoading: boolean;
  calendarLoading: boolean;

  // Admin operations
  adminDataLoading: boolean;
  exportGenerating: boolean;

  // Generic loading states
  loading: Record<string, boolean>;

  // Actions
  setPaymentProcessing: (loading: boolean) => void;
  setCheckoutCreating: (loading: boolean) => void;
  setOrderValidating: (loading: boolean) => void;
  setBookingCreating: (loading: boolean) => void;
  setAvailabilityLoading: (loading: boolean) => void;
  setCalendarLoading: (loading: boolean) => void;
  setAdminDataLoading: (loading: boolean) => void;
  setExportGenerating: (loading: boolean) => void;
  setLoading: (key: string, loading: boolean) => void;
  isAnyLoading: () => boolean;
}

export const useLoadingStore = create<LoadingState>((set, get) => ({
  // Initial states
  paymentProcessing: false,
  checkoutCreating: false,
  orderValidating: false,
  bookingCreating: false,
  availabilityLoading: false,
  calendarLoading: false,
  adminDataLoading: false,
  exportGenerating: false,
  loading: {},

  // Actions
  setPaymentProcessing: (loading) => set({ paymentProcessing: loading }),
  setCheckoutCreating: (loading) => set({ checkoutCreating: loading }),
  setOrderValidating: (loading) => set({ orderValidating: loading }),
  setBookingCreating: (loading) => set({ bookingCreating: loading }),
  setAvailabilityLoading: (loading) => set({ availabilityLoading: loading }),
  setCalendarLoading: (loading) => set({ calendarLoading: loading }),
  setAdminDataLoading: (loading) => set({ adminDataLoading: loading }),
  setExportGenerating: (loading) => set({ exportGenerating: loading }),

  setLoading: (key, loading) =>
    set((state) => ({
      loading: { ...state.loading, [key]: loading },
    })),

  isAnyLoading: () => {
    const state = get();
    return (
      state.paymentProcessing ||
      state.checkoutCreating ||
      state.orderValidating ||
      state.bookingCreating ||
      state.availabilityLoading ||
      state.calendarLoading ||
      state.adminDataLoading ||
      state.exportGenerating ||
      Object.values(state.loading).some(Boolean)
    );
  },
}));

// Hook for specific loading states
export function usePaymentLoading() {
  const {
    paymentProcessing,
    checkoutCreating,
    orderValidating,
    setPaymentProcessing,
    setCheckoutCreating,
    setOrderValidating,
  } = useLoadingStore();

  return {
    isPaymentLoading: paymentProcessing || checkoutCreating || orderValidating,
    paymentProcessing,
    checkoutCreating,
    orderValidating,
    setPaymentProcessing,
    setCheckoutCreating,
    setOrderValidating,
  };
}

export function useBookingLoading() {
  const {
    bookingCreating,
    availabilityLoading,
    calendarLoading,
    setBookingCreating,
    setAvailabilityLoading,
    setCalendarLoading,
  } = useLoadingStore();

  return {
    isBookingLoading: bookingCreating || availabilityLoading || calendarLoading,
    bookingCreating,
    availabilityLoading,
    calendarLoading,
    setBookingCreating,
    setAvailabilityLoading,
    setCalendarLoading,
  };
}

export function useAdminLoading() {
  const { adminDataLoading, exportGenerating, setAdminDataLoading, setExportGenerating } =
    useLoadingStore();

  return {
    isAdminLoading: adminDataLoading || exportGenerating,
    adminDataLoading,
    exportGenerating,
    setAdminDataLoading,
    setExportGenerating,
  };
}

// Utility function to wrap async operations with loading state
export function withLoadingState<T extends any[], R>(
  loadingKey: keyof LoadingState | string,
  operation: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    const { setLoading } = useLoadingStore.getState();

    try {
      if (typeof loadingKey === "string") {
        setLoading(loadingKey, true);
      } else {
        // Handle predefined loading keys
        const setter = `set${loadingKey.charAt(0).toUpperCase()}${loadingKey.slice(1)}` as const;
        if (setter in useLoadingStore.getState()) {
          (useLoadingStore.getState() as any)[setter](true);
        }
      }

      return await operation(...args);
    } finally {
      if (typeof loadingKey === "string") {
        setLoading(loadingKey, false);
      } else {
        const setter = `set${loadingKey.charAt(0).toUpperCase()}${loadingKey.slice(1)}` as const;
        if (setter in useLoadingStore.getState()) {
          (useLoadingStore.getState() as any)[setter](false);
        }
      }
    }
  };
}
