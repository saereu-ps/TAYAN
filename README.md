# TAYAN

### Your thoughts take flight.

A real-time interactive messaging platform with a retro aviation theme, built for live events
where participants need a safe channel to ask questions, share feelings, or exchange anonymous messages.

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Core Concepts](#core-concepts)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Pages and Routes](#pages-and-routes)
- [API Reference (tRPC)](#api-reference-trpc)
- [Design System](#design-system)
- [Animation Specification](#animation-specification)
- [Day/Night Theme System](#daynight-theme-system)
- [Security](#security)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Authentication (Clerk)](#authentication-clerk)
- [Contributing](#contributing)
- [Developer Contact](#developer-contact)
- [License](#license)

---

## Overview

TAYAN is a real-time anonymous messaging web application purpose-built for live events: meetings,
seminars, workshops, conferences, and corporate training sessions. It addresses a universal problem
in group settings where participants hesitate to ask questions or share honest feedback in front of
others due to fear of judgment.

The platform wraps this functionality in a memorable aviation metaphor. Participants stand at a
departure gate and launch paper planes carrying their messages. Admins observe from a control tower
with a 2D top-down airport tarmac view, where incoming planes land and taxi to numbered gates.
The entire experience is wrapped in a retro aviation poster aesthetic inspired by Thai Airways livery
colors, with hand-crafted SVG illustrations and smooth Framer Motion animations.

TAYAN supports two distinct room modes:

1. **Direct to Admin** -- participants send messages directly to the host (Q&A, feedback collection)
2. **Random Exchange** -- participants submit messages that get shuffled and redistributed using a
   derangement algorithm (Secret Santa style, ensuring no one receives their own message)

No installation, no signup for participants. Enter a 6-character room code and start sending.

---

## Live Demo

**https://paper-plane-seven.vercel.app**

---

## Core Concepts

| Concept | Description |
|---------|-------------|
| Paper Plane | A message (question, feeling, or feedback) that a participant sends |
| Room | A session space for one event, identified by a unique 6-character code |
| Room Code | 6-character alphanumeric code (A-Z, 2-9) used to join a room |
| Direct Mode | Messages fly from participants to the admin (one-directional Q&A) |
| Exchange Mode | Messages are collected, shuffled via derangement, and redistributed |
| Broadcast | Admin selects a message and pushes it to all participants |
| Tarmac View | Admin's 2D top-down airport visualization where planes land at gates |
| Departure Gate | Participant's view -- compose and launch messages with takeoff animation |
| Flight Board | Chronological table of all received messages (arrivals board style) |
| Derangement | A permutation where no element appears in its original position |

---

## Features

### Room Modes

**Direct to Admin**
- Participants compose messages at a departure gate interface
- Messages fly to the admin's control tower in real-time
- Admin sees planes landing on a 2D airport tarmac
- Planes park at numbered gates and are clickable to read
- Admin can broadcast, pin, or remove any message
- Suitable for Q&A sessions, live feedback, audience questions

**Random Exchange**
- All participants submit one message each
- Admin triggers the dispatch when enough submissions arrive
- Messages are shuffled using a derangement algorithm (Fisher-Yates variant)
- Each participant receives exactly one message from someone else
- No participant ever receives their own message (guaranteed by algorithm)
- Suitable for Secret Santa messages, icebreakers, anonymous compliments

### Admin Control Tower

- 2D top-down airport tarmac visualization (SVG)
- Planes animate landing and taxi to available gates
- Clickable planes reveal message content
- Capacity selector: 5 to 50 gates on the tarmac
- Flight arrivals board (chronological data table)
- Broadcast messages to all participants
- Pin important messages to the top
- Remove inappropriate content
- Room status management (Active, Paused, Closed)
- Identity mode toggle (Anonymous / Identified)

### Participant Departure Gate

- Airport terminal departure gate themed interface
- Compose area with character counter (500 char max)
- Dramatic paper plane takeoff animation on send
- View broadcasted messages from admin
- Name input field in Identified mode
- Zero signup required -- enter room code and participate

### Real-Time Communication

- Polling-based real-time updates (refetchInterval: 2000ms via React Query)
- Admin polls for new incoming planes
- Participants poll for new broadcasts
- Exchange mode polls for dispatch status
- Lightweight approach with zero infrastructure dependencies

### Visual Design

- Retro aviation poster aesthetic
- Full-viewport SVG background illustrations
- Custom airplane SVG with Thai Airways-inspired livery (purple tail, gold stripe)
- Zero emoji throughout the entire application -- all icons are SVG illustrations
- Glassmorphism card UI with backdrop-blur and soft shadows
- Responsive design from mobile to desktop
- Day/Night theme toggle on every page with complete palette swap

### Security and Validation

- Rate limiting: 10 messages per 60 seconds per session
- XSS sanitization via HTML entity encoding
- HTTP security headers on all responses
- Clerk middleware protection on admin routes
- Zod schema validation on all tRPC inputs
- Content length enforcement (500 characters after sanitization)

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js (App Router) | 14.2.x | Server-side rendering, routing, API routes |
| Language | TypeScript | 5.5.x | Type safety across the entire codebase |
| API Layer | tRPC | 11.0.x | End-to-end type-safe RPC without code generation |
| Server State | TanStack React Query | 5.51.x | Caching, polling, background refetching |
| Client State | Zustand | 4.5.x | Lightweight persisted client state (user session) |
| Animation | Framer Motion | 11.3.x | Spring physics, layout animations, gestures |
| Styling | Tailwind CSS | 3.4.x | Utility-first CSS with custom theme tokens |
| Validation | Zod | 3.23.x | Runtime schema validation (shared client/server) |
| Authentication | Clerk | 5.7.x | Google OAuth, session management, middleware |
| Serialization | SuperJSON | 2.2.x | Date/Map/Set serialization over tRPC |
| Utilities | tailwind-merge | 2.4.x | Conditional class merging without conflicts |
| Storage | In-memory (globalThis Map) | -- | Zero-dependency demo storage |
| Real-time | React Query polling | 2000ms | Lightweight real-time without WebSocket |
| Deployment | Vercel | Serverless | Auto-deploy from GitHub, edge network |

---

## Architecture

```
+------------------------------------------------------------------+
|                         Browser Client                            |
|  +--------------------+              +------------------------+  |
|  | Participant View   |              | Admin View             |  |
|  | (Departure Gate)   |              | (Control Tower/Tarmac) |  |
|  +--------+-----------+              +------------+-----------+  |
|           |                                       |              |
|           v                                       v              |
|  +--------------------------------------------------------+     |
|  |        tRPC React Client (@trpc/react-query)           |     |
|  |        + React Query (polling @ 2000ms)                |     |
|  +----------------------------+---------------------------+     |
+-------------------------------|-------------------------------+
                                | HTTP POST
                                v
+------------------------------------------------------------------+
|                    Next.js App Router (Vercel)                    |
|  +------------------------------------------------------------+  |
|  |  /api/trpc/[trpc]/route.ts  (tRPC HTTP Handler)           |  |
|  +------------------------------------------------------------+  |
|  |  Clerk Middleware (protects /dashboard, /admin/*, /create) |  |
|  +------------------------------------------------------------+  |
|                               |                                  |
|                               v                                  |
|  +------------------------------------------------------------+  |
|  |              tRPC Server Router                            |  |
|  |  +----------+  +----------+  +----------+  +----------+   |  |
|  |  | auth     |  | room     |  | plane    |  | exchange |   |  |
|  |  +----------+  +----------+  +----------+  +----------+   |  |
|  +------------------------------------------------------------+  |
|                               |                                  |
|                               v                                  |
|  +------------------------------------------------------------+  |
|  |       In-Memory Store (globalThis Map)                     |  |
|  |  users | rooms | planes | exchanges | exchangeResults     |  |
|  |  roomCodeIndex | rateLimits                                |  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
```

### Data Flow: Direct Mode

```
1. Participant enters 6-char room code on landing page
2. Client calls room.getByCode via tRPC to validate
3. Participant types message and presses Send
4. Client calls plane.send
   -> Server validates input (Zod schema)
   -> Server checks rate limit (10/60s)
   -> Server sanitizes content (HTML entity encoding)
   -> Server stores in memory Map
   -> Returns PaperPlane object
5. Admin panel polls plane.getByRoom every 2 seconds
6. New plane appears on tarmac (landing animation to gate)
7. Admin clicks plane -> reads content -> clicks Broadcast
8. Server marks plane as broadcasted
9. Participant polls plane.getBroadcasts every 2 seconds
10. Broadcasted message appears in participant's feed
```

### Data Flow: Exchange Mode

```
1. Admin creates room with mode = "exchange"
2. Participants join and each submit one message via exchange.submit
3. Admin monitors submission count via exchange.getStatus
4. When ready, admin triggers exchange.dispatch
   -> Server runs derangement algorithm (Fisher-Yates variant)
   -> Guarantees no participant gets their own message
   -> Results stored in exchangeResults Map
5. Participants poll exchange.getMyMessage
6. Each participant sees the message assigned to them
7. Admin can reset (exchange.reset) to start over
```

### Storage Strategy

The demo uses an in-memory store attached to `globalThis` to persist data across serverless
function invocations within the same warm instance on Vercel. Data resets on cold start
(approximately 5-15 minutes of inactivity). This eliminates the need for any external database
or cache service for demonstration purposes.

---

## Project Structure

```
apps/web/
|
+-- public/
|   +-- bg-landing.png                  # Landing page background asset
|
+-- src/
|   +-- app/
|   |   +-- page.tsx                    # Landing page (retro poster, room code input, day/night)
|   |   +-- layout.tsx                  # Root layout with Clerk + theme providers
|   |   +-- providers.tsx               # tRPC + React Query provider setup
|   |   +-- globals.css                 # Tailwind base + CSS variables (day/night themes)
|   |   +-- theme-provider.tsx          # Day/Night theme context + toggle component
|   |   |
|   |   +-- (admin)/
|   |   |   +-- dashboard/
|   |   |       +-- page.tsx            # Admin flight schedule board (room list)
|   |   |
|   |   +-- (auth)/
|   |   |   +-- login/
|   |   |       +-- page.tsx            # Clerk sign-in page (Google OAuth)
|   |   |
|   |   +-- admin/
|   |   |   +-- [roomId]/
|   |   |       +-- page.tsx            # Control tower tarmac (2D airport, planes land/park)
|   |   |
|   |   +-- contact/
|   |   |   +-- page.tsx                # Developer contact page
|   |   |
|   |   +-- create/
|   |   |   +-- page.tsx                # Schedule new flight (create room form)
|   |   |
|   |   +-- room/
|   |   |   +-- [code]/
|   |   |       +-- page.tsx            # Participant departure gate (send + view broadcasts)
|   |   |
|   |   +-- api/
|   |       +-- trpc/
|   |       |   +-- [trpc]/
|   |       |       +-- route.ts        # tRPC HTTP handler (all procedures)
|   |       +-- health/
|   |           +-- route.ts            # Health check endpoint (GET /api/health)
|   |
|   +-- server/
|   |   +-- store.ts                    # In-memory data store + rate limiter + ID gen
|   |   +-- trpc.ts                     # tRPC initialization, context creation
|   |   +-- routers/
|   |       +-- _app.ts                 # Root router (merges auth, room, plane, exchange)
|   |       +-- auth.ts                 # Auth procedures (name-based login)
|   |       +-- room.ts                 # Room CRUD, join, status management
|   |       +-- plane.ts               # Paper plane send/broadcast/pin/remove
|   |       +-- exchange.ts            # Random exchange: submit, dispatch, getMyMessage
|   |
|   +-- stores/
|   |   +-- user-store.ts              # Zustand persisted user state (localStorage)
|   |
|   +-- components/
|   |   +-- analytics/                  # Analytics-related components
|   |   +-- paper-plane/               # Paper plane SVG and animation components
|   |   +-- room/                      # Room-specific UI components
|   |   +-- ui/                        # Shared UI primitives (cards, buttons, inputs)
|   |
|   +-- hooks/                          # Custom React hooks
|   |
|   +-- lib/
|   |   +-- trpc.ts                    # tRPC client configuration + React Query setup
|   |   +-- auth.ts                    # Auth utility functions
|   |
|   +-- middleware.ts                   # Clerk auth middleware (route protection)
|
+-- next.config.js                      # Next.js config + security headers
+-- tailwind.config.ts                  # Tailwind theme (colors, fonts, keyframes)
+-- postcss.config.js                   # PostCSS with Tailwind plugin
+-- tsconfig.json                       # TypeScript strict configuration
+-- vercel.json                         # Vercel deployment configuration
+-- package.json                        # Dependencies and npm scripts
+-- package-lock.json                   # Dependency lock file
```

---

## Pages and Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page with retro aviation poster, room code input, day/night toggle |
| `/login` | Public | Clerk sign-in page with Google OAuth |
| `/dashboard` | Protected | Admin flight schedule board -- list all created rooms |
| `/create` | Protected | Create a new room (schedule a flight) -- name, mode, identity settings |
| `/admin/[roomId]` | Protected | Control tower tarmac -- 2D airport view, planes land at gates |
| `/room/[code]` | Public | Participant departure gate -- compose and send, view broadcasts |
| `/contact` | Public | Developer contact information |
| `/api/trpc/[trpc]` | API | tRPC HTTP handler (POST for mutations, GET for queries) |
| `/api/health` | API | Health check endpoint (returns 200 OK) |

### Route Protection

Routes under `/dashboard`, `/admin/*`, and `/create` are protected by Clerk middleware defined
in `src/middleware.ts`. Unauthenticated requests are redirected to `/login`. Participant routes
(`/room/[code]`) require no authentication.

---

## API Reference (tRPC)

All procedures are type-safe and accessible via `POST /api/trpc/[procedure]` (mutations) or
`GET /api/trpc/[procedure]` (queries). The client uses `@trpc/react-query` with SuperJSON
serialization.

### auth router

| Procedure | Type | Input | Output | Description |
|-----------|------|-------|--------|-------------|
| `auth.login` | mutation | `{ name: string }` | `{ id, name, createdAt }` | Create or retrieve a user session by name |

### room router

| Procedure | Type | Input | Output | Description |
|-----------|------|-------|--------|-------------|
| `room.create` | mutation | `{ name, description?, identityMode, mode, ownerId }` | Room | Create a room with auto-generated 6-char code |
| `room.list` | query | `{ ownerId: string }` | Room[] | List all rooms owned by a user |
| `room.getById` | query | `{ id: string }` | Room | Get a single room by its ID |
| `room.getByCode` | query | `{ code: string }` | Room | Look up a room by its 6-character code |
| `room.join` | mutation | `{ code: string }` | Room | Join a room (increments participantCount) |
| `room.updateStatus` | mutation | `{ id, status }` | Room | Change room status (active/paused/closed) |
| `room.delete` | mutation | `{ id: string }` | `{ success: true }` | Delete a room and its data |

### plane router

| Procedure | Type | Input | Output | Description |
|-----------|------|-------|--------|-------------|
| `plane.send` | mutation | `{ roomId, content, senderName?, senderSessionId }` | PaperPlane | Send a message (rate-limited, sanitized) |
| `plane.getByRoom` | query | `{ roomId: string }` | PaperPlane[] | Get all active planes in a room (admin view) |
| `plane.getBroadcasts` | query | `{ roomId: string }` | PaperPlane[] | Get broadcasted planes only (participant view) |
| `plane.broadcast` | mutation | `{ planeId: string }` | PaperPlane | Mark a plane as broadcasted to all |
| `plane.unbroadcast` | mutation | `{ planeId: string }` | PaperPlane | Remove broadcast status from a plane |
| `plane.pin` | mutation | `{ planeId: string }` | PaperPlane | Toggle pin status on a plane |
| `plane.remove` | mutation | `{ planeId: string }` | `{ success: true }` | Soft-remove a plane (sets status to "removed") |

### exchange router

| Procedure | Type | Input | Output | Description |
|-----------|------|-------|--------|-------------|
| `exchange.submit` | mutation | `{ roomId, participantId, participantName?, content }` | `{ success, totalSubmitted }` | Submit a message for random exchange |
| `exchange.getStatus` | query | `{ roomId: string }` | `{ totalSubmitted, totalParticipants, isDispatched }` | Get exchange submission status |
| `exchange.dispatch` | mutation | `{ roomId: string }` | `{ success, distributed }` | Admin triggers derangement shuffle and distribution |
| `exchange.getMyMessage` | query | `{ roomId, participantId }` | `{ message, senderName } | null` | Participant retrieves their assigned message |
| `exchange.reset` | mutation | `{ roomId: string }` | `{ success: true }` | Reset all submissions and results for a room |

### Data Types

```typescript
interface Room {
  id: string;
  name: string;
  description?: string;
  code: string;                              // 6-char alphanumeric (A-Z, 2-9)
  status: 'active' | 'paused' | 'closed';
  identityMode: 'anonymous' | 'identified';
  mode: 'direct' | 'exchange';
  revealSenders: boolean;
  ownerId: string;
  participantCount: number;
  createdAt: string;                         // ISO 8601
}

interface PaperPlane {
  id: string;
  roomId: string;
  content: string;                           // Sanitized, max 500 chars
  senderName?: string;
  senderSessionId: string;
  status: 'active' | 'removed';
  isBroadcasted: boolean;
  isPinned: boolean;
  broadcastedAt?: string;                    // ISO 8601
  createdAt: string;                         // ISO 8601
}

interface User {
  id: string;
  name: string;
  createdAt: string;                         // ISO 8601
}
```

---

## Design System

### Color Palette

#### Day Mode

| Token | Hex | Usage |
|-------|-----|-------|
| Sky Blue | #5b9bd5 | Background sky, primary accent, headers |
| Coral | #e87060 | Call-to-action buttons, error states, sunset clouds |
| Cream | #f0ebe0 | Card backgrounds, cloud fill, warm highlights |
| Orange | #e89050 | Sunset clouds, secondary warm accent |
| Purple (Livery) | #4b2d8e | Airplane tail, accent stripe, brand identity |
| Gold (Livery) | #c4a44e | Airplane fuselage stripe, premium highlights |
| Plum | #5a3050 | Mountain silhouettes, depth layers |
| Dark Teal | #2a5a6a | Body text on light backgrounds |
| White | #ffffff | Text on colored backgrounds, card content area |

#### Night Mode

| Token | Hex | Usage |
|-------|-----|-------|
| Navy | #1a2a3a | Primary background sky |
| Deep Navy | #1a2040 | Deepest sky gradient layer |
| Midnight Blue | #2a3a5a | Cloud forms, mid-tone elements |
| Slate Blue | #3a4a6a | Cloud highlights, secondary surfaces |
| Muted Purple | #2a1a30 | Mountains, bottom cloud layer |
| Cream Pale | #f0e8d0 | Moon glow, muted text on dark |
| Star White | #ffffff (10-30% opacity) | Stars, subtle highlights |

#### Airplane Livery

The custom airplane SVG draws inspiration from Thai Airways livery:

| Element | Color | Hex |
|---------|-------|-----|
| Tail fin | Royal Purple | #4b2d8e |
| Fuselage stripe | Gold | #c4a44e |
| Body | White/Light gray | #f8f8f8 |
| Windows | Dark | #2a3a4a |
| Engines | Silver | #d0d0d0 |

### Typography

| Element | Font | Weight | Size | Notes |
|---------|------|--------|------|-------|
| Main title (TAYAN) | System / Noto Serif | Black (900) | 5xl - 7xl | Letter-spacing 0.15em, white, text-shadow |
| Subtitle | System sans-serif | Regular (400) | base (16px) | White at 80% opacity |
| Section headings | Noto Serif | Bold (700) | xl - 2xl | Dark teal or white depending on theme |
| Body text | Inter / system | Regular (400) | sm - base | #2a5a6a (day) or cream (night) |
| Labels | System sans-serif | Medium (500) | 10px | Uppercase, tracking-widest, muted |
| Code/monospace | System mono | Regular | sm | Used in room codes display |

### Component Patterns

| Component | Styling | Notes |
|-----------|---------|-------|
| Card | `rounded-2xl`, `backdrop-blur`, `shadow-lg`, `border border-white/20` | Glassmorphism effect |
| Input | Custom `input-flight` class, focus ring, rounded-lg | Consistent across forms |
| Button (Primary) | `btn-takeoff`, full-width, flex with icon, coral/blue background | Disabled state with reduced opacity |
| Button (Secondary) | Ghost variant, border only, hover fill | Used for secondary actions |
| Theme Toggle | Absolute positioned top-right, sun/moon SVG icon | Present on every page |
| Background | Full-viewport SVG in fixed container | Parallax-like depth layers |
| Badge | Rounded-full, small text, colored background | Room status indicators |

---

## Animation Specification

All animations use Framer Motion with spring physics and ease curves.

### Landing Page

| Element | Animation | Configuration |
|---------|-----------|---------------|
| Hero airplane | Floating bob (y: 0, -6, 0) + gentle rotation (rotate: -2, 2, -2) | duration: 6s, repeat: Infinity, ease: easeInOut |
| Content card | Fade-up entrance (opacity: 0 to 1, y: 24 to 0) | duration: 0.7s, once, spring |
| Background clouds | Subtle drift (x movement) | duration: 20s, infinite, linear |

### Participant Room -- Sending a Plane

| Phase | Properties | Timing |
|-------|-----------|--------|
| Takeoff | x: 0 to 300, y: 0 to -200, rotate: 0 to 45, scale: 1 to 0.3, opacity: 1 to 0 | 0.8s ease-out |
| Composer reset | scale: 0.95 to 1, opacity: 0.5 to 1 | 0.3s spring |
| Success feedback | Brief scale pulse on the send area | 0.2s |

### Admin Tarmac -- Plane Landing

| Phase | Properties | Timing |
|-------|-----------|--------|
| Approach | Plane appears from top edge, descends along runway path | 1.2s ease-in-out |
| Taxi | Plane moves from runway to assigned gate position | 0.6s ease-out |
| Park | Plane settles with slight bounce at gate | 0.3s spring |

### Admin Feed -- Message Card Slide-in

| Phase | Properties | Timing |
|-------|-----------|--------|
| Enter | x: -50 to 0, opacity: 0 to 1 | 0.4s spring |
| Exit (remove) | x: 0 to 50, opacity: 1 to 0 | 0.3s ease-in |

### Theme Transition

All color properties (background, text, border, shadow, SVG fill) transition via CSS with
`transition-duration: 300ms` and `transition-timing-function: ease`. The entire background SVG
re-renders with theme-appropriate colors.

---

## Day/Night Theme System

### Implementation

1. Theme state managed by React context (`ThemeProvider` in `theme-provider.tsx`)
2. Toggle button rendered in the top-right corner of every page
3. Current theme stored in `localStorage` for persistence across sessions
4. CSS variables update on toggle, triggering smooth color transitions
5. SVG background re-renders with theme-appropriate palette
6. All components read theme from context and render accordingly

### Day Theme Characteristics

- Bright sky blue gradient background (#5b9bd5 to lighter)
- Golden sun illustration rising from horizon
- Warm cream-colored cumulus clouds
- Orange and coral sunset clouds at the base
- Dark purple mountain silhouettes
- High contrast text (dark on light cards)
- Vibrant coral accent buttons

### Night Theme Characteristics

- Deep navy gradient background (#1a2040 to #1a2a3a)
- Scattered stars with varying size and opacity
- Crescent moon with soft cream glow
- Muted blue-gray cloud forms
- Dark purple-black mountain silhouettes
- Reduced contrast for eye comfort
- Softer accent colors

---

## Security

### HTTP Security Headers

Configured in `next.config.js` and applied to all routes:

| Header | Value | Purpose |
|--------|-------|---------|
| X-Content-Type-Options | nosniff | Prevents MIME type sniffing attacks |
| X-Frame-Options | DENY | Blocks iframe embedding (anti-clickjacking) |
| X-XSS-Protection | 1; mode=block | Activates browser XSS filter |
| Referrer-Policy | strict-origin-when-cross-origin | Limits referrer header leakage |
| Permissions-Policy | camera=(), microphone=(), geolocation=() | Disables unused device APIs |
| Strict-Transport-Security | max-age=31536000; includeSubDomains | Enforces HTTPS for 1 year |

### Input Sanitization

All user-submitted content undergoes sanitization before storage:

```
< -> &lt;     (prevents HTML tag injection)
> -> &gt;     (prevents HTML tag closure)
" -> &quot;   (prevents attribute injection)
```

Additional processing:
- Leading and trailing whitespace trimmed
- Content truncated to 500 characters after encoding
- Empty strings rejected at the Zod validation layer

### Rate Limiting

| Parameter | Value |
|-----------|-------|
| Window | 60 seconds |
| Max requests | 10 per window |
| Scope | Per session ID (senderSessionId) |
| Storage | In-memory Map |
| Behavior on exceed | Returns tRPC error with descriptive message |
| Reset | Automatic after window expiry |

### Route Protection (Clerk Middleware)

Protected routes (require authentication):
- `/dashboard` -- admin room list
- `/admin/*` -- admin control tower views
- `/create` -- room creation form

Public routes (no authentication required):
- `/` -- landing page
- `/login` -- sign-in page
- `/room/*` -- participant room access
- `/contact` -- contact page
- `/api/*` -- API endpoints (validated per-procedure)

### Validation Rules

| Field | Constraints |
|-------|-------------|
| Room name | 1-100 characters, string, required |
| Room code | Exactly 6 characters, uppercase alphanumeric (A-Z, 2-9) |
| Message content | 1-500 characters, string, required |
| User name | 1-50 characters, string, required for login |
| Identity mode | Enum: "anonymous" or "identified" |
| Room status | Enum: "active", "paused", or "closed" |
| Room mode | Enum: "direct" or "exchange" |

---

## Getting Started

### Prerequisites

- Node.js 18 or higher (LTS recommended)
- npm 9+ (included with Node.js) or pnpm 9.x
- A Clerk account (free tier) for admin authentication
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/saereu-ps/TAYAN.git
cd TAYAN

# Install dependencies (use --legacy-peer-deps if needed)
npm install --legacy-peer-deps
```

### Environment Setup

Create a `.env.local` file in the project root:

```env
# Required for admin authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
```

Obtain these keys from the Clerk Dashboard (https://dashboard.clerk.com).

### Running Locally

```bash
# Start the development server
npm run dev
```

Open http://localhost:3000 in your browser.

No database, Redis, or external services are required. The in-memory store handles all
data persistence for development and demonstration purposes.

### Build for Production

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes (for auth) | Clerk publishable key -- used client-side for sign-in UI |
| `CLERK_SECRET_KEY` | Yes (for auth) | Clerk secret key -- used server-side for session verification |

### Where to Get Clerk Keys

1. Go to https://clerk.com and create a free account
2. Create a new application in the Clerk Dashboard
3. Navigate to "API Keys" in the sidebar
4. Copy the Publishable Key and Secret Key
5. Add them to `.env.local` (local) or Vercel Environment Variables (production)

### Clerk Dashboard Configuration

After creating your Clerk application, configure the following:

| Setting | Value |
|---------|-------|
| Sign-in URL | `/login` |
| After sign-in redirect | `/dashboard` |
| After sign-up redirect | `/dashboard` |
| Allowed OAuth providers | Google |

---

## Deployment

### Vercel (Recommended)

TAYAN is designed for zero-configuration deployment on Vercel.

#### Steps

1. Push the repository to GitHub:
   ```bash
   git add -A
   git commit -m "Initial commit"
   git push origin main
   ```

2. Go to https://vercel.com and click "New Project"

3. Import the GitHub repository (`saereu-ps/TAYAN`)

4. Configure the project:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (or `apps/web` if in monorepo)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)

5. Add Environment Variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = your publishable key
   - `CLERK_SECRET_KEY` = your secret key

6. Click "Deploy"

Vercel automatically deploys on every push to the `main` branch.

#### Custom Domain

1. In your Vercel project, go to Settings > Domains
2. Add your custom domain
3. Configure DNS as instructed (CNAME or A record)
4. SSL certificate provisioned automatically

#### Production Considerations

| Consideration | Detail |
|---------------|--------|
| Cold starts | In-memory data resets after ~5-15 minutes of inactivity |
| Concurrent users | Vercel handles scaling automatically |
| Region | Deploy close to your audience for lower latency |
| Monitoring | Use Vercel Analytics (free tier available) |
| Logs | Available in Vercel Dashboard > Deployments > Logs |

For persistent data beyond the demo, the architecture supports upgrading to PostgreSQL
(via Drizzle ORM) and Redis (for Pub/Sub real-time) as documented in the production specs.

---

## Authentication (Clerk)

### How It Works

TAYAN uses Clerk for admin panel authentication with Google OAuth (free tier).

```
User clicks "Login" on landing page
    |
    v
Redirected to /login (Clerk Sign-In component)
    |
    v
Google OAuth consent screen
    |
    v
Clerk creates/validates session
    |
    v
Redirected to /dashboard (admin panel)
```

### Middleware Protection

The `src/middleware.ts` file configures Clerk middleware to protect admin routes:

- Unauthenticated requests to protected routes redirect to `/login`
- Session tokens are validated on every request to protected routes
- Public routes are explicitly allowlisted

### Without Clerk (Fallback)

The application includes a name-based login fallback via `auth.login` tRPC procedure.
This creates a simple user session stored in Zustand (persisted to localStorage).
Participants never need authentication -- they access rooms via 6-character codes.

---

## Contributing

### Development Workflow

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Make changes following the existing code style
5. Verify the build passes:
   ```bash
   npm run build
   ```
6. Commit with a descriptive message
7. Push to your fork and create a Pull Request

### Code Style Guide

| Convention | Rule |
|------------|------|
| File naming | kebab-case (`theme-provider.tsx`, `user-store.ts`) |
| Component naming | PascalCase (`ThemeProvider`, `DepartureGate`) |
| Function naming | camelCase (`checkRateLimit`, `genRoomCode`) |
| Variable naming | camelCase (`participantCount`, `senderSessionId`) |
| Type/Interface naming | PascalCase (`PaperPlane`, `ExchangeResult`) |
| CSS approach | Tailwind utility classes exclusively |
| Animation | Framer Motion (not CSS keyframes) for interactive elements |
| Validation | Zod schemas for all external input |
| State management | Zustand for client, React Query for server |
| Icons | SVG only -- zero emoji anywhere in the application |

### Commit Message Format

```
type: concise description of the change

- Additional detail if needed
- Another detail
```

Accepted types: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`

### Pull Request Guidelines

- Keep PRs focused on a single concern
- Include before/after screenshots for any UI changes
- Ensure `npm run build` passes without errors
- Update this README if adding new features or changing behavior
- Do not introduce emoji -- use SVG illustrations for all icons

---

## Developer Contact

**P-S**

| Channel | Detail |
|---------|--------|
| Email | Pilan.s112@gmail.com |
| GitHub | https://github.com/saereu-ps |
| Project | https://github.com/saereu-ps/TAYAN |

For bug reports, feature requests, or questions, open a GitHub Issue on the repository.

---

## License

MIT License

Copyright (c) 2024 P-S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
