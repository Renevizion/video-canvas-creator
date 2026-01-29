# Authentication Setup Guide

## Overview
This application now uses Supabase authentication to secure user data. Each user has their own isolated data store with proper access controls.

## Features
- ✅ User registration and login
- ✅ Password-based authentication
- ✅ Automatic session management
- ✅ Protected routes (requires authentication)
- ✅ User-specific data isolation
- ✅ Row-level security (RLS) policies
- ✅ Secure storage with user-scoped access

## Quick Start

### 1. Sign Up
1. Navigate to the application URL
2. You'll be redirected to the `/auth` page
3. Click on the "Sign Up" tab
4. Enter your email and password (minimum 6 characters)
5. Click "Create Account"
6. Check your email for a confirmation link (if email confirmation is enabled)

### 2. Sign In
1. Go to the `/auth` page
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to the dashboard

### 3. Sign Out
1. Click on the user icon in the top-right corner of the header
2. Select "Sign Out" from the dropdown menu
3. You'll be redirected to the authentication page

## For Developers

### Environment Variables
Ensure these environment variables are set in your `.env` file:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### Database Setup

#### Apply Migrations
If running locally, apply the migrations:
```bash
supabase migration up
```

Or for cloud:
1. Go to Supabase Dashboard → SQL Editor
2. Run the migration files in order:
   - `20260124194412_08c01afc-ab2f-45c7-b117-58fe380b7dbc.sql`
   - `20260129195200_add_auth_support.sql`

#### Key Database Changes
- **user_id columns** added to `video_patterns` and `video_plans`
- **RLS policies** enforce user-specific access
- **Storage policies** organize files by user_id

### Code Structure

#### Authentication Context
Location: `src/contexts/AuthContext.tsx`

Provides:
- `user` - Current authenticated user
- `session` - Current session
- `loading` - Auth initialization state
- `signUp(email, password)` - Register new user
- `signIn(email, password)` - Authenticate user
- `signOut()` - End session

Usage:
```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, signOut } = useAuth();
  
  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

#### Protected Routes
Location: `src/components/auth/ProtectedRoute.tsx`

Wraps routes that require authentication:
```typescript
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

#### Data Hooks
Location: `src/hooks/useSupabaseData.ts`

User-scoped data operations:
- `useVideoPlans()` - Fetch user's video plans
- `usePatterns()` - Fetch user's patterns
- `useCreateVideoPlan()` - Create new video plan
- `useUpdateVideoPlan()` - Update video plan
- `useCreatePattern()` - Create new pattern
- `useDeleteVideoPlan()` - Delete video plan

All hooks automatically filter data by the current authenticated user.

#### Input Sanitization
Location: `src/lib/sanitization.ts`

Utilities for sanitizing user input:
```typescript
import { sanitizeText, sanitizeUrl, sanitizeEmail } from '@/lib/sanitization';

const cleanText = sanitizeText(userInput);
const cleanUrl = sanitizeUrl(urlInput);
const cleanEmail = sanitizeEmail(emailInput);
```

### Security Features

#### Row-Level Security (RLS)
All tables have RLS enabled with policies that:
- Restrict SELECT to user's own records
- Restrict INSERT to user's own records
- Restrict UPDATE to user's own records
- Restrict DELETE to user's own records

#### Storage Security
Storage buckets are organized by user:
```
bucket-name/
  └── {user_id}/
      └── file.mp4
```

Policies ensure users can only access their own folders.

#### Input Validation
- Email format validation
- Password minimum length (6 characters)
- Text sanitization (remove null bytes, trim, limit length)
- URL validation
- JSON validation
- Numeric bounds checking

### Testing Authentication

#### Manual Testing
1. **Sign Up Flow**
   - Create a new account
   - Verify email confirmation (if enabled)
   - Check database for user record

2. **Sign In Flow**
   - Log in with credentials
   - Verify redirect to dashboard
   - Check session persistence (refresh page)

3. **Protected Routes**
   - Try accessing protected routes without auth
   - Verify redirect to /auth
   - Sign in and verify access granted

4. **Data Isolation**
   - Create data as User A
   - Sign out and sign in as User B
   - Verify User B cannot see User A's data

5. **Sign Out Flow**
   - Click sign out
   - Verify redirect to /auth
   - Try accessing protected route
   - Verify redirect to /auth

#### Build Verification
```bash
npm run build
```
Should complete without errors.

### Troubleshooting

#### "User must be authenticated" error
**Cause**: User session expired or not authenticated
**Fix**: Sign in again

#### Blank screen after sign in
**Cause**: Protected routes not loading
**Fix**: Check browser console for errors, verify AuthContext is properly wrapped around app

#### Cannot see my data
**Cause**: RLS policies blocking access or data associated with different user
**Fix**: Check database to ensure user_id matches current user

#### Build fails
**Cause**: Missing dependencies or type errors
**Fix**: 
```bash
npm install
npm run build
```

#### Email confirmation not received
**Cause**: Email provider not configured in Supabase
**Fix**: 
1. Go to Supabase Dashboard → Authentication → Email Templates
2. Configure email provider (SMTP)
3. Or disable email confirmation for development:
   - Go to Authentication → Providers → Email
   - Disable "Confirm email"

### Development Tips

1. **Use React Query DevTools** to inspect cache and queries
2. **Check Supabase logs** in dashboard for RLS policy errors
3. **Test with multiple users** to ensure data isolation
4. **Clear browser storage** if having session issues
5. **Use TypeScript** for type safety with auth context

### Security Best Practices

1. **Never store passwords in code** - Use environment variables
2. **Always sanitize user input** - Use provided sanitization utilities
3. **Keep dependencies updated** - Run `npm audit` regularly
4. **Use HTTPS in production** - Required for secure authentication
5. **Rotate secrets** - Change Supabase keys if compromised
6. **Monitor auth logs** - Check Supabase dashboard for suspicious activity

## Support

For issues or questions:
1. Check Supabase Dashboard → Logs for errors
2. Review browser console for client-side errors
3. Refer to [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
4. Check this project's issue tracker

## Next Steps

After authentication is working:
1. Configure email templates in Supabase
2. Add password reset functionality
3. Implement OAuth providers (Google, GitHub, etc.)
4. Add user profile management
5. Set up monitoring and analytics
