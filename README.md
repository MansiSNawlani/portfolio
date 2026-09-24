# mansisn.com

Personal portfolio of Mansi S. Nawlani, Software Engineer. Live at [mansisn.com](https://mansisn.com).

The site pulls all of its content (profile, experience, projects, skills, certifications) from Sanity CMS, and includes an AI twin that visitors can chat with after signing in.

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4, shadcn/ui, Motion
- **Content:** Sanity CMS, with an embedded Studio at `/studio`
- **Auth:** Clerk (sign-in for the AI chat)
- **AI chat:** OpenAI ChatKit / AgentKit
- **Tooling:** pnpm, Biome (lint and format)

## Getting started

Requires Node.js 20+ and pnpm.

```bash
pnpm install
# create .env.local with the variables listed below
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the site and [http://localhost:3000/studio](http://localhost:3000/studio) for the CMS.

### Environment variables

Create `.env.local` in the project root:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset, e.g. `production` or `develop` |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | URL of the Studio, used for visual editing |
| `SANITY_API_TOKEN` | Sanity token with write access (contact form, server actions) |
| `SANITY_VIEWER_TOKEN` | Sanity token with read access to drafts (preview mode) |
| `SANITY_STUDIO_PREVIEW_ORIGIN` | Site origin the Studio previews |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `OPENAI_API_KEY` | OpenAI key for the AI twin |
| `NEXT_PUBLIC_CHATKIT_WORKFLOW_ID` | ChatKit workflow ID for the AI twin |

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Check code with Biome |
| `pnpm format` | Format code with Biome |
| `pnpm typegen` | Regenerate TypeScript types from the Sanity schema and queries (run after changing a schema or a GROQ query) |

## Project structure

```
src/
  app/(portfolio)/        Site layout, home page, Open Graph image
  app/(sanity)/studio/    Embedded Sanity Studio
  app/actions/            Server actions (contact form, chat session)
  components/sections/    One component per page section (Hero, About, Experience, …)
  components/ui/          Shared UI components
  sanity/schemaTypes/     Sanity content schemas
  Data/                   Seed content as .ndjson files, plus import scripts
prompts/                  System prompts for the AI twin and its guardrail agents
public/                   Static assets (favicon, world map)
```

## Editing content

All visible content is edited in the Studio at `/studio`. Changes appear on the site without redeploying.

`src/Data/` holds seed data for setting up a fresh dataset (see `src/Data/README.md`). Importing with `--replace` overwrites existing documents, so don't re-import into a dataset you've already edited in the Studio.

## Deployment

Deployed on Vercel. Set the environment variables above in the Vercel project settings, then deploy from `main`.
