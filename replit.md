# HABEAT - Premium Habit Tracker

## Overview
A SaaS-ready habit tracking application with 12 natural CSS-variable-based themes (5 light + 7 dark), streak tracking, analytics, and subscription architecture with Free/Pro plan enforcement.

## Architecture
- **Frontend**: React 19 + Vite + Tailwind CSS v4 + Framer Motion + TanStack Query
- **Backend**: Express.js 5 with REST API
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: wouter (frontend)

## Data Model
- `habits` table: id, name, category, target, icon, color, completedDays (jsonb)
- `profiles` table: id, name, bio, avatarUrl, role (free/pro), accentColor (theme id string)
- Categories: "Health & Body", "Mind & Soul", "Work & Growth"

## API Routes
- `GET /api/health` - Health check (returns status, uptime, timestamp)
- `GET /api/habits` - List all habits
- `POST /api/habits` - Create a habit
- `DELETE /api/habits/:id` - Delete a habit
- `POST /api/habits/:id/toggle` - Toggle a day's completion (body: { date: "YYYY-MM-DD" })
- `GET /api/profile` - Get user profile
- `PATCH /api/profile` - Update profile (name, bio, avatarUrl, accentColor)
- All routes wrapped in asyncHandler for proper error propagation
- Input validation: date format regex, string length limits on profile fields

## Theme System (CSS Variables)
- **12 themes**: Classic White (light), Classic Dark (default dark), Neon Noir, Arctic Pulse, Lavender Haze, Cyber Teal, Ember Night, Midnight Sakura, Titanium Frost, Ocean Nebula, Mocha Glow, Prism Dusk
- Themes defined as CSS custom property sets in `client/src/index.css`
- Activated via `[data-theme="theme-id"]` attribute on `<html>` element
- Default (Classic Dark) uses `:root` variables, other themes use `[data-theme]` selectors
- All color values consumed via `var(--hb-*)` in inline styles — NO dynamic Tailwind classes
- Variables: `--hb-bg`, `--hb-accent`, `--hb-surface`, `--hb-nav-bg`, `--hb-text`, `--hb-chart-line`, etc.
- Theme persisted in localStorage (`hb-theme`) and server profile (`accentColor`)
- Smooth 300ms transitions on `background-color` and `color` via CSS

## UI System
- Dark glass surfaces: `bg-white/5` to `bg-white/10`, `border-white/10`, `backdrop-blur-xl`
- Habit tiles: empty → dim glass (`--hb-tile-default`), completed → accent glow (`--hb-done-bg` + `--hb-done-glow`)
- Micro-animations: completion pulse glow, fade-up card entrance, ambient background drift, button hover elevation
- Floating glow orbs in background for ambient effect

## Subscription Plans
- **Free Plan**: Classic White theme only, current month only, unlimited habits, basic streaks
- **Pro Plan**: All 12 themes, full month history navigation, advanced analytics, export data
- Free users see lock icons on month nav arrows and premium themes
- Clicking locked features opens upgrade dialog with Free vs Pro comparison
- Upgrade banner shown between header and grid for free users
- `effectiveDate = isFree ? new Date() : currentDate` locks free users to current month
- Pricing: $4.99/month or $2.99/month (yearly, 40% savings)
- Payment integration placeholder (7-day free trial CTA)

## Key Features
- Monthly calendar grid with day-by-day habit completion toggles
- Streak counter with flame icon per habit
- Analytics chart modal: SVG line chart, weekly bar chart, per-habit progress bars, summary stats (Pro only)
- Profile system with avatar, name, bio
- Subscription plan enforcement with upgrade dialog
- Mobile-optimized: full vertical scroll, touch-friendly, responsive to 390px
- Motivational quotes on daily completions
- Optimistic updates on ALL mutations

## Key Files
- `shared/schema.ts` - Drizzle schema and Zod validation
- `server/routes.ts` - API routes
- `server/storage.ts` - Database storage layer
- `server/db.ts` - Database connection
- `client/src/pages/home.tsx` - Main UI component (theme logic, analytics, all views)
- `client/src/index.css` - CSS variable theme definitions, glass utilities, animations
- `client/index.html` - Entry HTML with meta tags and Google Fonts
- `.env.example` - Environment variable template
