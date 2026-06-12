# TAYAN

### Your thoughts take flight.

---

## About

TAYAN (formerly Paper Plane) is a real-time anonymous messaging web application purpose-built for live events -- meetings, seminars, workshops, conferences, and corporate training sessions. It solves a universal problem: participants in group settings often hesitate to ask questions or share honest feedback in front of others. TAYAN removes that barrier entirely.

The core concept is simple and elegant. Participants write their question or feeling, then "send a paper plane" carrying their message to the event host. The host receives all planes in real-time, selects the best ones, and broadcasts them to the entire audience. The visual metaphor of a paper plane flying through the sky makes the experience memorable and engaging -- not just another anonymous form.

TAYAN supports both anonymous and identified modes, giving organizers full control over how participants interact. With a retro-aviation visual identity, smooth Framer Motion animations, and a day/night theme toggle, the application delivers a polished, production-quality experience that requires zero installation or signup for participants.

---

## Live Demo

**https://paper-plane-seven.vercel.app**

---

## Screenshots

| Landing Page | Admin Dashboard | Participant Room |
|:---:|:---:|:---:|
| ![Landing](./docs/screenshots/landing.png) | ![Dashboard](./docs/screenshots/dashboard.png) | ![Room](./docs/screenshots/room.png) |

| Day Mode | Night Mode | Mobile View |
|:---:|:---:|:---:|
| ![Day](./docs/screenshots/day-mode.png) | ![Night](./docs/screenshots/night-mode.png) | ![Mobile](./docs/screenshots/mobile.png) |

---

## Features

### Core Messaging
- Anonymous paper plane sending with fly-away animation
- Real-time message delivery (2-second polling interval)
- Content sanitization (HTML entity encoding, length capping)
- Rate limiting (10 messages per minute per session)

### Room Management
- Create rooms with unique 6-character alphanumeric codes
- Three room statuses: Active, Paused, Closed
- Identity mode control: Anonymous or Identified (host decides)
- Room code input with uppercase auto-formatting

### Admin Panel
- Real-time incoming message feed
- Broadcast selected messages to all participants
- Pin important messages to the top
- Remove inappropriate content
- Unbroadcast messages after broadcast
- Room status controls (pause/close/reactivate)

### Participant Experience
- Zero-signup entry: just enter the room code
- Compose messages with character counter
- See broadcasted messages from the host
- Name input in Identified mode
- Instant visual feedback on send (animation)

### Visual Design
- Retro aviation poster aesthetic with custom SVG artwork
- Full-screen illustrated background (sky, clouds, mountains, airplane)
- Glassmorphism card UI with backdrop blur
- Custom Thai-inspired airplane illustration (purple/gold livery)
- Day/Night theme toggle with complete palette swap
- Stars, crescent moon (night) / golden sun (day) backgrounds

### Animations
- Paper plane fly-away on send (x/y/rotate/scale/opacity)
- Floating airplane on landing page (bobbing + gentle rotation)
- Page entrance fade-up with spring physics
- Smooth card transitions
- Theme color crossfade via CSS transitions

### Security
- HTTP security headers (X-Content-Type-Options, X-Frame-Options, HSTS, etc.)
- Input sanitization (HTML entity encoding)
- Rate limiting per session
- Zod schema validation on all inputs
- Content length enforcement (500 char max after sanitization)

### Accessibility
- Semantic HTML structure
- Keyboard navigation support (Enter to submit)
- Sufficient color contrast in both themes
- Responsive design (mobile-first)
- Focus-visible states on interactive elements

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 14.2.x |
| Language | TypeScript | 5.5.x |
| API Layer | tRPC | 11.0.x |
| Server State | TanStack React Query | 5.51.x |
| Client State | Zustand | 4.5.x |
| Animation | Framer Motion | 11.3.x |
| Styling | Tailwind CSS | 3.4.x |
| Validation | Zod | 3.23.x |
| Auth (optional) | Clerk / NextAuth | 5.7.x / 4.24.x |
| Storage | In-memory (globalThis Map) | -- |
| Real-time | Polling (refetchInterval) | 2000ms |
| Deployment | Vercel | Serverless |

---

## Architecture Overview

```
Browser (Participant/Admin)
    |
    v
Next.js App Router (SSR + Client Components)
    |
    v
tRPC React Client (@trpc/react-query)
    |  HTTP POST /api/trpc/[procedure]
    v
tRPC Server Router (apps/web/src/server/)
    |
    v
In-Memory Store (globalThis Map)
    |
    v
Response -> React Query Cache -> UI Update
```

### Data Flow

1. Participant enters room code on landing page
2. Client calls `room.getByCode` via tRPC to validate the room
3. Participant composes message and clicks Send
4. Client calls `plane.send` -- server validates, rate-limits, sanitizes, stores
5. Admin panel polls `plane.getByRoom` every 2 seconds
6. Admin clicks Broadcast -- `plane.broadcast` marks message as broadcasted
7. Participant panel polls `plane.getBroadcasts` every 2 seconds
8. Broadcasted message appears in participant feed

### Real-time Strategy

The demo version uses React Query polling (refetchInterval: 2000ms) for simplicity and zero-infrastructure deployment. The production architecture (documented in `.aidlc/specs/`) uses WebSocket + Redis Pub/Sub for sub-500ms latency.

---

## Project Structure

```
apps/web/
├── public/
│   └── bg-landing.png            # Background asset
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page (sky background + room code input)
│   │   ├── layout.tsx            # Root layout with providers
│   │   ├── providers.tsx         # tRPC + React Query provider setup
│   │   ├── globals.css           # Tailwind + CSS variables (day/night themes)
│   │   ├── theme-provider.tsx    # Day/Night theme context + toggle component
│   │   ├── (admin)/
│   │   │   └── dashboard/
│   │   │       └── page.tsx      # Admin dashboard (room list + create)
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx      # Admin login page
│   │   ├── admin/
│   │   │   └── [roomId]/
│   │   │       └── page.tsx      # Admin room view (real-time feed + controls)
│   │   ├── contact/
│   │   │   └── page.tsx          # Developer contact page
│   │   ├── create/
│   │   │   └── page.tsx          # Create room form
│   │   ├── room/
│   │   │   └── [code]/
│   │   │       └── page.tsx      # Participant room (send planes + see broadcasts)
│   │   └── api/
│   │       ├── trpc/
│   │       │   └── [trpc]/
│   │       │       └── route.ts  # tRPC HTTP handler
│   │       └── health/
│   │           └── route.ts      # Health check endpoint
│   ├── server/
│   │   ├── store.ts              # In-memory data store + rate limiter
│   │   ├── trpc.ts               # tRPC initialization + context
│   │   └── routers/
│   │       ├── _app.ts           # Root router (merges all sub-routers)
│   │       ├── auth.ts           # Auth procedures (login)
│   │       ├── room.ts           # Room CRUD + join + status management
│   │       └── plane.ts          # Paper plane send/broadcast/pin/remove
│   ├── stores/
│   │   └── user-store.ts        # Zustand persisted user state
│   ├── components/               # Reusable UI components
│   │   ├── analytics/
│   │   ├── paper-plane/
│   │   ├── room/
│   │   └── ui/
│   ├── hooks/                    # Custom React hooks
│   └── lib/
│       ├── trpc.ts               # tRPC client configuration
│       └── auth.ts               # Auth utilities
├── next.config.js                # Next.js config + security headers
├── tailwind.config.ts            # Tailwind theme (colors, fonts, animations)
├── postcss.config.js             # PostCSS + Tailwind plugin
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

---

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm 9.x (or npm/yarn)

### Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/paper-plane.git
cd paper-plane/apps/web

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open http://localhost:3000 in your browser.

No database, Redis, or external services required. Everything runs in-memory for development.

### Build for Production

```bash
pnpm build
pnpm start
```

### Lint

```bash
pnpm lint
```

---

## Environment Variables

The demo version requires no environment variables. For production features:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Optional | Clerk public key (if using Clerk auth) |
| `CLERK_SECRET_KEY` | Optional | Clerk secret key |
| `NEXTAUTH_URL` | Optional | NextAuth callback URL |
| `NEXTAUTH_SECRET` | Optional | NextAuth encryption secret |
| `DATABASE_URL` | Optional | PostgreSQL connection string (production) |
| `REDIS_URL` | Optional | Redis connection string (production) |

Create a `.env.local` file in the project root:

```env
# Only needed if enabling Clerk authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

---

## Deployment (Vercel)

### Quick Deploy

1. Push the repository to GitHub
2. Go to [vercel.com](https://vercel.com) and create a New Project
3. Import the repository
4. Set the Root Directory to `apps/web` (if using monorepo layout)
5. Click Deploy

Vercel automatically detects Next.js and configures the build.

### Custom Domain

1. In Vercel project settings, go to Domains
2. Add your custom domain
3. Configure DNS as instructed by Vercel

### Production Considerations

- In-memory storage resets on cold starts (approximately 5-15 minutes of inactivity on Vercel)
- For persistent data, connect PostgreSQL via `DATABASE_URL`
- For real-time WebSocket support, deploy the ws-server package separately on Railway

---

## Authentication (Clerk Setup)

TAYAN supports optional Clerk authentication for the admin panel.

### Setup Steps

1. Create an account at [clerk.com](https://clerk.com)
2. Create a new application in the Clerk dashboard
3. Copy the publishable key and secret key
4. Add them to your `.env.local`:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
   CLERK_SECRET_KEY=sk_test_xxxxx
   ```
5. Configure sign-in redirect URLs in the Clerk dashboard:
   - Sign-in: `/login`
   - After sign-in: `/dashboard`

### Without Clerk

The app includes a simple name-based login fallback. Participants never need authentication -- they access rooms directly via room codes.

---

## Security Measures

### HTTP Security Headers

All responses include the following headers (configured in `next.config.js`):

| Header | Value | Purpose |
|--------|-------|---------|
| X-Content-Type-Options | nosniff | Prevents MIME type sniffing |
| X-Frame-Options | DENY | Prevents clickjacking via iframes |
| X-XSS-Protection | 1; mode=block | Legacy XSS filter (browser support) |
| Referrer-Policy | strict-origin-when-cross-origin | Limits referrer information leakage |
| Permissions-Policy | camera=(), microphone=(), geolocation=() | Disables unused browser APIs |
| Strict-Transport-Security | max-age=31536000; includeSubDomains | Forces HTTPS for 1 year |

### Input Validation

- All tRPC inputs validated with Zod schemas
- String length limits enforced at the schema level (1-1000 chars)
- Room codes restricted to uppercase alphanumeric (A-Z, 0-9), max 6 chars

### Input Sanitization

All user-submitted message content is sanitized before storage:
- `<` replaced with `&lt;` (prevents HTML injection)
- `>` replaced with `&gt;`
- `"` replaced with `&quot;`
- Whitespace trimmed
- Content truncated to 500 characters

### Rate Limiting

- Per-session rate limiting on the `plane.send` procedure
- Default: 10 messages per 60-second window per unique session ID
- Returns a descriptive error when the limit is exceeded
- Rate limit state stored in-memory (resets on cold start)

---

## API Documentation (tRPC Procedures)

All procedures are type-safe and accessible via `/api/trpc/[procedure]`.

### Auth Router (`auth.*`)

| Procedure | Type | Input | Output | Description |
|-----------|------|-------|--------|-------------|
| `auth.login` | mutation | `{ name: string }` | `{ id, name, createdAt }` | Create or resume a user session |

### Room Router (`room.*`)

| Procedure | Type | Input | Output | Description |
|-----------|------|-------|--------|-------------|
| `room.create` | mutation | `{ name, description?, identityMode, ownerId }` | Room object | Create a new room with auto-generated code |
| `room.list` | query | `{ ownerId: string }` | Room[] | List all rooms owned by user |
| `room.getById` | query | `{ id: string }` | Room | Get room by ID |
| `room.getByCode` | query | `{ code: string }` | Room | Look up room by 6-char code |
| `room.join` | mutation | `{ code: string }` | Room (increments participantCount) | Participant joins room |
| `room.updateStatus` | mutation | `{ id, status }` | Room | Change room status |
| `room.delete` | mutation | `{ id: string }` | `{ success: true }` | Delete a room |

### Plane Router (`plane.*`)

| Procedure | Type | Input | Output | Description |
|-----------|------|-------|--------|-------------|
| `plane.send` | mutation | `{ roomId, content, senderName?, senderSessionId }` | PaperPlane | Send a message (rate-limited, sanitized) |
| `plane.getByRoom` | query | `{ roomId: string }` | PaperPlane[] | Get all active planes for a room (admin) |
| `plane.getBroadcasts` | query | `{ roomId: string }` | PaperPlane[] | Get broadcasted planes (participant) |
| `plane.broadcast` | mutation | `{ planeId: string }` | PaperPlane | Mark a plane as broadcasted |
| `plane.unbroadcast` | mutation | `{ planeId: string }` | PaperPlane | Remove broadcast status |
| `plane.pin` | mutation | `{ planeId: string }` | PaperPlane | Toggle pin status |
| `plane.remove` | mutation | `{ planeId: string }` | `{ success: true }` | Soft-remove a plane |

---

## Design System

### Color Palette

#### Day Mode
| Token | Value | Usage |
|-------|-------|-------|
| Sky Blue | #5b9bd5 | Background sky, primary accent |
| Cream | #f5e8c8 / #fff8e8 | Clouds, card backgrounds |
| Purple | #4b2d8e | Airplane livery, accent stripe |
| Gold | #c4a44e | Airplane accent, highlights |
| Plum | #5a3050 | Mountain silhouettes |
| Orange/Red | #e89050 / #e87060 | Sunset clouds |
| White | #ffffff | Text on sky, card content |
| Ink Dark | #2a3a4a | Body text on light backgrounds |

#### Night Mode
| Token | Value | Usage |
|-------|-------|-------|
| Deep Navy | #1a2040 | Background sky |
| Midnight Blue | #2a3a5a | Cloud forms |
| Slate Blue | #3a4a6a | Cloud highlights |
| Muted Purple | #2a1a30 / #3a2040 | Mountains, bottom clouds |
| Cream Pale | #f0e8d0 | Moon glow |
| Star White | #ffffff (low opacity) | Stars |

### Typography

| Element | Classes | Notes |
|---------|---------|-------|
| Title (TAYAN) | text-5xl md:text-7xl font-black tracking-[0.15em] | White with text shadow |
| Subtitle | text-base | White at 80% opacity |
| Card labels | text-[10px] uppercase tracking-widest | Muted ink color |
| Body text | text-sm / text-base | Standard readable size |
| Footer links | text-xs font-semibold | Underlined, white |

### Component Patterns

| Component | Styling Approach |
|-----------|-----------------|
| Card | `card` class -- glassmorphism backdrop-blur, rounded, shadow, border |
| Input | `input-flight` class -- custom styled, focus ring, rounded |
| Button | `btn-takeoff` class -- full-width, flex with icon, disabled state |
| Theme Toggle | Positioned absolute top-right, icon-based |
| Background | Full-viewport SVG rendered in a `svg-bg` container |

---

## Animation Details

### Landing Page

| Element | Animation | Config |
|---------|-----------|--------|
| Airplane hero | Floating bob (y: 0 to -6 to 0) + gentle rotation | duration: 6s, infinite loop, easeInOut |
| Content block | Fade-up entrance (opacity 0->1, y 24->0) | duration: 0.7s, once |

### Room - Sending a Plane

| Phase | Properties | Timing |
|-------|-----------|--------|
| Fly-away | x: 0 -> 300, y: 0 -> -200, rotate: 0 -> 45, scale: 1 -> 0.3, opacity: 1 -> 0 | 0.8s ease-out |
| Composer reset | scale: 0.95 -> 1, opacity: 0.5 -> 1 | 0.3s spring |

### Room - Receiving Planes (Admin)

| Phase | Properties | Timing |
|-------|-----------|--------|
| Slide-in | x: -50 -> 0, opacity: 0 -> 1 | 0.4s spring |

### Theme Transition

CSS transitions on all color properties (background, text, border, shadow) with 300ms duration.

---

## Day/Night Theme

TAYAN includes a complete day/night theme system.

### How It Works

1. Theme state managed by a React context (`ThemeProvider`)
2. A toggle button in the top-right corner switches between modes
3. The entire SVG background re-renders with appropriate colors
4. CSS variables update for card backgrounds, text colors, and borders
5. Preference stored in localStorage for persistence

### Day Theme
- Bright sky blue background
- Golden sun rising from the bottom
- Warm cream-colored clouds
- Orange/red sunset clouds at the base
- Dark purple mountains

### Night Theme
- Deep navy background
- Scattered stars with varying opacity
- Crescent moon with soft glow
- Muted blue-gray clouds
- Dark purple mountain silhouettes
- Reduced overall contrast for comfort

---

## Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes following the existing code style
4. Run the build to verify: `pnpm build`
5. Commit with a descriptive message
6. Push and create a Pull Request

### Code Style

- TypeScript strict mode
- Tailwind CSS for styling (no inline styles except dynamic values)
- Framer Motion for animations
- Zod for runtime validation
- kebab-case for file names
- PascalCase for components
- camelCase for functions and variables

### Commit Message Format

```
type: short description

- Detail 1
- Detail 2
```

Types: feat, fix, refactor, docs, style, test, chore

### Pull Request Guidelines

- Keep PRs focused on a single concern
- Include before/after screenshots for UI changes
- Ensure the build passes (`pnpm build`)
- Update documentation if adding new features

---

## Developer Contact

**P-S**
Email: Pilan.s112@gmail.com

For bug reports, feature requests, or general inquiries, please open a GitHub Issue or reach out via email.

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
