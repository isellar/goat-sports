# Supabase Authentication Configuration Guide

This guide completes **Task #7: Configure Supabase Auth and environment** for Phase 1 of the MVP.

## Part 1: Get Service Role Key

1. **Navigate to Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project: `fvxthqcqumkskrwklrmu`

2. **Get the Service Role Key**
   - In the left sidebar, click **Settings** (gear icon at bottom)
   - Click **API** in the settings menu
   - Scroll to **Project API keys** section
   - Find the `service_role` key (it's marked as "secret")
   - Click the **Copy** button or **Reveal** to see it
   - ⚠️ **CRITICAL**: This key bypasses Row Level Security - never expose it client-side

3. **Add to .env.local**
   ```bash
   # Add this line to your .env.local file:
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## Part 2: Enable Email/Password Authentication

1. **Navigate to Authentication Settings**
   - In Supabase dashboard, click **Authentication** (lock icon) in left sidebar
   - Click **Providers** tab

2. **Configure Email Provider**
   - Find **Email** in the list of providers
   - It should already be enabled by default
   - Verify these settings:
     - ✅ **Enable Email provider** should be ON
     - ✅ **Confirm email** - Toggle based on your preference:
       - ON = Users must verify email before logging in (recommended for production)
       - OFF = Users can log in immediately (easier for development)
     - ✅ **Secure email change** - Keep ON (requires confirmation for email changes)

3. **Email Templates** (Optional but Recommended)
   - Click **Email Templates** tab
   - Customize these templates with your branding:
     - **Confirm signup** - Sent when user signs up
     - **Magic Link** - For passwordless login
     - **Change Email Address** - Confirmation for email changes
     - **Reset Password** - Password reset emails

   Example customization for "Confirm signup":
   ```html
   <h2>Welcome to GOAT Sports!</h2>
   <p>Please confirm your email address by clicking the link below:</p>
   <p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
   ```

## Part 3: Configure Google OAuth

1. **Create Google OAuth Credentials**
   - Go to https://console.cloud.google.com/
   - Create a new project or select existing one
   - Navigate to **APIs & Services** → **Credentials**
   - Click **+ CREATE CREDENTIALS** → **OAuth client ID**
   - Choose **Web application**

2. **Configure OAuth Consent Screen** (if first time)
   - Go to **APIs & Services** → **OAuth consent screen**
   - Choose **External** user type
   - Fill in required fields:
     - App name: `GOAT Sports`
     - User support email: Your email
     - Developer contact: Your email
   - Add scopes: `email`, `profile`
   - Save

3. **Set Authorized Redirect URIs**
   - In your OAuth client configuration, add these redirect URIs:
     ```
     http://localhost:3000/auth/callback
     https://fvxthqcqumkskrwklrmu.supabase.co/auth/v1/callback
     ```
   - For production (when deployed):
     ```
     https://your-domain.com/auth/callback
     https://fvxthqcqumkskrwklrmu.supabase.co/auth/v1/callback
     ```

4. **Get OAuth Credentials**
   - Copy your **Client ID** (looks like: `xxxxx.apps.googleusercontent.com`)
   - Copy your **Client Secret**

5. **Configure in Supabase**
   - Back in Supabase dashboard → **Authentication** → **Providers**
   - Find **Google** in the list
   - Toggle it **ON**
   - Paste your **Client ID**
   - Paste your **Client Secret**
   - **Callback URL** is auto-generated (should show):
     ```
     https://fvxthqcqumkskrwklrmu.supabase.co/auth/v1/callback
     ```
   - Click **Save**

## Part 4: Configure Site URL & Redirect URLs

1. **Navigate to URL Configuration**
   - In Supabase dashboard → **Authentication** → **URL Configuration**

2. **Set Site URL**
   ```
   Development: http://localhost:3000
   Production: https://your-domain.com
   ```

3. **Add Redirect URLs**
   Add these to the allowed redirect URLs list:
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000/leagues
   https://your-domain.com/auth/callback
   https://your-domain.com/leagues
   ```

## Part 5: Test Your Configuration

1. **Start your development server**
   ```bash
   bun run dev
   ```

2. **Test Email/Password Flow**
   - Navigate to http://localhost:3000/auth/signup
   - Create a test account
   - Check your email for confirmation (if enabled)
   - Try logging in at http://localhost:3000/auth/login

3. **Test Google OAuth Flow**
   - Navigate to http://localhost:3000/auth/login
   - Click "Continue with Google"
   - Sign in with your Google account
   - Should redirect back to /leagues

4. **Verify Authentication**
   - After login, you should see your user avatar in the top navigation
   - Click the avatar to see the user menu
   - Try accessing protected routes like /leagues
   - Try logging out

## Part 6: Update Your Environment File

Your complete `.env.local` should now have:

```env
# Existing variables
NEXT_PUBLIC_SUPABASE_URL=https://fvxthqcqumkskrwklrmu.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_Gl6B5bkN1swzB8-lMYNEtQ_gWaaSKx2
DATABASE_URL="postgresql://postgres.fvxthqcqumkskrwklrmu:kcAeKAJP38wmHdg@aws-1-us-east-1.pooler.supabase.com:6543/postgres"

# NEW - Add this from Supabase dashboard
SUPABASE_SERVICE_ROLE_KEY=<paste_your_service_role_key_here>
```

## Troubleshooting

### Email not sending?
- Check **Authentication** → **Email Templates** in Supabase
- Verify your email provider is configured
- For development, you can disable email confirmation

### Google OAuth not working?
- Verify redirect URIs exactly match in both Google Console and Supabase
- Check that OAuth consent screen is published (at least in testing mode)
- Clear browser cookies and try again

### "Invalid redirect URL" error?
- Add the redirect URL to **Authentication** → **URL Configuration** in Supabase
- Make sure Site URL is set correctly

### 401 Unauthorized errors?
- Verify `SUPABASE_SERVICE_ROLE_KEY` is in `.env.local`
- Restart your dev server after adding the key

## Security Checklist

- ✅ `SUPABASE_SERVICE_ROLE_KEY` is in `.env.local` (not `.env`)
- ✅ `.env.local` is in `.gitignore`
- ✅ Email confirmation is enabled for production
- ✅ Redirect URLs are restricted to your domains only
- ✅ OAuth credentials are kept secret

## What's Already Built

The authentication infrastructure is already implemented and waiting for this configuration:

- ✅ Server-side auth utilities (`lib/auth/server.ts`)
- ✅ Client-side auth hooks (`lib/auth/client.ts`)
- ✅ Route protection middleware (`middleware.ts`)
- ✅ Login/Signup pages (`app/auth/`)
- ✅ User menu and auth provider components
- ✅ Database profiles table

## Next Steps After Configuration

Once you've completed this Supabase configuration:

1. **Test the auth flow** - Signup → Login → Navigate to protected routes
2. **Update API routes** (Task #6) - Add `requireAuth()` to all endpoints
3. **Move to Phase 2** - Begin data population with Fantrax ETL

## Related Files

- Configuration guide: `docs/SUPABASE_SETUP.md` (this file)
- MVP Plan: `docs/MVP_PLAN.md`
- Auth utilities: `lib/auth/`
- Auth pages: `app/auth/`
- Middleware: `middleware.ts`
