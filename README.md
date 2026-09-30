# PisoPath

Personal expense and transportation tracker for the Philippines. React + Vite + Tailwind v4, with Supabase for auth and storage. Installable as a PWA on desktop and mobile.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase values
npm run dev
```

The app will show a red banner instead of the UI if `VITE_SUPABASE_URL` or
`VITE_SUPABASE_PUBLISHABLE_KEY` is missing, so a misconfigured build never fails silently.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server on localhost |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Oxlint |

## Deploying to Vercel

`.env.local` is gitignored, so the deployment needs its own copy of the variables.
Vite inlines `VITE_*` at **build** time — changing them requires a rebuild, not
just a redeploy.

1. **Project → Settings → Environment Variables**, add both, for all environments:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
2. **Deployments → Redeploy**. Use "Redeploy" rather than "Build" so the new values
   are picked up.

The publishable (anon) key is designed to be public and is safe to ship in a browser
bundle. Never use the `service_role` key here.

`vercel.json` rewrites all routes to `index.html`, which is required because the app
uses `BrowserRouter` — without it, opening `/settings` or refreshing a deep link returns
Vercel's 404 page.

In Supabase, add the production URL to **Authentication → URL Configuration** as a
redirect URL, or the email confirmation and password-reset links will bounce to localhost.

## Schema

`supabase/schema.sql` holds the tables, RLS policies, and indexes. Apply it in the
Supabase SQL editor on a new project.