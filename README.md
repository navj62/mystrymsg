# True Feedback

An anonymous feedback app. Sign up, get a personal link (`/u/your-username`), and
share it — anyone can send you honest, anonymous messages without an account.
Recipients manage their inbox from a dashboard and can toggle whether they're
currently accepting messages. Message-writers who are stuck can pull AI-generated
prompt suggestions.

## Features

- **Email-verified auth** — credentials sign-up with a 6-digit code emailed via
  Resend; login/session handled by NextAuth (JWT strategy).
- **Anonymous messaging** — public profile pages accept messages with no account
  required; recipients can turn message-acceptance on/off.
- **Dashboard inbox** — view, refresh, and delete received messages; copy your
  shareable profile link.
- **AI prompt suggestions** — Google Gemini generates conversation starters, with
  a graceful fallback to canned prompts when the API is unavailable.
- **Validation everywhere** — shared Zod schemas on the client (react-hook-form)
  and server.

## Tech stack

| Layer       | Choices                                                        |
| ----------- | ------------------------------------------------------------- |
| Framework   | Next.js 15 (App Router, Turbopack), React 19, TypeScript      |
| Auth        | NextAuth (Credentials provider, JWT sessions)                 |
| Database    | MongoDB + Mongoose                                            |
| Email       | Resend + React Email                                          |
| AI          | Google Gemini (`@google/genai`)                               |
| UI          | Tailwind CSS v4, shadcn/ui (Radix), Framer Motion, Sonner     |
| Validation  | Zod                                                           |

## Getting started

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env   # then fill in the values (see below)

# 3. Run the dev server
npm run dev            # http://localhost:3000
```

### Environment variables

See [`.env.example`](.env.example). You'll need:

| Variable          | What it's for                                               |
| ----------------- | ----------------------------------------------------------- |
| `MONGODB_URI`     | MongoDB connection string (e.g. a free Atlas cluster)       |
| `NEXTAUTH_SECRET` | NextAuth signing secret (`openssl rand -base64 32`)         |
| `RESEND_API_KEY`  | Resend API key for verification emails                      |
| `GEMINI_API_KEY`  | Google Gemini key for AI suggestions (optional; falls back) |

## Scripts

| Command         | Description                       |
| --------------- | --------------------------------- |
| `npm run dev`   | Start the dev server (Turbopack)  |
| `npm run build` | Production build                  |
| `npm run start` | Run the production build          |
| `npm run lint`  | Lint with ESLint                  |

## Project structure

```
src/
  app/
    (app)/        # Authenticated area: dashboard + public /u/[username] pages
    (auth)/       # sign-in, sign-up, verify
    api/          # Route handlers (auth, messages, verification, AI)
  components/     # UI + feature components (shadcn/ui under components/ui)
  model/          # Mongoose schemas
  schemas/        # Zod validation schemas (shared client/server)
  lib/, helpers/  # DB connection, email, utils
```
