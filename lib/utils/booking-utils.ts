import { Address, ServiceType, SetupFeeCalculation, services } from "@/lib/types/booking";

export class BookingUtils {
  /**
   * Format price from cents to currency string
   */
  static formatPrice(priceInCents: number): string {
    return `$${(priceInCents / 100).toFixed(2)}`;
  }

  /**
   * Format date and time for display
   */
  static formatDateTime(dateTimeStr: string) {
    const date = new Date(dateTimeStr);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      short: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      iso: date.toISOString(),
    };
  }

  /**
   * Format address for display
   */
  static formatAddress(address: Address): string {
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
  }

  /**
   * Get service by type
   */
  static getService(serviceType: ServiceType) {
    return services.find((s) => s.id === serviceType);
  }

  /**
   * Calculate add-on costs
   */
  static calculateAddOnCost(
    addOns: { extraVisits: number; familyMembers: number; extendedTime: number },
    basePrice: number
  ): number {
    const familyMemberCost = addOns.familyMembers * 2500; // $25 per family member
    const extendedTimeCost = addOns.extendedTime * 200; // $2 per minute
    const extraVisitCost = addOns.extraVisits * basePrice * 0.8; // 20% discount for extra visits

    return familyMemberCost + extendedTimeCost + extraVisitCost;
  }

  /**
   * Calculate total session duration
   */
  static calculateTotalDuration(baseDuration: number, extendedTime: number = 0): number {
    return baseDuration + extendedTime;
  }

  /**
   * Generate calendar event URL for Google Calendar
   */
  static generateCalendarEventUrl(
    serviceType: ServiceType,
    dateTime: string,
    address: Address,
    bookingId: string,
    duration: number,
    specialInstructions?: string
  ): string {
    const service = this.getService(serviceType);
    const startDate = new Date(dateTime);
    const endDate = new Date(startDate.getTime() + duration * 60000);

    const calendarUrl = new URL("https://calendar.google.com/calendar/render");
    calendarUrl.searchParams.set("action", "TEMPLATE");
    calendarUrl.searchParams.set("text", `Recovery Machine - ${service?.name}`);
    calendarUrl.searchParams.set(
      "dates",
      `${startDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${endDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`
    );
    calendarUrl.searchParams.set("location", this.formatAddress(address));
    calendarUrl.searchParams.set(
      "details",
      `Your ${service?.name} session with Recovery Machine.\n\nBooking ID: ${bookingId}\n\nSpecial Instructions: ${specialInstructions || "None"}\n\nQuestions? Call us at (555) 123-4567`
    );

    return calendarUrl.toString();
  }

  /**
   * Validate booking data completeness
   */
  static validateBookingData(data: {
    serviceType?: ServiceType;
    dateTime?: string;
    address?: Address;
    setupFee?: SetupFeeCalculation;
  }): { isValid: boolean; missingFields: string[] } {
    const missingFields: string[] = [];

    if (!data.serviceType) missingFields.push("Service selection");
    if (!data.dateTime) missingFields.push("Date and time");
    if (!data.address) missingFields.push("Delivery address");
    if (!data.setupFee) missingFields.push("Setup fee calculation");

    return {
      isValid: missingFields.length === 0,
      missingFields,
    };
  }

  /**
   * Check if a booking time is in the future
   */
  static isValidBookingTime(dateTime: string): boolean {
    const bookingDate = new Date(dateTime);
    const now = new Date();
    const minBookingTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now

    return bookingDate >= minBookingTime;
  }

  /**
   * Check if a booking time is within business hours
   */
  static isWithinBusinessHours(dateTime: string): boolean {
    const date = new Date(dateTime);
    const hour = date.getHours();
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday

    // Business hours: 8 AM to 8 PM, 7 days a week
    return hour >= 8 && hour < 20;
  }

  /**
   * Generate booking confirmation number
   */
  static generateConfirmationNumber(): string {
    const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
    let result = "RM-";

    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
  }

  /**
   * Calculate estimated setup and pickup times
   */
  static calculateServiceTimes(sessionDateTime: string) {
    const sessionDate = new Date(sessionDateTime);

    // Setup 2 hours before session
    const setupTime = new Date(sessionDate.getTime() - 2 * 60 * 60 * 1000);

    // Pickup 1 hour after session ends (assuming 30-90 min sessions)
    const pickupTime = new Date(sessionDate.getTime() + 2 * 60 * 60 * 1000);

    return {
      setup: this.formatDateTime(setupTime.toISOString()),
      pickup: this.formatDateTime(pickupTime.toISOString()),
    };
  }

  /**
   * Get available time slots for a date (mock implementation)
   */
  static getDefaultTimeSlots(): string[] {
    const slots: string[] = [];

    // Generate slots from 8 AM to 8 PM, every 2 hours
    for (let hour = 8; hour <= 18; hour += 2) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      if (hour < 18) {
        slots.push(`${hour.toString().padStart(2, "0")}:30`);
      }
    }

    return slots;
  }

  /**
   * Check if a ZIP code is in service area (mock implementation)
   */
  static isInServiceArea(zipCode: string): boolean {
    const zip = parseInt(zipCode);

    // Los Angeles County ZIP codes (approximate ranges)
    const serviceAreas = [
      [90001, 90099], // Central LA
      [90201, 90299], // Beverly Hills area
      [90401, 90499], // Santa Monica area
      [91000, 91999], // San Fernando Valley
      [92000, 92999], // Orange County (extended service)
    ];

    return serviceAreas.some(([min, max]) => zip >= min && zip <= max);
  }

  /**
   * Get distance-based pricing tier
   */
  static getDistanceTier(distance: number): {
    tier: "close" | "medium" | "far";
    multiplier: number;
    description: string;
  } {
    if (distance <= 10) {
      return {
        tier: "close",
        multiplier: 1.0,
        description: "Standard service area",
      };
    } else if (distance <= 25) {
      return {
        tier: "medium",
        multiplier: 1.2,
        description: "Extended service area",
      };
    } else {
      return {
        tier: "far",
        multiplier: 1.5,
        description: "Premium service area",
      };
    }
  }

  /**
   * Estimate travel time based on distance
   */
  static estimateTravelTime(distance: number): number {
    // Base calculation: 1.5 minutes per mile + 15 minutes base time
    return Math.round(distance * 1.5 + 15);
  }
}
