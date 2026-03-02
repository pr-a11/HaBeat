# HABEAT - Premium Habit Tracker

A SaaS-ready habit tracking application with a dark glass UI, 12 immersive themes, streak analytics, and subscription architecture.

## Features

- **Monthly Calendar Grid** — Check off daily habit completions on a scrollable calendar
- **12 Premium Themes** — Classic White, Classic Dark, Neon Noir, Arctic Pulse, Lavender Haze, Cyber Teal, Ember Night, Midnight Sakura, Titanium Frost, Ocean Nebula, Mocha Glow, Prism Dusk (5 light + 7 dark)
- **CSS Variable Theme System** — Themes switch via `data-theme` attributes with smooth 300ms transitions, persisted in localStorage
- **Streak Tracking** — Consecutive day streaks with flame indicators per habit
- **Analytics Dashboard** — SVG line chart, weekly bar chart breakdown, per-habit progress bars, and summary stats
- **Dark Glass UI** — Layered glass surfaces with backdrop blur, accent glows, and floating ambient orbs
- **Micro-Animations** — Completion pulse glow, fade-in cards, ambient background drift, button hover elevation
- **Profile System** — Avatar upload, name, bio, plan status
- **Subscription Architecture** — Monthly/yearly pricing UI with payment integration placeholders
- **Mobile Optimized** — Fully scrollable, touch-friendly, responsive down to 390px width
- **Motivational Quotes** — Random encouragement toast on daily completions

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion, TanStack Query
- **Backend**: Express.js 5 with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: wouter (client-side)
- **UI Components**: Radix UI / shadcn

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

```bash
git clone <your-repo-url>
cd habeat
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your database credentials:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |

### Database Setup

```bash
npm run db:push
```

### Development

```bash
npm run dev
```

The app runs on `http://localhost:5000`.

### Production Build

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push your repo to GitHub
2. Import the project in Vercel
3. Set **Build Command**: `npm run build`
4. Set **Output Directory**: `dist`
5. Set **Install Command**: `npm install`
6. Add environment variables (`DATABASE_URL`)
7. Deploy

## Deploy to Replit

The project is pre-configured for Replit deployment. Use the Replit deployment panel to publish.

## Project Structure

```
client/          # React frontend
  src/
    pages/       # Page components (home.tsx)
    components/  # UI components (shadcn)
    lib/         # API client, utilities
server/          # Express backend
  routes.ts      # API endpoints
  storage.ts     # Database operations
  db.ts          # Database connection
shared/          # Shared types and schemas
  schema.ts      # Drizzle schema + Zod validation
```

## Theme System

Themes are defined as CSS custom properties in `client/src/index.css`. Each theme sets variables like `--hb-accent`, `--hb-bg`, `--hb-surface`, etc. Switching themes applies a `data-theme` attribute to the document root, which activates the corresponding CSS variable set with a smooth transition.

## License

MIT
