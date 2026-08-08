# Conference Management Tool (CMT)
### Lok Jagruti Kendra University — IEEE Student Branch

A centralized system for managing conferences across the university's full lifecycle (past/current/upcoming), organized department-wise, with author registration, paper/poster submission, admin review, and PDF reporting.

## Tech Stack
- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS + glassmorphism design system (near-black background, gold accents)
- **Database + Auth + Storage:** Supabase (Postgres, Supabase Auth, Supabase Storage)
- **PDF generation:** `pdf-lib` (server-side)
- **Background visual:** LiquidEther-style fluid animation (gold/white/charcoal)
- **Hosting:** Vercel

## Setup

### 1. Supabase project
1. Go to [supabase.com](https://supabase.com) → New Project.
2. Name it `cmt-ljuniversity`, set a database password, choose a region close to India (Singapore).
3. Once provisioned, open **SQL Editor** → paste the contents of `supabase/schema.sql` → Run.
4. Go to **Authentication → Providers** → ensure Email is enabled, and **enable "Confirm email"** (required for author email verification).
5. Go to **Authentication → Users → Add user** → create the single admin account (email + password). This account logs in at `/admin/login`.
6. Go to **Project Settings → API** → copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` (server-only, keep secret)

### 2. Local project setup
```bash
cd conference-management-tool
npm install
cp .env.local.example .env.local
# paste your Supabase keys into .env.local
npm run dev
```
Visit `http://localhost:3000`.

### 3. GitHub
```bash
git init
git add .
git commit -m "Initial commit: Conference Management Tool"
git branch -M main
git remote add origin https://github.com/<your-username>/cmt-ljuniversity.git
git push -u origin main
```

### 4. Vercel deploy
1. [vercel.com](https://vercel.com) → New Project → Import the GitHub repo.
2. In **Environment Variables**, add the same three keys from `.env.local`.
3. Click Deploy. Your app will be live at `https://<project>.vercel.app`.

### 5. Seed a conference (optional, for demo)
In Supabase → Table Editor → `conferences` → Insert row manually, or use the admin dashboard once logged in.

## Feature status

| Feature | Status |
|---|---|
| Conference lifecycle (past/current/upcoming) | ✅ |
| Department-wise organization + filter | ✅ |
| Brochure/Flyer publishing (Supabase Storage) | ✅ |
| Paper + Poster submission types | ✅ |
| Author registration (Supabase Auth) | ✅ |
| Author email verification | ✅ |
| Unique Abstract ID generation | ✅ |
| Upload validation (PDF/PNG/JPG, max 10MB) | ✅ |
| Admin search + status management | ✅ |
| Per-conference PDF reports | ✅ |
| Admin authentication (single account) | ✅ |
| Registration fee payment gateway | 🔜 Stubbed — shows "Pay at venue / Payment link coming soon"; wire to Razorpay Payment Links post-launch |

## Notes on `components/LiquidEther.jsx`

The PRD calls for the full React Bits `LiquidEther` Three.js component to be pasted in verbatim. That source wasn't provided alongside this PRD, so this file currently ships with a lightweight canvas-based fallback that already accepts the same props (`colors`, `resolution`, `mouseForce`, etc.) used elsewhere in the app. Drop in the real React Bits component source whenever you have it — no other file needs to change.

## Project structure

See `app/`, `components/`, and `lib/supabase/` for the Next.js App Router pages, shared UI, and Supabase client helpers respectively. `supabase/schema.sql` contains the full database schema, RLS policies, and storage bucket setup.
