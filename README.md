# Stream-It
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![LiveKit](https://img.shields.io/badge/LiveKit-Realtime-FF6B6B)

A full-stack live streaming platform built with Next.js, featuring real-time video streaming, live chat, creator dashboards, and viewer interactions — similar in spirit to Twitch.

**Live Demo:** ([stream-it-1ps8.vercel.app](https://stream-it-1ps8.vercel.app/))

---

## Overview

Stream It is a live streaming application where creators can broadcast in real time and viewers can watch, chat, and follow channels. It handles the full lifecycle of a streaming platform: authentication, ingress/egress media handling, real-time chat, follower/blocking relationships, and creator moderation tools.

## Features

- **Live streaming** via RTMP ingest, powered by LiveKit's real-time media infrastructure
- **Creator dashboard** for managing stream keys, stream metadata, and live status
- **Real-time chat** with configurable slow mode and followers-only mode
- **Authentication** handled by Clerk, with webhook-driven user sync to the database
- **Follow / Block system** for managing viewer relationships
- **Community moderation tools** for creators to manage their audience
- **Thumbnail & avatar uploads** via UploadThing
- **Search & discovery** for browsing live and offline channels
- **Responsive UI** built with Tailwind CSS and shadcn/ui

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router), React 18, TypeScript |
| Authentication | Clerk |
| Real-time Media | LiveKit |
| Database / ORM | PostgreSQL (Supabase) + Prisma |
| File Uploads | UploadThing |
| State Management | Zustand |
| Styling | Tailwind CSS, shadcn/ui, Radix UI |
| Deployment | Vercel |

## Architecture

```
app/            App Router pages, layouts, and API route handlers
actions/        Server actions ("use server") for all write operations
components/     Reusable UI and stream/player components
lib/            Data access layer and business services
hooks/          Custom React hooks
store/          Zustand client-side stores
prisma/         Database schema and migrations
```

**Data flow:** UI calls a server action → the action validates the actor/context and mutates data via Prisma → `revalidatePath` refreshes the relevant route segment.

**Streaming flow:** A creator generates an ingress key from the dashboard → streams via OBS (or similar) to the LiveKit RTMP endpoint → a LiveKit webhook flips the stream's live status → viewers connect to the LiveKit room through a viewer token issued by a server action.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm (or yarn / pnpm / bun)
- [Git](https://git-scm.com/)
- Free accounts on the following services:
  - [Supabase](https://supabase.com/) — PostgreSQL database
  - [Clerk](https://clerk.com/) — authentication
  - [LiveKit](https://livekit.io/) — real-time streaming
  - [UploadThing](https://uploadthing.com/) — file uploads
  - [ngrok](https://ngrok.com/) — for testing webhooks locally

### 1. Clone the repository

```bash
git clone https://github.com/amanjaiswal7236/stream-it.git
cd stream-it
```

### 2. Install dependencies

```bash
npm install
```

This also runs `prisma generate` automatically via the `postinstall` script.

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
# Database (Supabase — use the pooled connection for the app)
DATABASE_URL="postgresql://postgres.xxxx:yourpassword@aws-x-xx-xxxx-x.pooler.supabase.com:6543/postgres"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxx
CLERK_SECRET_KEY=sk_test_xxxx
CLERK_WEBHOOK_SECRET=whsec_xxxx

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# LiveKit
LIVEKIT_API_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=APIxxxxxxxxxx
LIVEKIT_API_SECRET=your_livekit_secret
NEXT_PUBLIC_LIVEKIT_WS_URL=wss://your-project.livekit.cloud

# UploadThing
UPLOADTHING_SECRET=sk_live_xxxx
UPLOADTHING_APP_ID=your_app_id
```

> **Note on Supabase connection strings:** use the **pooled connection** (port `6543`) for `DATABASE_URL` so the running app benefits from connection pooling. If `prisma db push` hangs on the pooled URL, temporarily switch to the **direct connection** (port `5432`) for the migration, then switch back.
>
> **Note on special characters:** if your database password contains symbols like `#`, `@`, or `%`, they must be URL-encoded (`#` → `%23`, `@` → `%40`, etc.).

### 4. Sync the database schema

```bash
npx prisma db push
```

You should see:
```
Your database is now in sync with your Prisma schema.
```

Optionally, browse your data with:
```bash
npx prisma studio
```

### 5. Set up the Clerk webhook (for local development)

Clerk needs a public URL to deliver webhooks to your local machine.

```bash
ngrok http 3000
```

Copy the HTTPS forwarding URL ngrok gives you, then in the **Clerk Dashboard → Webhooks**, add or update an endpoint:

```
https://<your-ngrok-url>/api/webhooks/clerk
```

Subscribe to the `user.created`, `user.updated`, and `user.deleted` events, and copy the **Signing Secret** into `CLERK_WEBHOOK_SECRET` in your `.env`.

> Make sure **Username** is enabled and required under **Clerk Dashboard → Configure → User & Authentication → Email, Phone, Username** — the app requires a non-null username on user creation.
>
> ngrok's free tier generates a new URL every time it restarts, so the webhook endpoint must be updated each time you start a fresh ngrok session.

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Go live

1. Sign up through the app (this triggers the Clerk webhook and creates your user record)
2. Navigate to your **Dashboard → Keys** and generate a stream key
3. In [OBS Studio](https://obsproject.com/) (or any RTMP-compatible streaming software), set:
   - **Server:** the RTMP URL from your Keys page
   - **Stream Key:** the key from your Keys page
4. Click **Start Streaming** in OBS — your channel should go live

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint checks |
| `npx prisma studio` | Open a visual database browser |
| `npx prisma db push` | Sync the Prisma schema to the database |

---

## Known Limitations

- No automated test suite is currently configured
- Some LiveKit environment variable names are inconsistent between the token route and player config
- A small number of Prisma models are defined but not yet fully wired into the UI

These are tracked as areas for future improvement — see `PROJECT_INDEX.md` for the full architectural breakdown.

---

## Deployment

The easiest way to deploy this app is via [Vercel](https://vercel.com/), the platform built by the creators of Next.js. Remember to:

- Set all environment variables in your Vercel project settings
- Update the Clerk webhook endpoint to point to your production domain
- Use a production-tier Supabase connection string

See the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## License

This project is open source and available for learning purposes.
