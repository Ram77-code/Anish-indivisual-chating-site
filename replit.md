# replit.md

## Overview

This is an AI character chat application where users can create custom AI characters with distinct personalities and have conversations with them. Each character has a name, description, system prompt (personality definition), and optional avatar. Users can manage multiple characters, send messages, and receive AI-generated responses powered by OpenAI. The app features a mobile-first responsive design with a chat interface similar to messaging apps.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router) — currently a single-page app with Home route
- **State Management**: TanStack React Query for server state (data fetching, caching, mutations)
- **UI Components**: shadcn/ui component library (New York style) built on Radix UI primitives with Tailwind CSS
- **Styling**: Tailwind CSS with CSS custom properties for theming (light/dark mode support)
- **Animations**: Framer Motion for page transitions and message bubble animations
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend Architecture
- **Framework**: Express 5 on Node.js with TypeScript (compiled via tsx)
- **API Pattern**: RESTful JSON API under `/api/` prefix
- **Route Definitions**: Centralized in `shared/routes.ts` with Zod schemas for input validation and response types — shared between client and server
- **AI Integration**: OpenAI SDK configured via `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL` environment variables (Replit AI Integrations)
- **Dev Server**: Vite dev server middleware in development, static file serving in production
- **Build**: Custom build script using esbuild for server and Vite for client; outputs to `dist/`

### Data Storage
- **Database**: PostgreSQL via `DATABASE_URL` environment variable
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` — shared between frontend and backend
- **Schema Push**: `npm run db:push` uses drizzle-kit to push schema changes
- **Tables**:
  - `characters` — id, name, description, system_prompt, avatar_url, created_at
  - `messages` — id, character_id (FK to characters), role (user/assistant), content, timestamp
- **Note**: There's also a `shared/models/chat.ts` with `conversations` and `messages` tables used by Replit integration modules — these are separate from the main app schema

### Storage Layer
- **Pattern**: Interface-based storage (`IStorage`) with `DatabaseStorage` implementation in `server/storage.ts`
- **Operations**: CRUD for characters, read/create/clear for messages

### Replit Integrations
Located in `server/replit_integrations/` and `client/replit_integrations/`:
- **Chat**: Pre-built conversation routes and storage for generic chat
- **Audio**: Voice recording, playback, speech-to-text, text-to-speech utilities
- **Image**: Image generation via gpt-image-1 model
- **Batch**: Batch processing with rate limiting and retries for LLM calls
These are utility modules that can be registered on the Express app if needed.

### Key Design Decisions
1. **Shared schema and routes**: The `shared/` directory contains both the database schema and API route definitions, ensuring type safety across the full stack
2. **Zod everywhere**: Input validation and type inference use Zod schemas derived from Drizzle table definitions via `drizzle-zod`
3. **Mobile-first**: The UI is designed mobile-first with a sidebar that slides in/out on mobile (Sheet component) and auto-scrolling chat interface
4. **Theme support**: Light/dark mode via CSS custom properties and a ThemeProvider context

## External Dependencies

- **PostgreSQL**: Primary database, connected via `DATABASE_URL` environment variable. Required for the app to function.
- **OpenAI API**: Used for AI character chat responses. Configured via `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL` environment variables (Replit AI Integrations blueprint).
- **Google Fonts**: Loads Architects Daughter, DM Sans, Fira Code, Geist Mono, Outfit, and Inter fonts from Google Fonts CDN.
- **No authentication**: The app currently has no auth system — all characters and messages are globally accessible.