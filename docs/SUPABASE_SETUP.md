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

3. **Email Templates** (See detailed templates in Part 3.5 below)
   - Click **Email Templates** tab
   - Customize these templates with your branding:
     - **Confirm signup** - Sent when user signs up
     - **Magic Link** - For passwordless login
     - **Change Email Address** - Confirmation for email changes
     - **Reset Password** - Password reset emails

## Part 2.5: Email Templates

Copy and paste these templates into Supabase → **Authentication** → **Email Templates**:

### 1. Confirm Signup Email

**Subject:** `Welcome to GOAT Sports - Confirm Your Email`

**Message Body:**
```html
<h2>Welcome to GOAT Sports! 🏒</h2>

<p>Thanks for signing up! You're one step away from creating your fantasy hockey dynasty.</p>

<p>Please confirm your email address by clicking the button below:</p>

<p style="text-align: center; margin: 30px 0;">
  <a href="{{ .ConfirmationURL }}"
     style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
    Confirm Email Address
  </a>
</p>

<p>Or copy and paste this link into your browser:</p>
<p style="word-break: break-all; color: #6b7280;">{{ .ConfirmationURL }}</p>

<p style="margin-top: 40px; color: #6b7280; font-size: 14px;">
  If you didn't create a GOAT Sports account, you can safely ignore this email.
</p>

<p style="margin-top: 20px;">
  Best regards,<br>
  The GOAT Sports Team
</p>
```

### 2. Magic Link Email

**Subject:** `Sign in to GOAT Sports`

**Message Body:**
```html
<h2>Sign in to GOAT Sports 🏒</h2>

<p>Click the button below to securely sign in to your account:</p>

<p style="text-align: center; margin: 30px 0;">
  <a href="{{ .ConfirmationURL }}"
     style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
    Sign In Now
  </a>
</p>

<p>Or copy and paste this link into your browser:</p>
<p style="word-break: break-all; color: #6b7280;">{{ .ConfirmationURL }}</p>

<p style="margin-top: 40px; color: #6b7280; font-size: 14px;">
  This link expires in 1 hour. If you didn't request this email, you can safely ignore it.
</p>

<p style="margin-top: 20px;">
  Best regards,<br>
  The GOAT Sports Team
</p>
```

### 3. Reset Password Email

**Subject:** `Reset Your GOAT Sports Password`

**Message Body:**
```html
<h2>Reset Your Password 🔒</h2>

<p>We received a request to reset your GOAT Sports password.</p>

<p>Click the button below to create a new password:</p>

<p style="text-align: center; margin: 30px 0;">
  <a href="{{ .ConfirmationURL }}"
     style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
    Reset Password
  </a>
</p>

<p>Or copy and paste this link into your browser:</p>
<p style="word-break: break-all; color: #6b7280;">{{ .ConfirmationURL }}</p>

<p style="margin-top: 40px; color: #6b7280; font-size: 14px;">
  This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email - your password will not be changed.
</p>

<p style="margin-top: 20px;">
  Best regards,<br>
  The GOAT Sports Team
</p>
```

### 4. Change Email Address

**Subject:** `Confirm Your New Email Address`

**Message Body:**
```html
<h2>Confirm Email Change 📧</h2>

<p>You recently requested to change your GOAT Sports email address.</p>

<p>Click the button below to confirm this change:</p>

<p style="text-align: center; margin: 30px 0;">
  <a href="{{ .ConfirmationURL }}"
     style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
    Confirm Email Change
  </a>
</p>

<p>Or copy and paste this link into your browser:</p>
<p style="word-break: break-all; color: #6b7280;">{{ .ConfirmationURL }}</p>

<p style="margin-top: 40px; color: #6b7280; font-size: 14px;">
  If you didn't request this change, please contact support immediately - someone may be trying to access your account.
</p>

<p style="margin-top: 20px;">
  Best regards,<br>
  The GOAT Sports Team
</p>
```

### 5. Invite User Email (Optional)

**Subject:** `You've Been Invited to Join {{ .SiteURL }}`

**Message Body:**
```html
<h2>You've Been Invited! 🏒</h2>

<p>You've been invited to join a fantasy hockey league on GOAT Sports.</p>

<p>Click the button below to accept your invitation and create your account:</p>

<p style="text-align: center; margin: 30px 0;">
  <a href="{{ .ConfirmationURL }}"
     style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
    Accept Invitation
  </a>
</p>

<p>Or copy and paste this link into your browser:</p>
<p style="word-break: break-all; color: #6b7280;">{{ .ConfirmationURL }}</p>

<p style="margin-top: 40px; color: #6b7280; font-size: 14px;">
  This invitation expires in 7 days.
</p>

<p style="margin-top: 20px;">
  Best regards,<br>
  The GOAT Sports Team
</p>
```

**How to Apply Templates:**
1. Go to Supabase Dashboard → **Authentication** → **Email Templates**
2. Select each template type from the dropdown
3. Replace the default content with the templates above
4. Click **Save** for each template

## Part 3: Configure Discord OAuth

1. **Create Discord Application**
   - Go to https://discord.com/developers/applications
   - Click **New Application**
   - Name it: `GOAT Sports`
   - Accept the Terms of Service
   - Click **Create**

2. **Configure OAuth2 Settings**
   - In your application, click **OAuth2** in the left sidebar
   - Under **OAuth2 → General**, find your:
     - **Client ID** - Copy this
     - **Client Secret** - Click **Reset Secret** if needed, then copy

3. **Set Redirect URIs**
   - Still in **OAuth2 → General**, scroll to **Redirects**
   - Click **Add Redirect**
   - Add these URIs (one at a time):
     ```
     https://fvxthqcqumkskrwklrmu.supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback
     ```
   - For production (when deployed), also add:
     ```
     https://your-domain.com/auth/callback
     ```
   - Click **Save Changes**

4. **Configure in Supabase**
   - Go to Supabase dashboard → **Authentication** → **Providers**
   - Find **Discord** in the list
   - Toggle it **ON**
   - Paste your Discord **Client ID**
   - Paste your Discord **Client Secret**
   - The **Callback URL** is auto-generated (should show):
     ```
     https://fvxthqcqumkskrwklrmu.supabase.co/auth/v1/callback
     ```
   - Click **Save**

5. **Optional: Add Bot (for future Discord integration)**
   - In Discord Developer Portal, click **Bot** in the left sidebar
   - Click **Add Bot** (if you plan to send Discord notifications later)
   - For now, OAuth2 login is all you need

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

3. **Test Discord OAuth Flow**
   - Navigate to http://localhost:3000/auth/login
   - Click "Continue with Discord"
   - Sign in with your Discord account
   - Authorize the GOAT Sports application
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

### Discord OAuth not working?
- Verify redirect URIs exactly match in both Discord Developer Portal and Supabase
- Make sure you saved changes in Discord Developer Portal after adding redirects
- Check that the application is not in a deleted state
- Clear browser cookies and try again
- Try in an incognito/private browsing window

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
