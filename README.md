# Atlas Process Analyst — Prototype UI

Non-functional UI prototype for the Atlas/Alfred Process Analyst experience. It translates the locked decisions from [`process-analyst` PR #3](https://github.com/CSTMR-AI/process-analyst/pull/3) into real screens using **Next.js 16 + Tailwind v4 + shadcn/ui (base)**. All data is mocked in `src/data/mock-data.ts`; there is no backend.

## What’s inside

| Area | Highlights |
| --- | --- |
| Manager navigator (`/`) | Department → People → Roles tree, extraction snapshot, session health, quick links into the other flows. |
| Create discussion (`/discussions/new`) | Identity = person + role (no title). Schedule helper, Atlas notes, fake invite link generator. |
| Employee call app (`/call/[sessionId]`) | Consent modal (Proceed-only), minimal in-call UI stub, timer after consent. |
| Manager review (`/discussions/[id]`) | 3-column grid: session list with exception pills, extraction editor, transcript editor. Editing the transcript triggers a mocked “re-synthesis” (spinner + updated extraction). Transcript ↔ extraction highlighting is simulated via evidence chips. |

## Run it locally

```bash
npm install
npm run dev
```

- App: `http://localhost:3000`
- Create flow: `http://localhost:3000/discussions/new`
- Call preview: use `http://localhost:3000/call/session-102`
- Manager review: `http://localhost:3000/discussions/discussion-ava-ops`

Quality checks:

```bash
npm run lint   # ESLint
npm run build  # Ensures Vercel will succeed
```

## Deploying to Vercel

1. Push this branch to GitHub.
2. Create a Vercel project from the repo (Next.js defaults work).
3. The `npm run build` output above matches Vercel’s build step, so previews should be green without extra config.

## Mock data

`src/data/mock-data.ts` centralises all departments, people, discussions, and consent copy. Adjusting that file updates the navigator, call app, and manager workspace simultaneously.

---
Built with ❤️ by Stack for Dan — no backend, just the flows we need to review UX.
