# Paper Plane

> Send your thoughts, carried by the wind.

Paper Plane is a real-time anonymous messaging web app designed for events — meetings, seminars, workshops, and trainings. Participants send "paper planes" containing questions or feelings, and the event host can broadcast the best ones to everyone.

---

## Features

- **Room-based** — Create rooms for each event with a unique 6-character code
- **Anonymous or Identified** — Host chooses whether participants reveal their name
- **Real-time** — Messages appear live (2s polling) with animated paper planes
- **Broadcast system** — Host selects messages to share with all participants
- **Pin & Remove** — Moderate incoming messages easily
- **Paper plane animations** — Fly-away on send, landing animation on receive
- **Day/Night mode** — Toggle between light and dark zen themes
- **Zen Japanese design** — Minimal, ink-line aesthetic with vermillion accents
- **No signup required for participants** — Just enter the room code and go
- **Responsive** — Works on desktop and mobile

---

## Design

The visual identity is inspired by Japanese ink painting (sumi-e) and zen aesthetics:

- **Colors**: Cream (#f5f0e4), dark ink (#2a3a4a), vermillion red (#c05a3a)
- **Typography**: Noto Serif — clean, serif, Japanese-inspired
- **Icons**: SVG line-art only — no emoji anywhere
- **Background**: Zen landscape with mountains, stream, clouds, and paper planes
- **Animations**: Framer Motion spring physics for fly/landing effects

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| API | tRPC v11 (type-safe RPC) |
| State | React Query (server) + Zustand (client) |
| Animation | Framer Motion |
| Styling | Tailwind CSS |
| Storage | In-memory (globalThis Map) |
| Real-time | Polling (refetchInterval: 2000ms) |
| Deploy | Vercel |

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — room code input, zen landscape, day/night toggle |
| `/login` | Admin login — enter name to get started |
| `/dashboard` | Admin dashboard — list rooms, create new rooms |
| `/create` | Create room — set name and identity mode |
| `/admin/[roomId]` | Admin room view — real-time incoming planes, broadcast/pin/remove |
| `/room/[code]` | Participant view — join room, send planes, see broadcasts |

---

## How It Works

### For Hosts (Admins):
1. Go to the app and click "Admin Login"
2. Enter your name
3. Click "+ New Room" on the dashboard
4. Set a room name and choose Anonymous or Identified mode
5. Share the 6-character room code with participants
6. Watch paper planes arrive in real-time
7. Click "Broadcast" to share a message with everyone

### For Participants:
1. Open the app
2. Enter the 6-character room code
3. (If identified mode) Enter your name
4. Write your question or feeling
5. Click "Send" — watch the paper plane fly away
6. See broadcasted messages from the host in real-time

---

## Getting Started (Local Development)

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/paper-plane.git
cd paper-plane

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open http://localhost:3000

No database or Redis required — everything runs in-memory.

---

## Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Set **Root Directory** to `apps/web` (if using monorepo structure) or leave as-is
4. Click Deploy

No environment variables needed for the demo version.

**Note:** Since this uses in-memory storage, data persists only while the serverless function is warm (~5-15 min on Vercel). For production use, connect a database (PostgreSQL + Drizzle ORM schemas are already defined in the project).

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing (zen landscape + room code)
│   ├── layout.tsx            # Root layout + providers
│   ├── providers.tsx         # tRPC + React Query providers
│   ├── globals.css           # Tailwind + zen theme CSS variables
│   ├── (admin)/
│   │   └── dashboard/page.tsx
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── admin/
│   │   └── [roomId]/page.tsx # Admin room view
│   ├── create/page.tsx       # Create room form
│   ├── room/
│   │   └── [code]/page.tsx   # Participant room view
│   └── api/
│       ├── trpc/[trpc]/route.ts
│       └── health/route.ts
├── server/
│   ├── store.ts              # In-memory data store
│   ├── trpc.ts               # tRPC initialization
│   └── routers/
│       ├── _app.ts           # Root router
│       ├── auth.ts           # Login (name-based)
│       ├── room.ts           # Room CRUD + join
│       └── plane.ts          # Send/broadcast/pin/remove
├── stores/
│   └── user-store.ts         # Zustand user state (persisted)
└── lib/
    ├── trpc.ts               # tRPC React client
    └── auth.ts               # NextAuth config (optional)
```

---

## API (tRPC Procedures)

### Auth
- `auth.login` — Create user session (name only)

### Room
- `room.create` — Create a new room (name + mode)
- `room.list` — List rooms by owner
- `room.getById` — Get room details
- `room.getByCode` — Lookup room by 6-char code
- `room.join` — Participant joins room
- `room.updateStatus` — Change room status (active/paused/closed)
- `room.delete` — Delete a room

### Plane
- `plane.send` — Send a paper plane message
- `plane.getByRoom` — Get all planes for a room (admin)
- `plane.getBroadcasts` — Get broadcasted planes (participant)
- `plane.broadcast` / `plane.unbroadcast` — Toggle broadcast
- `plane.pin` — Pin a message
- `plane.remove` — Remove a message

---

## Animations

| Trigger | Animation | Library |
|---------|-----------|---------|
| Send message | Paper plane flies to top-right (x/y/rotate/scale/opacity) | Framer Motion |
| New message (admin) | Slides in from left with spring physics | Framer Motion |
| Page load | Fade-up entrance | Framer Motion |
| Composer during send | Scale down + opacity reduce | Framer Motion |
| Day/night toggle | Color transition on all elements | CSS transition |

---

## Limitations (Demo Version)

- **No persistent storage** — Data resets on server restart (cold start on Vercel)
- **Polling-based real-time** — 2s delay instead of instant WebSocket
- **No authentication** — Name-only login, no password/OAuth
- **Single instance** — In-memory store doesn't sync across multiple serverless instances

### For Production:
The full production version (with PostgreSQL, Redis, WebSocket, Google OAuth, RBAC) is designed in the `.aidlc/specs/` directory with complete architecture documentation.

---

## License

MIT
