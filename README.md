# Recipe Finder

AI-powered recipe suggestion app built with `React`, `TypeScript`, `Vite`, `Tailwind CSS v4`, `Express`, and the `OpenAI` API.

## Stack

- `React 18`
- `TypeScript`
- `Vite`
- `Tailwind CSS v4`
- `Express`
- `OpenAI GPT-4o-mini`
- `DALL-E 3`

## Local Setup

1. Create an environment file.

You can either:

- copy [.env.example](/Users/pattyharris/Documents/FlavioCopesBootcamp/AIBootcamp/Week5/.env.example) to `.env.local`
- or keep using the existing `.env.api.key`

2. Add your API key.

The backend reads:

- `OPENAI_API_KEY`
- or `OPEN_AI_API_KEY`

Optional variables:

- `PORT` defaults to `8787`
- `HOST` defaults to `127.0.0.1`
- `STITCH_API_KEY` is not required for the current local app flow
- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SECRET_KEY` are reserved for later and are not used by the app yet

3. Install dependencies:

```bash
npm install
```

4. Optional for Supabase-backed persistence:

- run [supabase/schema.sql](/Users/pattyharris/Documents/FlavioCopesBootcamp/AIBootcamp/Week5/supabase/schema.sql) in the Supabase SQL editor
- set `SUPABASE_URL`
- set `SUPABASE_SECRET_KEY`

If those Supabase keys are not set, the app falls back to local browser bookmarks and in-memory search history.

## Run Locally

Start the frontend and backend together:

```bash
npm run dev
```

Local URLs:

- Frontend: `http://localhost:5173`
- Backend health check: `http://127.0.0.1:8787/api/health`

## Run Frontend And Backend Separately

Frontend only:

```bash
npm run dev:client
```

Backend only:

```bash
npm run dev:server
```

This is useful if you want to work on the UI and API in separate terminal tabs.

## Run With Or Without Supabase

### With Supabase persistence

Set:

- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`

Then run:

```bash
npm run dev
```

In this mode:

- bookmarks persist in Supabase
- search history persists in Supabase
- the local backend still runs on your machine

### Without Supabase persistence

Leave these unset:

- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`
- `SUPABASE_PUBLISHABLE_KEY`

Then run:

```bash
npm run dev
```

In this mode:

- bookmarks fall back to browser `localStorage`
- search history falls back to local runtime memory
- no Supabase reads or writes are attempted

## Production Verification

Build the app locally:

```bash
npm run build
```

Run the built backend:

```bash
npm start
```

## Render Deployment Env Vars

If you deploy the current Express app to Render, add these environment variables in the Render dashboard:

Required now:

- `OPENAI_API_KEY`

Optional:

- `OPEN_AI_API_KEY`
- `HOST`
- `PORT`
- `STITCH_API_KEY`

Reserved for later Supabase integration:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`

Suggested current Render setup:

- set `OPENAI_API_KEY`
- let Render provide `PORT`
- do not set `HOST` unless you need to override it
- leave the Supabase keys blank until the app actually uses Supabase

## Current Project Status

At this point in the project, the app includes:

- ingredient tag input for pantry items
- server-side OpenAI recipe generation
- structured JSON recipe responses
- exactly 4 suggested recipes per request
- recipe cards with cook time and difficulty
- recipe detail modal with ingredients and instructions
- bookmark saving with `localStorage`
- in-memory caching for repeated ingredient combinations
- Tailwind-based frontend styling

## How GPT-4o-mini Is Used

The frontend does not call OpenAI directly. Instead:

- the React app sends the current ingredient list to the backend route `/api/recipes/suggest`
- the Express backend calls `gpt-4o-mini` to generate recipe content
- the model is asked to return JSON only, not free-form text
- the response is constrained to exactly 4 recipes using a JSON schema
- the server validates the returned JSON with `zod` before sending it back to the frontend

Each recipe includes:

- `id`
- `title`
- `description`
- `cookTime`
- `difficulty`
- `ingredients`
- `instructions`

After the recipes are generated, the backend also attempts to create a recipe image for each one using `dall-e-3`.

## File Guide

- [src/App.tsx](/Users/pattyharris/Documents/FlavioCopesBootcamp/AIBootcamp/Week5/src/App.tsx): main app flow, ingredient search requests, grouped result rows, and bookmarks page
- [src/components/IngredientInput.tsx](/Users/pattyharris/Documents/FlavioCopesBootcamp/AIBootcamp/Week5/src/components/IngredientInput.tsx): ingredient entry UI and starter ingredient chips
- [src/components/SearchResultsRow.tsx](/Users/pattyharris/Documents/FlavioCopesBootcamp/AIBootcamp/Week5/src/components/SearchResultsRow.tsx): grouped search result rows with left/right scroll controls
- [src/components/RecipeCard.tsx](/Users/pattyharris/Documents/FlavioCopesBootcamp/AIBootcamp/Week5/src/components/RecipeCard.tsx): recipe card presentation and bookmark action
- [src/components/RecipeModal.tsx](/Users/pattyharris/Documents/FlavioCopesBootcamp/AIBootcamp/Week5/src/components/RecipeModal.tsx): modal for full recipe details
- [src/lib/storage.ts](/Users/pattyharris/Documents/FlavioCopesBootcamp/AIBootcamp/Week5/src/lib/storage.ts): browser bookmark persistence and clearing
- [server/index.ts](/Users/pattyharris/Documents/FlavioCopesBootcamp/AIBootcamp/Week5/server/index.ts): Express server, health route, and `/api/recipes/suggest` endpoint
- [server/openai.ts](/Users/pattyharris/Documents/FlavioCopesBootcamp/AIBootcamp/Week5/server/openai.ts): `gpt-4o-mini` recipe generation, JSON schema response handling, and `dall-e-3` image generation
- [server/cache.ts](/Users/pattyharris/Documents/FlavioCopesBootcamp/AIBootcamp/Week5/server/cache.ts): in-memory caching for repeated ingredient searches
- [server/persistence.ts](/Users/pattyharris/Documents/FlavioCopesBootcamp/AIBootcamp/Week5/server/persistence.ts): Supabase-backed persistence for bookmarks and search history
- [supabase/schema.sql](/Users/pattyharris/Documents/FlavioCopesBootcamp/AIBootcamp/Week5/supabase/schema.sql): SQL schema for bookmarks and search history tables
- [src/styles/global.css](/Users/pattyharris/Documents/FlavioCopesBootcamp/AIBootcamp/Week5/src/styles/global.css): Tailwind v4 theme tokens and global typography

## Known Issues / Current Limitations

- The README and some setup files still use the older working project name `Recipe Finder`, while the UI branding is now `Pantry Chef`.
- Recipe response caching is in-memory only, so cached AI results are lost whenever the backend restarts.
- Bookmarks and search history persist through Supabase only when `SUPABASE_URL` and `SUPABASE_SECRET_KEY` are configured; otherwise the app falls back to browser/local memory behavior.
- Recipe image generation depends on `dall-e-3`; if image creation fails, recipes still render without images.
- The Stitch-exported screens and assets have not yet been imported directly, so the UI is still an approximation of the intended Stitch design.
- The app is currently tuned for local development and has not yet been documented for remote deployment.

## Notes

- The OpenAI API key is only used on the server and is not exposed to the browser.
- The frontend calls the backend through the Vite dev proxy using `/api`.
- Recipe response caching is currently in-memory, so it resets when the server restarts.
- Stitch-exported UI assets have not been wired into the app yet.
