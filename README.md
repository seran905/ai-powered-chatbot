# AI Powered Chatbot

A full-stack playground for React + Express + the OpenAI API with two demos:

1. **WonderWorld chatbot** — a customer support bot for a fictional theme park
   that answers visitor questions (tickets, rides, park info) in a friendly
   tone, grounded in a park info document and steered by a custom system prompt.
2. **Review summarizer** — shows a product's customer reviews (stored in MySQL
   via Prisma) and generates an AI summary of them on demand.

The UI has a **Chat / Reviews** tab switcher to move between the two demos.

## Features

- **Conversational chat UI** — a chat window with user/bot message bubbles, a
  typing indicator while the bot is responding, and auto-scroll to the latest
  message.
- **Multi-turn conversations** — each browser session gets a `conversationId`;
  the server tracks OpenAI's `previous_response_id` per conversation so the
  bot remembers context across messages.
- **Grounded, on-topic answers** — the bot's system prompt embeds a park info
  document and restricts it to WonderWorld-related questions, in a cheerful
  tone, without inventing information.
- **Rich markdown rendering** — bot replies are rendered with `react-markdown`
  and styled with the Tailwind Typography plugin, so lists, headings, links,
  and code render cleanly instead of as raw text.
- **Sound effects** — a short "pop" plays when you send a message, and a
  notification sound plays when the bot replies.
- **Input validation** — the chat form (via `react-hook-form`) blocks empty
  submissions client-side; the API validates every request with `zod` and
  returns structured field errors on invalid input.
- **Keyboard-friendly input** — `Enter` sends the message, `Shift+Enter` adds
  a new line.
- **Error handling** — network/API failures surface an inline error message
  in the chat instead of failing silently.
- **AI review summaries** — a "Summarize" button condenses a product's latest
  reviews into a short paragraph of key positive and negative themes, with a
  loading skeleton while it generates and an inline error if it fails.
- **Summary caching** — generated summaries are stored in the database and
  reused for 7 days, so repeat requests don't call OpenAI again.
- **Tab navigation** — switch between Chat and Reviews without losing either
  view's state (chat history, loaded reviews).

## Tech stack

**Client** (`packages/client`)
- React 19 + Vite + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`) + Tailwind Typography plugin
- shadcn-style UI components on top of Base UI (`@base-ui/react`)
- `react-hook-form` for form state/validation
- `react-markdown` for rendering bot responses
- `axios` for API calls
- TanStack Query (`@tanstack/react-query`) for fetching reviews and the
  summarize mutation, with `react-loading-skeleton` loading states

**Server** (`packages/server`)
- Express 5 + TypeScript, run directly with Bun (no build step)
- OpenAI API (`openai` SDK, Responses API) for chat completions
- `zod` for request validation
- MySQL + Prisma 7 (`@prisma/client` with the `@prisma/adapter-mariadb` driver
  adapter) for products, reviews, and cached summaries
- `dayjs` for summary expiry dates
- `dotenv` for environment configuration

**Tooling**
- [Bun](https://bun.com) as the runtime, package manager, and workspace
  manager (single hoisted `node_modules` at the repo root)
- Bun workspaces monorepo layout
- ESLint + Prettier, with Husky + lint-staged running formatting on commit

## Project structure

```
my-app/
├── index.ts                  # Root dev entrypoint — runs client + server concurrently
├── packages/
│   ├── client/                # React + Vite frontend
│   │   └── src/
│   │       ├── components/
│   │       │   ├── chat/       # ChatBot, ChatInput, ChatMessage, TypingIndicator
│   │       │   ├── reviews/    # ReviewList, ReviewSkeleton, StarRating, ReviewsApi
│   │       │   └── ui/         # shadcn-style UI primitives (Button, etc.)
│   │       └── assets/sounds/  # Message sent/received sound effects
│   └── server/                 # Express + OpenAI backend
│       ├── routes.ts
│       ├── controllers/        # Request validation + response shaping
│       ├── services/           # Chat + review summarization logic
│       ├── repositories/       # Conversation store (in-memory) + Prisma data access
│       ├── llm/                # Thin OpenAI client wrapper
│       ├── lib/prisma.ts       # Shared Prisma client (MariaDB/MySQL adapter)
│       ├── prisma/             # schema.prisma + migrations
│       └── prompts/            # Chatbot + review-summary prompts, WonderWorld park info
```

## Prerequisites

- [Bun](https://bun.com) v1.4+
- An [OpenAI API key](https://platform.openai.com/api-keys)
- A running MySQL server (for the review summarizer)

## Setup

1. Install dependencies (single install at the repo root, thanks to Bun
   workspaces):

   ```bash
   bun install
   ```

2. Configure the server's environment variables:

   ```bash
   cp packages/server/.env.example packages/server/.env
   ```

   Then edit `packages/server/.env`:

   ```
   OPENAI_API_KEY=sk-<your-openai-api-key>
   DATABASE_URL=mysql://<user>:<password>@<host>:<port>/<database>
   ```

3. Create the database tables and generate the Prisma client (run from
   `packages/server`):

   ```bash
   cd packages/server
   bunx prisma migrate dev   # applies the migrations
   bunx prisma generate      # generates ./generated/prisma (not run by migrate in Prisma 7)
   ```

   Re-run `bunx prisma generate` after any change to `prisma/schema.prisma`.
   The repo doesn't ship seed data, so add a product and some reviews to your
   database to try the summarizer.

## Running

Run both the client and server together from the repo root:

```bash
bun run dev
```

- Client (Vite dev server): http://localhost:5173
- Server (Express API): http://localhost:3000

The client's dev server proxies `/api/*` requests to the Express server, so
no CORS configuration is needed in development.

To run a package on its own:

```bash
bun run --cwd packages/client dev    # frontend only
bun run --cwd packages/server dev    # backend only (auto-restarts on change)
```

### Other client commands

```bash
bun run --cwd packages/client build    # type-check + production build
bun run --cwd packages/client lint     # ESLint
bun run --cwd packages/client preview  # preview the production build
```

## API

### `POST /api/chat`

Request body:

```json
{
   "prompt": "What rides do you have?",
   "conversationId": "5b1f3c2e-....-....-....-............"
}
```

- `prompt` — a non-empty string, max 1000 characters.
- `conversationId` — a UUID identifying the conversation (generated
  client-side per session); used to link follow-up messages to the same
  OpenAI response chain.

Response:

```json
{ "message": "..." }
```

Invalid input returns `400` with a flattened Zod error; upstream/OpenAI
failures return `500`.

### `GET /api/products/:id/reviews`

Returns a product's reviews (newest first) and its cached summary, if any:

```json
{ "summary": "..." , "reviews": [{ "id": 1, "author": "...", "rating": 5, "content": "...", "createdAt": "..." }] }
```

`400` for a non-numeric ID, `404` if the product doesn't exist.

### `POST /api/products/:id/summarize`

Summarizes the product's 10 most recent reviews with OpenAI, stores the result
(valid for 7 days), and returns it. A still-valid stored summary is returned
without calling OpenAI.

```json
{ "summary": "..." }
```

`400` for a non-numeric ID, `404` if the product doesn't exist or has no reviews.
