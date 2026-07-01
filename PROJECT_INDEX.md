# Stream It - Project Index

This document is a practical map of the repository so contributors can quickly find where things live and how data and control flow through the app.

## 1) Project Identity

- Framework: Next.js App Router (`next@14`) + React 18 + TypeScript
- Domain: Live streaming platform with creator dashboard and viewer watch pages
- Auth: Clerk
- Realtime media: LiveKit
- Data layer: Prisma + MySQL
- File uploads: UploadThing
- UI stack: Tailwind + shadcn/ui + Radix

## 2) Top-Level Structure

- `app` - App Router pages, layouts, and API route handlers
- `actions` - server actions (`"use server"`) for all write operations
- `components` - reusable UI and stream/player UI
- `lib` - data access and business services
- `hooks` - custom React hooks
- `store` - Zustand client stores
- `prisma` - DB schema and migrations
- `public` - static assets

Operational/config files:

- `package.json` - scripts and dependencies
- `next.config.mjs` - Next runtime config
- `middleware.ts` - Clerk route protection
- `tailwind.config.ts`, `postcss.config.js` - styling pipeline
- `tsconfig.json` - TypeScript config + alias mapping
- `.eslintrc.json` - lint rules
- `components.json` - shadcn/ui config

## 3) Route and Entry Index

Global shell:

- `app/layout.tsx`
- `app/globals.css`
- `app/error.tsx`
- `app/not-found.tsx`

Route groups:

- Public browsing: `app/(browse)`
- Auth: `app/(auth)`
- Creator dashboard: `app/(dashboard)/u/[username]`

Main pages:

- Home: `app/(browse)/(home)/page.tsx`
- Search: `app/(browse)/search/page.tsx`
- Channel watch page: `app/(browse)/[username]/page.tsx`
- Dashboard home: `app/(dashboard)/u/[username]/(home)/page.tsx`
- Dashboard chat settings: `app/(dashboard)/u/[username]/chat/page.tsx`
- Dashboard stream keys: `app/(dashboard)/u/[username]/keys/page.tsx`
- Dashboard community: `app/(dashboard)/u/[username]/community/page.tsx`

API routes:

- Clerk webhook: `app/api/webhooks/clerk/route.ts`
- LiveKit webhook: `app/api/webhooks/livekit/route.ts`
- Participant token endpoint: `app/api/get-participant-token/route.ts`
- UploadThing route: `app/api/uploadthing/route.ts`

Server action entry files:

- `actions/user.ts`
- `actions/stream.ts`
- `actions/follow.ts`
- `actions/block.ts`
- `actions/ingress.ts`
- `actions/token.ts`

## 4) Feature Module Index

Browse/discovery:

- Feed and cards: `app/(browse)/(home)/_components`
- Search UI/results: `app/(browse)/search/_components`
- Left sidebar and nav: `app/(browse)/_components/sidebar`

Watch experience:

- Route composition: `app/(browse)/[username]/page.tsx`
- Player entry: `components/stream-player/index.tsx`
- Video rendering: `components/stream-player/video.tsx`, `live-video.tsx`, `offline-video.tsx`
- Chat and participants: `components/stream-player/chat.tsx`, `chat-form.tsx`

Creator dashboard:

- Dashboard sidebar/nav: `app/(dashboard)/u/[username]/_components/sidebar`
- Stream key management UI: `app/(dashboard)/u/[username]/keys/_components`
- Chat toggle/settings UI: `app/(dashboard)/u/[username]/chat/_components`
- Community moderation table: `app/(dashboard)/u/[username]/community/_components`

## 5) Data and Service Layer

Prisma + DB:

- Prisma client singleton: `lib/db.ts`
- Schema: `prisma/schema.prisma`
- Migrations: `prisma/migrations/*`

Core services:

- Auth/session-to-user mapping: `lib/auth-service.ts`
- User queries: `lib/user-service.ts`
- Stream queries: `lib/stream-service.ts`
- Feed/recommendations/search:
  - `lib/feed-service.ts`
  - `lib/recommended-service.ts`
  - `lib/search-service.ts`
- Relationships:
  - `lib/follow-service.ts`
  - `lib/block-service.ts`

Mutation pattern:

1. UI calls server action in `actions/*`
2. Action validates actor/context and mutates via Prisma/service calls
3. Action triggers `revalidatePath` for stale route segments

## 6) Auth and Authorization Flow

- Middleware route protection: `middleware.ts`
- Public route matchers allow watch/search/public pages and selected APIs
- Server identity resolution:
  - `getSelf()` in `lib/auth-service.ts`
  - `getSelfByUsername(username)` for owner-only dashboard routes
- Clerk lifecycle sync via webhook:
  - create internal `User` + `Stream`
  - update profile fields
  - delete user and clear ingress state

## 7) Streaming and Realtime Flow

Viewer flow:

1. Viewer opens `app/(browse)/[username]/page.tsx`
2. `StreamPlayer` bootstraps LiveKit room with host identity
3. `useViewerToken` (`hooks/use-viewer-token.ts`) calls `createViewerToken` action
4. JWT token connects viewer to host room

Creator flow:

1. Creator opens keys page
2. `createIngress()` action provisions or resets ingress in LiveKit
3. Action stores ingress metadata in `Stream` record
4. Creator streams using issued ingest key + server URL

Live status:

- LiveKit webhook route toggles `Stream.isLive` for ingress started/ended events

## 8) Integrations Index

- Clerk:
  - `app/layout.tsx`
  - `middleware.ts`
  - `app/api/webhooks/clerk/route.ts`
  - `lib/auth-service.ts`
- LiveKit:
  - `actions/ingress.ts`
  - `actions/token.ts`
  - `actions/block.ts`
  - `app/api/webhooks/livekit/route.ts`
  - `components/stream-player/*`
- UploadThing:
  - `app/api/uploadthing/core.ts`
  - `app/api/uploadthing/route.ts`
  - `lib/uploadthing.ts`
- Prisma/MySQL:
  - `prisma/schema.prisma`
  - `lib/db.ts`
  - `actions/*` and `lib/*-service.ts`

## 9) Scripts and Operational Commands

From `package.json`:

- `npm run dev` - start local Next dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - run Next/ESLint checks
- `postinstall` - `prisma generate`

Current testing state:

- No explicit test scripts configured
- No clear unit/integration/e2e harness configured in repository scripts

## 10) Known Risk/Attention Areas

- `actions/ingress.ts` appears to accept ingress type but may force RTMP input
- Token route and player config use similarly named but different LiveKit env keys in parts of the codebase
- Prisma schema includes models that appear less integrated with the current stream-first UX
- There is an additional token API endpoint that appears parallel to action-based token creation

## 11) Suggested Index Maintenance

When adding features, update this file in these sections:

1. Route and Entry Index
2. Feature Module Index
3. Data and Service Layer
4. Integrations Index
5. Known Risk/Attention Areas

This keeps architecture discoverable and reduces onboarding/debug time.
