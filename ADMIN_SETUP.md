# Admin Setup Instructions

## 1. Create Admin User

Run this SQL in your Supabase SQL Editor or via CLI:

```sql
-- Create admins table if it doesn't exist
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to read their own data
CREATE POLICY "Admins can read own data" ON admins
  FOR SELECT USING (auth.jwt() ->> 'email' = email);

-- Insert admin user
INSERT INTO admins (email, role, is_active) 
VALUES ('william@dsco.co', 'admin', true)
ON CONFLICT (email) DO UPDATE SET
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Check existing admins
SELECT * FROM admins;
```

## 2. Test Admin Access

1. **Login**: Go to `/sign-in` and login with `william@dsco.co`
2. **Access Admin**: Visit `/admin` - should now work without redirecting to sign-in
3. **Debug Info**: In development, you'll see the AuthDebug component showing your auth status

## 3. Fixes Applied

### ✅ Admin Authentication (SSR)
- **Before**: Client-side auth with `useEffect` (broken redirects)
- **After**: Server-side auth with proper SSR patterns

### ✅ Double Logo Issue
- **Before**: Auth layout + individual pages both had full page layouts
- **After**: Pages only contain card content, layout handles positioning

### 🛠️ Architecture
```
app/(auth-pages)/
├── layout.tsx          # Handles: Logo, background, positioning 
├── sign-in/page.tsx    # Handles: Only the card content
└── sign-up/page.tsx    # Handles: Only the card content

app/admin/
└── layout.tsx          # Server-side auth check + client wrapper
```

## 4. Next Steps

1. **Verify Admin Access**: Login and visit `/admin`
2. **Remove Debug Components**: Remove `<AuthDebug />` from production
3. **Test All Auth Flows**: Sign-in, sign-up, magic links
4. **Add More Admins**: Use the SQL above with different emails