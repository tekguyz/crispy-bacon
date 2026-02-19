
# 🛠️ Configuration Guide
**Status:** System Setup

This document outlines the keys and cloud settings required to deploy the application.

## 1. Environment Variables

### Frontend (.env)
These identifiers act as the client's public passport.
- `VITE_SUPABASE_DATABASE_URL`: Your Supabase Project URL.
- `VITE_SUPABASE_ANON_KEY`: Your Supabase Public Key.
- `VITE_APP_VERSION`: Current build version (e.g., 2.6.0).

### Backend (Netlify / Serverless)
These secure the gateway functions and must **never** be exposed to the public.
- `API_KEY`: Google Gemini API Key (Required for all AI features).
- `STRIPE_SECRET_KEY`: Stripe Secret Key.
- `STRIPE_WEBHOOK_SECRET`: Key for verifying payment events.
- `STRIPE_PRICE_ID`: The specific ID for the "Executive" plan.
- `SUPABASE_URL`: (Same as Frontend URL).
- `SUPABASE_SERVICE_ROLE_KEY`: The Admin key. Required for updating user tiers securely.
- `GOOGLE_CLIENT_ID`: Required for Google Drive/Calendar integrations.
- `GOOGLE_CLIENT_SECRET`: Required for Google Drive/Calendar integrations.

## 2. Google Cloud Platform (GCP)
**Project Required:** Yes

### Enabled Services
1. **Google Calendar API**: For schedule syncing.
2. **Google Drive API**: For file import.

### Permissions (Scopes)
Ensure the client ID has access to:
- Calendar (Read Only)
- Tasks (Read Only)
- Drive (Read Only)
- Email & Profile

## 3. Database Setup (Supabase)
**Storage Buckets:**
- `meetings`: Private folder for audio files. Max file size 50MB.

**Core Tables:**
- `profiles`: User account details and tier status.
- `insights`: The central notes table.
- `summaries`: The analysis data linked to notes.
- `shared_links`: Public access tokens.
- `collections` / `tags`: Organization folders and labels.

## 4. Stripe Setup
**Mode:** Subscription
**Events:** Listen for `checkout.session.completed`
**Endpoint:** `/.netlify/functions/stripe-webhook`

---
*Engineering Core*
