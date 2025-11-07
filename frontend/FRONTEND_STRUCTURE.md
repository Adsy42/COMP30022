# Frontend Structure & Handover Notes

This document gives incoming maintainers a quick map of the `frontend/` Next.js app, the most important entry points, and the commands required to run or test it.

## Project Overview

- **Framework**: Next.js 15 (App Router) with TypeScript and TailwindCSS.
- **UI building blocks**: colocated in `src/components/` and used across marketing, chat, and admin surfaces.
- **State/data layer**: lightweight hooks + API helpers in `src/lib/api/`.
- **Testing**: Jest + Testing Library with colocated specs under `src/app/**/__tests__`.

## Directory Layout

| Path | Purpose |
| --- | --- |
| `src/app/` | Route handlers, layouts, and page components. Includes `admin/`, `chat/`, `login/`, plus shared tests under `__tests__/`. |
| `src/app/globals.css` | Tailwind entrypoint plus shared utility classes. |
| `src/components/` | Reusable presentation + UX primitives (Navbar, Chat bubble/input, admin modals, etc.). |
| `src/lib/api/` | All API clients, types, and higher-level helpers for chats, analytics, uploads, auth, etc.; import via `@/lib/api`. |
| `public/` | Static assets (logos, SVG icons) served by Next.js. |
| `jest.config.js`, `jest.setup.js` | Jest setup for unit tests, including jsdom environment. |
| `tsconfig.json` | TypeScript project config with baseUrl/paths for the `@/` alias. |
| `.env.local.example` | Reference env vars for local development (copy to `.env.local`). |
| `Dockerfile` | Container build for production deployments (installs dependencies, runs `next build`, exposes 3000). |

## Key Pages & Components

- `src/app/page.tsx`: Public landing page combining `Navbar`, `Hero`, `Threads`, and `PlayfulBackground`.
- `src/app/chat/page.tsx`: End-to-end chat orchestration (template fetching, branching logic, file uploads, finalize/escalate flows). Relies heavily on:
  - `ChatBubble`, `TypingBubble`, `ChatInput`, `ChoiceGroup`, and the API helpers in `src/lib/api/`.
- `src/app/admin/page.tsx`: Analytics dashboard with KPI cards and `AnalyticsChart`, linking to form/email configuration sections.
- `src/app/admin/form-config/page.tsx`: Admin drag-and-drop builder for question templates using `QuestionList`, `QuestionCard`, and `AddQuestionModal`.
- `src/app/admin/email-config/page.tsx`: UI for updating the escalation recipient email (reads/writes via `fetchEmailConfig`/`updateEmailConfig`).

## API Helpers (src/lib/api)

All HTTP interactions go through the thin wrapper in `client.ts` (exposes `API_BASE` and `api<T>()`). Higher-level helpers include:

- `chats.ts`: `startChat`, `submitAnswers`.
- `templates.ts`: `getTemplate` for `common/simple/complex` flows.
- `uploads.ts`: `uploadFile` for attachments.
- `finalize.ts` / `escalations.ts`: Resolving chats or escalating to humans.
- `formQuestions.ts`, `config.ts`, `analytics.ts`, `auth.ts`: Admin features (question CRUD, email config, dashboards, login).
- `types.ts`: Shared TypeScript interfaces used throughout the app.

Import tip: `@/lib/api` re-exports everything, so components/pages only need a single import path.

## Running, Building, Testing

From the `frontend/` directory:

```bash
npm install          # install dependencies (once)
npm run dev          # start Next.js dev server on http://localhost:3000
npm run build        # production build
npm start            # run built app (after npm run build)
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
npm test             # Jest unit suite
```

### Environment Variables

Copy `.env.local.example` to `.env.local` and update values as needed (API base URL, auth secrets, etc.). `API_BASE` defaults to `http://localhost:5001` if no env is provided.

## Deployment Considerations

- **Docker**: Use the provided `Dockerfile` for reproducible builds. It installs dependencies, runs `next build`, and launches `next start`.
- **Static assets**: Anything outside `src/` (e.g. `public/logoipsum-401.svg`) is served directly by Next.js; remember to include them in deployments.
- **Monitoring**: Critical flows (chat + admin pages) depend on backend endpoints; confirm `API_BASE` is reachable in the target environment.

## Additional Notes for Handover

- Components already include `@file` headers summarizing their roles--scan those for quick context.
- Drag-and-drop admin tooling depends on `@hello-pangea/dnd`; ensure the browser has `crypto.randomUUID` (polyfill if targeting older environments).
- Jest tests mock expensive components like `Threads` and `ChatInput` to keep suites fast; keep mocks updated if component APIs change.
- When extending the chat workflow, favor adding new API helpers or types under `src/lib/api/` so pages stay thin.

For any updates, keep code style aligned with Prettier + ESLint (`npm run format` / `npm run lint`) before committing.
