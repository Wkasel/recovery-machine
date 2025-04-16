# Authentication Upgrade Plan

## 1. Google OAuth Integration

### Tasks

1. Enable Google OAuth provider in Supabase dashboard
2. Configure OAuth credentials:
   - Create Google Cloud project
   - Set up OAuth consent screen
   - Generate client ID and secret
   - Add authorized redirect URIs
3. Add Google sign-in button component
4. Implement sign-in with Google action:

```typescript
await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${origin}/auth/callback`,
  },
});
```

## 2. Phone Number Authentication (Twilio)

### Tasks

1. Set up Twilio account and get credentials
2. Enable Phone Auth in Supabase dashboard
3. Configure Twilio credentials in Supabase
4. Create phone number verification UI components
5. Implement phone auth actions:

```typescript
// Phone sign-up
await supabase.auth.signInWithOtp({
  phone: phoneNumber,
});

// Verify OTP
await supabase.auth.verifyOtp({
  phone: phoneNumber,
  token: otpCode,
  type: "sms",
});
```

## 3. Magic Link Authentication

### Tasks

1. Disable password-based auth in Supabase dashboard
2. Update sign-in form to remove password field
3. Implement magic link flow:

```typescript
await supabase.auth.signInWithOtp({
  email: email,
  options: {
    emailRedirectTo: `${origin}/auth/callback`,
  },
});
```

4. Add email templates for magic links
5. Update success messages and UI flows

## 4. One-Time Password (OTP) Implementation

### Tasks

1. Create OTP input component
2. Implement email OTP flow:

```typescript
// Request OTP
await supabase.auth.signInWithOtp({
  email: email,
  options: { channel: "email" },
});

// Verify OTP
await supabase.auth.verifyOtp({
  email: email,
  token: otpCode,
  type: "email",
});
```

3. Add rate limiting UI feedback
4. Implement resend functionality

## 5. Security Enhancements

### Tasks

1. Configure custom email templates:
   - Magic link emails
   - OTP emails
   - Welcome emails
2. Set up custom SMS templates for Twilio
3. Implement progressive rate limiting
4. Add multi-factor authentication option
5. Implement session management improvements

## 6. UI/UX Improvements

### Tasks

1. Create unified auth provider selection screen
2. Add loading states and animations
3. Implement better error handling and messages
4. Add "Remember this device" option
5. Create account linking interface for multiple providers

## Implementation Order

1. Magic Link Authentication
   - Simplest to implement
   - Improves user experience immediately
2. Google OAuth
   - High adoption rate
   - Trusted provider
3. OTP Implementation
   - Foundation for phone auth
   - Additional security layer
4. Phone Authentication

   - Requires Twilio setup
   - More complex implementation

5. Security Enhancements

   - Iterative improvements
   - Based on usage patterns

6. UI/UX Improvements
   - Continuous refinement
   - Based on user feedback

## Notes

- Test each authentication method thoroughly in development
- Monitor auth metrics after each implementation
- Gather user feedback on new auth methods
- Consider implementing gradual rollout for new methods
- Keep documentation updated with new auth flows
