# 🛠️ System Setup & Configuration
**Status:** Infrastructure Manifest

This document outlines the secrets, keys, and cloud configurations required to deploy the Hybrid Local-Cloud topology.

## 1. Environment Variables

### Frontend (.env)
These identifiers act as the client's public passport.
- `VITE_SUPABASE_DATABASE_URL`: Your Supabase Project URL.
- `VITE_SUPABASE_ANON_KEY`: Your Supabase Public/Anon Key.
- `VITE_APP_VERSION`: Current build version (e.g., 2.5.0).

### Backend (Netlify / Serverless)
These secure the bridge functions and must **never** be exposed to the client.
- `API_KEY`: Google Gemini API Key (AI Studio).
- `STRIPE_SECRET_KEY`: Stripe Secret Key (`sk_live` or `sk_test`).
- `STRIPE_WEBHOOK_SECRET`: Signing secret for the webhook endpoint.
- `STRIPE_PRICE_ID`: The specific Price ID for the "Executive" tier product.
- `SUPABASE_URL`: (Same as Frontend URL).
- `SUPABASE_SERVICE_ROLE_KEY`: The Admin key. Required for webhook database updates (bypassing RLS).

## 2. Google Cloud Platform (GCP)
**Project Required:** Yes
**OAuth Consent Screen:** External (or Internal for Org-only)

### Enabled APIs
1. **Google Calendar API**: For schedule sync.
2. **Google Drive API**: For file import.
3. **People API** (Optional): For contact context matching.

### OAuth Scopes
Ensure the client ID has access to:
- `https://www.googleapis.com/auth/calendar.readonly`
- `https://www.googleapis.com/auth/tasks.readonly`
- `https://www.googleapis.com/auth/drive.readonly`
- `openid`, `email`, `profile`

## 3. Supabase Schema
**Storage Buckets:**
- `meetings`: Private bucket. Max file size 50MB. Requires RLS policies for Owner-Only access.

**Core Tables:**
- `profiles`: Links to Auth Users. Tracks `is_pro` status.
- `insights`: The central research nodes.
- `summaries`: The distilled intelligence layer linked to insights.
- `shared_links`: Public access tokens for collaboration.
- `collections` / `tags`: Taxonomy organization.

## 4. Stripe Configuration
**Mode:** Subscription
**Events:** `checkout.session.completed`
**Endpoint:** `/.netlify/functions/stripe-webhook`

---
*Engineering Core*