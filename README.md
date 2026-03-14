# FreightFlow

FreightFlow is a Next.js 15 MVP for an intelligent digital freight marketplace. Shippers can post loads, carriers can discover them and place bids, and both roles get focused dashboards backed by Supabase Auth, Postgres, and Realtime.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Supabase Auth + Postgres + Realtime
- Vercel-ready deployment

## Features

- Email/password authentication with role-aware onboarding
- Shipper dashboard with posted loads and incoming bid visibility
- Carrier dashboard with marketplace access and personal bid tracking
- Load board filtering by route and cargo type
- Load detail pages with live bid refresh using Supabase Realtime
- Protected routes for authenticated and role-specific workflows

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local env file:

```bash
cp .env.example .env.local
```

3. Fill in:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. In Supabase SQL Editor, run [supabase/schema.sql](/C:/Users/admin/Desktop/hackathon-2026/supabase/schema.sql).

5. In Supabase Auth settings, disable email confirmation for local MVP testing.

6. Start the app:

```bash
npm run dev
```

## Database Notes

The schema creates:

- `public.users` for role metadata mapped to `auth.users`
- `public.loads` for shipper-posted loads
- `public.bids` for carrier bids

It also enables row-level security and adds a trigger so every new auth user gets a matching `public.users` record automatically using the selected role.

## Auth Setup

For this MVP, use instant email/password signup without confirmation emails.

In Supabase:

- Open Authentication -> Providers -> Email
- Disable email confirmation
- Save the settings before testing signup

## Deploying To Vercel

1. Import the repository into Vercel.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Ensure the Supabase schema has been applied.
4. Deploy.
