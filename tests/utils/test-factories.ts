import { faker } from '@faker-js/faker';

// User factories
export interface TestUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: TestAddress;
  createdAt: Date;
}

export interface TestAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface TestBooking {
  id: string;
  userId: string;
  service: 'cold-plunge' | 'infrared-sauna' | 'combo';
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  startDate: Date;
  duration: number;
  location: TestAddress;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  createdAt: Date;
}

export interface TestPayment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  method: 'card' | 'apple-pay' | 'google-pay';
  boltTransactionId?: string;
  createdAt: Date;
}

// Factory functions
export const createTestUser = (overrides: Partial<TestUser> = {}): TestUser => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  phone: faker.phone.number('###-###-####'),
  address: createTestAddress(),
  createdAt: faker.date.recent(),
  ...overrides,
});

export const createTestAddress = (overrides: Partial<TestAddress> = {}): TestAddress => ({
  street: faker.location.streetAddress(),
  city: faker.location.city(),
  state: faker.location.state({ abbreviated: true }),
  zipCode: faker.location.zipCode(),
  country: 'US',
  ...overrides,
});

export const createTestBooking = (overrides: Partial<TestBooking> = {}): TestBooking => ({
  id: faker.string.uuid(),
  userId: faker.string.uuid(),
  service: faker.helpers.arrayElement(['cold-plunge', 'infrared-sauna', 'combo']),
  frequency: faker.helpers.arrayElement(['weekly', 'bi-weekly', 'monthly']),
  startDate: faker.date.future(),
  duration: faker.helpers.arrayElement([60, 90, 120]),
  location: createTestAddress(),
  status: faker.helpers.arrayElement(['pending', 'confirmed', 'completed']),
  price: faker.number.int({ min: 150, max: 400 }),
  createdAt: faker.date.recent(),
  ...overrides,
});

export const createTestPayment = (overrides: Partial<TestPayment> = {}): TestPayment => ({
  id: faker.string.uuid(),
  bookingId: faker.string.uuid(),
  amount: faker.number.int({ min: 150, max: 400 }),
  currency: 'USD',
  status: faker.helpers.arrayElement(['pending', 'success', 'failed']),
  method: faker.helpers.arrayElement(['card', 'apple-pay', 'google-pay']),
  boltTransactionId: faker.string.alphanumeric(20),
  createdAt: faker.date.recent(),
  ...overrides,
});

// Batch creation functions
export const createTestUsers = (count: number, overrides: Partial<TestUser> = {}): TestUser[] => {
  return Array.from({ length: count }, () => createTestUser(overrides));
};

export const createTestBookings = (count: number, overrides: Partial<TestBooking> = {}): TestBooking[] => {
  return Array.from({ length: count }, () => createTestBooking(overrides));
};

export const createTestPayments = (count: number, overrides: Partial<TestPayment> = {}): TestPayment[] => {
  return Array.from({ length: count }, () => createTestPayment(overrides));
};

// Specific test scenarios
export const createBookingWithPayment = () => {
  const user = createTestUser();
  const booking = createTestBooking({ userId: user.id });
  const payment = createTestPayment({ bookingId: booking.id, amount: booking.price });
  
  return { user, booking, payment };
};

export const createFailedBookingScenario = () => {
  const user = createTestUser();
  const booking = createTestBooking({ 
    userId: user.id, 
    status: 'pending'
  });
  const payment = createTestPayment({ 
    bookingId: booking.id, 
    amount: booking.price,
    status: 'failed'
  });
  
  return { user, booking, payment };
};

export const createWeeklySubscriptionScenario = () => {
  const user = createTestUser();
  const booking = createTestBooking({ 
    userId: user.id, 
    frequency: 'weekly',
    service: 'cold-plunge',
    status: 'confirmed'
  });
  const payment = createTestPayment({ 
    bookingId: booking.id, 
    amount: booking.price,
    status: 'success'
  });
  
  return { user, booking, payment };
};

// Test data validation helpers
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
  return phoneRegex.test(phone);
};

export const isValidZipCode = (zipCode: string): boolean => {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
};

// Mock API response helpers
export const mockSuccessfulBookingResponse = (booking: TestBooking) => ({
  status: 201,
  json: async () => ({
    success: true,
    data: booking,
    message: 'Booking created successfully'
  })
});

export const mockFailedBookingResponse = (error: string = 'Booking failed') => ({
  status: 400,
  json: async () => ({
    success: false,
    error,
    message: 'Failed to create booking'
  })
});

export const mockPaymentSuccessResponse = (payment: TestPayment) => ({
  status: 200,
  json: async () => ({
    success: true,
    data: payment,
    message: 'Payment processed successfully'
  })
});

export const mockPaymentFailureResponse = (error: string = 'Payment declined') => ({
  status: 402,
  json: async () => ({
    success: false,
    error,
    message: 'Payment processing failed'
  })
});