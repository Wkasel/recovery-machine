# 🔌 Recovery Machine API Developer Reference

## 📋 Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [Core API Endpoints](#core-api-endpoints)
3. [Webhook Integration](#webhook-integration)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [SDK & Integration Examples](#sdk--integration-examples)
7. [Testing & Development](#testing--development)

---

## 🔐 Authentication & Authorization

### Supabase Auth Integration

The Recovery Machine API uses Supabase Auth for all authentication and authorization. All API endpoints require proper authentication tokens.

#### Authentication Headers
```typescript
// Required headers for authenticated requests
const headers = {
  'Authorization': `Bearer ${supabaseAccessToken}`,
  'Content-Type': 'application/json',
  'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}
```

#### User Authentication Flow
```typescript
// 1. User signup/login
const { data: { user }, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
  options: {
    data: {
      full_name: 'John Doe',
      phone: '+1-555-0123'
    }
  }
})

// 2. Get access token for API calls
const { data: { session } } = await supabase.auth.getSession()
const accessToken = session?.access_token

// 3. Use token for API requests
const response = await fetch('/api/bookings', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
})
```

#### Admin Authentication
```typescript
// Check if user has admin access
const checkAdminAccess = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: adminUser } = await supabase
    .from('admins')
    .select('role')
    .eq('email', user.email)
    .single()
    
  return adminUser?.role || null
}

// Role hierarchy check
const hasPermission = (userRole: string, requiredRole: string) => {
  const roleHierarchy = {
    'operator': 1,
    'admin': 2,
    'super_admin': 3
  }
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}
```

---

## 🛠️ Core API Endpoints

### Authentication Endpoints

#### POST `/api/auth/signup`
Create new user account with automatic profile creation.

**Request Body:**
```typescript
interface SignupRequest {
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
  referral_code?: string; // Optional referral code from inviter
}
```

**Response:**
```typescript
interface SignupResponse {
  user: {
    id: string;
    email: string;
    created_at: string;
  };
  profile: {
    id: string;
    referral_code: string;
    credits: number;
  };
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}
```

**Example:**
```typescript
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'secure-password123',
    full_name: 'John Smith',
    phone: '+1-555-0123',
    referral_code: 'SARAH123'
  })
})

const data = await response.json()
```

#### POST `/api/auth/signin`
Authenticate existing user.

**Request Body:**
```typescript
interface SigninRequest {
  email: string;
  password: string;
}
```

#### POST `/api/auth/signout`
Sign out user and invalidate session.

### User Profile Endpoints

#### GET `/api/profile`
Get current user's profile information.

**Response:**
```typescript
interface ProfileResponse {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  referral_code: string;
  credits: number;
  created_at: string;
  updated_at: string;
}
```

#### PATCH `/api/profile`
Update user profile information.

**Request Body:**
```typescript
interface ProfileUpdateRequest {
  full_name?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}
```

---

### Booking Endpoints

#### GET `/api/bookings/availability`
Get available time slots for booking.

**Query Parameters:**
- `date`: ISO date string (YYYY-MM-DD)
- `duration`: Session duration in minutes (default: 30)
- `service_type`: cold_plunge | infrared_sauna | combo

**Response:**
```typescript
interface AvailabilityResponse {
  date: string;
  slots: Array<{
    id: string;
    start_time: string; // HH:MM format
    end_time: string;
    is_available: boolean;
    max_bookings: number;
    current_bookings: number;
  }>;
}
```

**Example:**
```typescript
const date = '2024-09-20'
const response = await fetch(`/api/bookings/availability?date=${date}&duration=30`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }
})

const availability = await response.json()
```

#### POST `/api/bookings`
Create new booking.

**Request Body:**
```typescript
interface BookingRequest {
  date_time: string; // ISO datetime string
  duration?: number; // Minutes, default 30
  service_type: 'cold_plunge' | 'infrared_sauna' | 'combo';
  add_ons?: {
    family?: boolean;
    extra_visits?: number;
    towels?: boolean;
    electrolytes?: boolean;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    special_instructions?: string;
  };
  notes?: string;
}
```

**Response:**
```typescript
interface BookingResponse {
  id: string;
  user_id: string;
  date_time: string;
  duration: number;
  service_type: string;
  add_ons: object;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  address: object;
  total_amount: number; // In cents
  created_at: string;
  checkout_url?: string; // If payment required
}
```

#### GET `/api/bookings`
Get user's bookings.

**Query Parameters:**
- `status`: Filter by status (scheduled, confirmed, completed, cancelled)
- `limit`: Number of results (default: 20)
- `offset`: Pagination offset (default: 0)

**Response:**
```typescript
interface BookingsResponse {
  bookings: Array<{
    id: string;
    date_time: string;
    duration: number;
    service_type: string;
    status: string;
    address: object;
    total_amount: number;
    created_at: string;
    order?: {
      id: string;
      amount: number;
      status: string;
    };
  }>;
  total_count: number;
  has_more: boolean;
}
```

#### PATCH `/api/bookings/[id]`
Update existing booking (reschedule, cancel, etc.).

**Request Body:**
```typescript
interface BookingUpdateRequest {
  date_time?: string; // For rescheduling
  status?: 'cancelled'; // For cancellation
  notes?: string;
  address?: object; // Update delivery address
}
```

---

### Payment Endpoints

#### POST `/api/payments/checkout`
Create Bolt checkout session.

**Request Body:**
```typescript
interface CheckoutRequest {
  amount: number; // Total amount in cents
  type: 'subscription' | 'one_time' | 'setup_fee';
  booking_id?: string; // Associated booking
  setup_fee?: number; // Setup fee in cents
  billing_address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  metadata?: object; // Additional payment data
}
```

**Response:**
```typescript
interface CheckoutResponse {
  checkout_url: string; // Bolt checkout URL
  order_id: string;
  expires_at: string;
}
```

#### GET `/api/payments/orders`
Get user's payment orders.

**Response:**
```typescript
interface OrdersResponse {
  orders: Array<{
    id: string;
    amount: number; // In cents
    setup_fee_applied: number;
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    bolt_checkout_id: string;
    created_at: string;
    booking?: {
      id: string;
      date_time: string;
      service_type: string;
    };
  }>;
  total_count: number;
}
```

#### POST `/api/payments/refund`
Request refund for paid order.

**Request Body:**
```typescript
interface RefundRequest {
  order_id: string;
  amount?: number; // Partial refund amount in cents (optional)
  reason: string;
}
```

---

### Referral Endpoints

#### GET `/api/referrals`
Get user's referral information.

**Response:**
```typescript
interface ReferralsResponse {
  referral_code: string;
  referrals: Array<{
    id: string;
    invitee_email: string;
    status: 'pending' | 'accepted' | 'expired';
    reward_credits: number;
    created_at: string;
    expires_at: string;
  }>;
  stats: {
    total_sent: number;
    total_accepted: number;
    credits_earned: number;
    conversion_rate: number;
  };
}
```

#### POST `/api/referrals/invite`
Send referral invitation.

**Request Body:**
```typescript
interface ReferralInviteRequest {
  invitee_email: string;
  method: 'email' | 'sms';
  personal_message?: string;
}
```

**Response:**
```typescript
interface ReferralInviteResponse {
  referral_id: string;
  invitation_sent: boolean;
  referral_link: string;
  expires_at: string;
}
```

#### GET `/api/referrals/track/[code]`
Track referral by referral code.

**Response:**
```typescript
interface ReferralTrackResponse {
  referral_code: string;
  referrer: {
    name: string;
    email?: string; // If public
  };
  reward_amount: number;
  expires_at: string;
  terms: string;
}
```

---

### Review Endpoints

#### POST `/api/reviews`
Submit review for completed booking.

**Request Body:**
```typescript
interface ReviewRequest {
  booking_id: string;
  rating: number; // 1-5 stars
  comment?: string;
  reviewer_name?: string; // For public display
}
```

#### GET `/api/reviews`
Get user's reviews.

**Response:**
```typescript
interface ReviewsResponse {
  reviews: Array<{
    id: string;
    booking_id: string;
    rating: number;
    comment: string;
    is_featured: boolean;
    created_at: string;
    booking: {
      date_time: string;
      service_type: string;
    };
  }>;
}
```

#### GET `/api/reviews/public`
Get public featured reviews for homepage.

**Response:**
```typescript
interface PublicReviewsResponse {
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    reviewer_name: string;
    service_type: string;
    created_at: string;
  }>;
  average_rating: number;
  total_reviews: number;
}
```

---

## 🔗 Admin API Endpoints

### Dashboard Analytics

#### GET `/api/admin/dashboard/stats`
Get business KPIs and metrics.

**Response:**
```typescript
interface DashboardStatsResponse {
  revenue: {
    total: number;
    monthly: number;
    weekly: number;
    daily: number;
    growth_rate: number; // Percentage
  };
  customers: {
    total: number;
    new_this_month: number;
    active_subscribers: number;
    churn_rate: number;
  };
  bookings: {
    total: number;
    completed: number;
    upcoming: number;
    completion_rate: number;
  };
  referrals: {
    total_sent: number;
    total_successful: number;
    conversion_rate: number;
    credits_awarded: number;
  };
  reviews: {
    average_rating: number;
    total_reviews: number;
    featured_count: number;
  };
}
```

#### GET `/api/admin/dashboard/activity`
Get recent system activity.

**Response:**
```typescript
interface ActivityResponse {
  activities: Array<{
    id: string;
    type: 'booking_created' | 'payment_completed' | 'review_submitted' | 'referral_accepted';
    user_email: string;
    description: string;
    amount?: number; // For payment activities
    created_at: string;
  }>;
}
```

### User Management

#### GET `/api/admin/users`
Search and list users.

**Query Parameters:**
- `search`: Email, name, or phone search
- `limit`: Results per page (default: 20)
- `offset`: Pagination offset
- `sort`: Sort by (created_at, credits, bookings)
- `order`: asc | desc

**Response:**
```typescript
interface AdminUsersResponse {
  users: Array<{
    id: string;
    email: string;
    full_name: string;
    phone: string;
    credits: number;
    referral_code: string;
    created_at: string;
    stats: {
      total_bookings: number;
      lifetime_value: number;
      last_booking: string;
      successful_referrals: number;
    };
  }>;
  total_count: number;
}
```

#### GET `/api/admin/users/[id]`
Get detailed user information.

#### POST `/api/admin/users/[id]/credits`
Adjust user credit balance.

**Request Body:**
```typescript
interface CreditAdjustmentRequest {
  amount: number; // Positive or negative
  type: 'adjustment' | 'refund' | 'bonus';
  description: string;
  reference_id?: string;
}
```

### Booking Management

#### GET `/api/admin/bookings`
Get all bookings with admin filters.

**Query Parameters:**
- `status`: Filter by status
- `date_from`: Start date filter
- `date_to`: End date filter
- `service_type`: Filter by service
- `user_id`: Filter by user

#### PATCH `/api/admin/bookings/[id]`
Update booking status or details.

**Request Body:**
```typescript
interface AdminBookingUpdateRequest {
  status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  internal_notes?: string; // Admin-only notes
  date_time?: string; // Reschedule
}
```

### Order Management

#### GET `/api/admin/orders`
Get all payment orders.

#### POST `/api/admin/orders/[id]/refund`
Process order refund.

**Request Body:**
```typescript
interface AdminRefundRequest {
  amount?: number; // Partial refund amount
  reason: string;
  notify_customer: boolean;
}
```

---

## 🔔 Webhook Integration

### Bolt Payment Webhooks

#### POST `/api/webhooks/bolt`
Receive Bolt payment status updates.

**Webhook Events:**
- `payment.completed`
- `payment.failed`
- `subscription.created`
- `subscription.cancelled`
- `subscription.updated`
- `refund.processed`

**Webhook Payload:**
```typescript
interface BoltWebhookPayload {
  event: string;
  data: {
    checkout: {
      id: string;
      status: string;
      total_amount: number;
    };
    payment: {
      id: string;
      status: string;
      processor_response_code?: string;
    };
    order: {
      reference: string; // Our order ID
    };
  };
  created_at: string;
}
```

**Webhook Processing:**
```typescript
// Verify webhook signature
import crypto from 'crypto'

const verifyBoltSignature = (payload: string, signature: string) => {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.BOLT_WEBHOOK_SECRET!)
    .update(payload)
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  )
}

// Process webhook
export async function POST(request: Request) {
  const signature = request.headers.get('bolt-signature')
  const body = await request.text()
  
  if (!verifyBoltSignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }
  
  const event = JSON.parse(body)
  await processPaymentEvent(event)
  
  return NextResponse.json({ success: true })
}
```

### Instagram Webhooks (Optional)

#### POST `/api/webhooks/instagram`
Receive Instagram media updates.

---

## ❌ Error Handling

### Standard Error Response Format
```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  request_id: string;
}
```

### Common Error Codes

#### Authentication Errors (401)
```typescript
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired access token"
  }
}
```

#### Authorization Errors (403)
```typescript
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions for this operation"
  }
}
```

#### Validation Errors (400)
```typescript
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

#### Resource Not Found (404)
```typescript
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Booking not found"
  }
}
```

#### Business Logic Errors (422)
```typescript
{
  "error": {
    "code": "BOOKING_CONFLICT",
    "message": "Time slot no longer available"
  }
}
```

#### Rate Limiting (429)
```typescript
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "details": {
      "reset_time": "2024-09-19T10:30:00Z",
      "limit": 100,
      "remaining": 0
    }
  }
}
```

### Error Handling Best Practices
```typescript
// Client-side error handling
const apiCall = async (endpoint: string, options: RequestInit) => {
  try {
    const response = await fetch(endpoint, options)
    
    if (!response.ok) {
      const error = await response.json()
      throw new APIError(error.error.code, error.error.message, response.status)
    }
    
    return await response.json()
  } catch (error) {
    if (error instanceof APIError) {
      // Handle specific API errors
      switch (error.code) {
        case 'UNAUTHORIZED':
          // Redirect to login
          break
        case 'BOOKING_CONFLICT':
          // Show availability picker
          break
        default:
          // Show generic error
      }
    }
    throw error
  }
}

class APIError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number
  ) {
    super(message)
    this.name = 'APIError'
  }
}
```

---

## ⏱️ Rate Limiting

### Rate Limit Headers
All API responses include rate limiting headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642680000
X-RateLimit-Window: 3600
```

### Rate Limits by Endpoint Type

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Authentication | 10 requests | 15 minutes |
| Booking Creation | 5 requests | 5 minutes |
| General API | 100 requests | 1 hour |
| Admin API | 1000 requests | 1 hour |
| Webhooks | No limit | - |

### Rate Limiting Implementation
```typescript
// Check rate limit before processing
const checkRateLimit = async (userId: string, action: string) => {
  const key = `rate_limit:${action}:${userId}`
  const current = await redis.incr(key)
  
  if (current === 1) {
    await redis.expire(key, getRateLimitWindow(action))
  }
  
  const limit = getRateLimit(action)
  if (current > limit) {
    throw new RateLimitError('Rate limit exceeded')
  }
  
  return {
    limit,
    remaining: Math.max(0, limit - current),
    reset: Date.now() + (getRateLimitWindow(action) * 1000)
  }
}
```

---

## 📚 SDK & Integration Examples

### JavaScript/TypeScript SDK

```typescript
class RecoveryMachineAPI {
  private baseURL: string
  private accessToken: string
  
  constructor(baseURL: string, accessToken: string) {
    this.baseURL = baseURL
    this.accessToken = accessToken
  }
  
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new APIError(error.error.code, error.error.message, response.status)
    }
    
    return response.json()
  }
  
  // Booking methods
  async getAvailability(date: string, duration = 30) {
    return this.request<AvailabilityResponse>(
      `/api/bookings/availability?date=${date}&duration=${duration}`
    )
  }
  
  async createBooking(booking: BookingRequest) {
    return this.request<BookingResponse>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(booking)
    })
  }
  
  async getBookings(filters: { status?: string; limit?: number } = {}) {
    const params = new URLSearchParams(filters as any)
    return this.request<BookingsResponse>(`/api/bookings?${params}`)
  }
  
  // Payment methods
  async createCheckout(checkout: CheckoutRequest) {
    return this.request<CheckoutResponse>('/api/payments/checkout', {
      method: 'POST',
      body: JSON.stringify(checkout)
    })
  }
  
  // Referral methods
  async getReferrals() {
    return this.request<ReferralsResponse>('/api/referrals')
  }
  
  async sendReferralInvite(invitation: ReferralInviteRequest) {
    return this.request<ReferralInviteResponse>('/api/referrals/invite', {
      method: 'POST',
      body: JSON.stringify(invitation)
    })
  }
}

// Usage example
const api = new RecoveryMachineAPI(
  'https://your-domain.com',
  userAccessToken
)

// Book a session
const availability = await api.getAvailability('2024-09-20')
const booking = await api.createBooking({
  date_time: '2024-09-20T10:00:00Z',
  service_type: 'combo',
  address: {
    street: '123 Main St',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90210'
  }
})
```

### React Hook Examples

```typescript
// Custom hook for bookings
const useBookings = () => {
  const [bookings, setBookings] = useState<BookingResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.getBookings()
      setBookings(response.bookings)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])
  
  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])
  
  const createBooking = async (bookingData: BookingRequest) => {
    const newBooking = await api.createBooking(bookingData)
    setBookings(prev => [newBooking, ...prev])
    return newBooking
  }
  
  return {
    bookings,
    loading,
    error,
    createBooking,
    refetch: fetchBookings
  }
}

// Usage in component
const BookingsList = () => {
  const { bookings, loading, error, createBooking } = useBookings()
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      {bookings.map(booking => (
        <div key={booking.id}>
          {booking.service_type} - {booking.date_time}
        </div>
      ))}
    </div>
  )
}
```

---

## 🧪 Testing & Development

### API Testing with Jest

```typescript
// Test utilities
const createTestUser = async () => {
  const { data: { user } } = await supabase.auth.signUp({
    email: `test-${Date.now()}@example.com`,
    password: 'test-password'
  })
  return user
}

const getTestAccessToken = async (user: any) => {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

// Example test
describe('Booking API', () => {
  let testUser: any
  let accessToken: string
  
  beforeEach(async () => {
    testUser = await createTestUser()
    accessToken = await getTestAccessToken(testUser)
  })
  
  test('should create booking successfully', async () => {
    const bookingData = {
      date_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      service_type: 'combo',
      address: {
        street: '123 Test St',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90210'
      }
    }
    
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    })
    
    expect(response.status).toBe(201)
    
    const booking = await response.json()
    expect(booking.service_type).toBe('combo')
    expect(booking.user_id).toBe(testUser.id)
  })
  
  afterEach(async () => {
    // Cleanup test data
    await supabase.auth.admin.deleteUser(testUser.id)
  })
})
```

### Postman Collection

Create a Postman collection with pre-configured requests:

```json
{
  "info": {
    "name": "Recovery Machine API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{access_token}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "base_url",
      "value": "https://your-domain.com"
    },
    {
      "key": "access_token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Sign Up",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\",\n  \"full_name\": \"Test User\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/auth/signup",
              "host": ["{{base_url}}"],
              "path": ["api", "auth", "signup"]
            }
          }
        }
      ]
    },
    {
      "name": "Bookings",
      "item": [
        {
          "name": "Get Availability",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{base_url}}/api/bookings/availability?date=2024-09-20",
              "host": ["{{base_url}}"],
              "path": ["api", "bookings", "availability"],
              "query": [
                {
                  "key": "date",
                  "value": "2024-09-20"
                }
              ]
            }
          }
        }
      ]
    }
  ]
}
```

### Development Environment Setup

```bash
# Clone repository
git clone https://github.com/your-org/recovery-machine-web
cd recovery-machine-web

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase and other service credentials

# Run database migrations
npm run db:migrate

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

### Environment Variables for Development

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Bolt (use sandbox for development)
BOLT_API_KEY=your-bolt-sandbox-key
BOLT_WEBHOOK_SECRET=your-webhook-secret
NEXT_PUBLIC_BOLT_PUBLISHABLE_KEY=your-bolt-sandbox-publishable-key

# Google Maps (restrict to development domains)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key

# Email & SMS (use test/sandbox modes)
RESEND_API_KEY=your-resend-key
TWILIO_ACCOUNT_SID=your-twilio-sandbox-sid
TWILIO_AUTH_TOKEN=your-twilio-sandbox-token

# Instagram (optional for development)
INSTAGRAM_ACCESS_TOKEN=your-instagram-token

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
WEBHOOK_URL=https://your-ngrok-url.ngrok.io/api/webhooks
```

---

## 📞 Support & Resources

### Development Support
- **API Documentation**: This reference guide
- **Database Schema**: See DATABASE_SCHEMA_REFERENCE.md
- **Admin Guide**: See ADMIN_QUICK_START_GUIDE.md
- **Complete Guide**: See RECOVERY_MACHINE_COMPLETE_GUIDE.md

### Testing Resources
- **Postman Collection**: Available in `/docs/postman/`
- **Test Data**: Sample data generators in `/tests/fixtures/`
- **Mock Services**: Mock payment and email services for testing

### External Service Documentation
- **Supabase**: https://supabase.com/docs
- **Bolt Payments**: https://help.bolt.com/developers/
- **Google Maps**: https://developers.google.com/maps/documentation
- **Resend Email**: https://resend.com/docs
- **Twilio SMS**: https://www.twilio.com/docs

---

*This API reference is maintained by the development team and updated with each API version release. For API support or feature requests, please contact the technical team.*