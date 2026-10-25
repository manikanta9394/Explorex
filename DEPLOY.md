# Explorex Production Deployment & Infrastructure Guide

This guide documents the complete end-to-end deployment procedure for **Explorex** across **Vercel** (Frontend SPA + Serverless AI API), **Supabase** (Postgres + Auth + Storage), and **GitHub Pages** (Static project alternative).

---

## 1. Architecture Overview

```mermaid
flowchart TD
    Client["Client Browser (Desktop / Mobile)"] -->|HTTPS / WSS| CDN["Vercel Global Edge CDN"]
    CDN -->|Static SPA Assets (HTML, JS, CSS)| ReactApp["Explorex React 19 Client"]
    CDN -->|/api/chat| Serverless["Vercel Serverless Function (api/chat.js)"]
    Serverless -->|RAG Grounded Retrieval| PlacesDataset[("507 Verified Indian Destinations")]
    Serverless -->|LLM Synthesis| OpenRouter["OpenRouter API (Gemma / DeepSeek)"]
    ReactApp -->|Direct Auth & Real-Time Sync| SupabaseAuth["Supabase Auth & Postgres DB"]
    ReactApp -->|Telemetry| Sentry["Sentry Error Tracking & Analytics Ring"]
```

---

## 2. Environment Variables Reference

| Variable | Context | Required | Description |
| :--- | :---: | :---: | :--- |
| `VITE_SUPABASE_URL` | Frontend (Public) | Yes | Supabase Project URL (`https://your-project.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Frontend (Public) | Yes | Supabase Anonymous public key (protected by RLS) |
| `VITE_API_URL` | Frontend (Public) | Optional | Custom backend URL. Leave empty on Vercel to use relative `/api/chat` |
| `VITE_BASE_PATH` | Frontend (Public) | Optional | Base path (`/` for Vercel/Netlify, `/Explorex/` for GitHub Pages) |
| `VITE_GOOGLE_CLIENT_ID` | Frontend (Public) | Optional | Google OAuth 2.0 Web Client ID for Google login |
| `VITE_SENTRY_DSN` | Frontend (Public) | Optional | Sentry DSN for client-side crash telemetry |
| `OPENROUTER_API_KEY` | Serverless (Private) | Optional | OpenRouter AI key for live LLM streaming. If omitted, local RAG generator is used |
| `OPENROUTER_MODEL` | Serverless (Private) | Optional | Model identifier (default: `google/gemma-3-27b-it:free`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Serverless (Private) | Optional | Privileged Supabase key for serverless database admin |
| `ORS_API_KEY` | Serverless (Private) | Optional | OpenRouteService API key for elevation & routing cache |
| `JWT_SECRET` | Backend (Private) | Optional | Secret key for signing legacy session JWT tokens |
| `CORS_ORIGIN` | Backend (Private) | Optional | Allowed origins (e.g. `https://explorex.in,https://*.vercel.app`) |

> [!WARNING]
> **Security Rule**: The `SUPABASE_SERVICE_ROLE_KEY` and `OPENROUTER_API_KEY` must **NEVER** be prefixed with `VITE_` or referenced in client-side code (`src/`). They must reside exclusively in serverless/backend environment variables.

---

## 3. Recommended Deployment: Vercel + Supabase

### Step 3.1: Deploying Frontend & Serverless Function to Vercel

1. **Import Git Repository**:
   - Go to [vercel.com](https://vercel.com) and click **Add New Project**.
   - Import `https://github.com/manikanta9394/Explorex.git`.
2. **Framework & Build Settings**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. **Configure Environment Variables in Vercel Dashboard**:
   Under **Settings > Environment Variables**, add:
   - `VITE_SUPABASE_URL`: `https://<your-project-id>.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `<your-supabase-anon-key>`
   - `OPENROUTER_API_KEY`: `<your-openrouter-key>` (Server-only)
   - `OPENROUTER_MODEL`: `google/gemma-3-27b-it:free`
4. **Deploy**:
   - Click **Deploy**. Vercel will build the frontend into `dist/` and compile [`api/chat.js`](file:///Users/manikanta/Documents/exploreAI/Explorex/api/chat.js) as an edge serverless function.
   - Automatic SPA routing rewrites and security headers are handled via [`vercel.json`](file:///Users/manikanta/Documents/exploreAI/Explorex/vercel.json).

### Step 3.2: Database Setup & Supabase Migrations

1. **Apply Migrations**:
   Run the SQL migrations from [`supabase/migrations/`](file:///Users/manikanta/Documents/exploreAI/Explorex/supabase/migrations/):
   - `20261024000000_schema_core.sql`: Core tables (`profiles`, `places`, `place_images`, `saved_places`, `trips`, `user_feedback`, `audit_logs`).
   - `20261024000001_pgvector_rag.sql`: Vector extensions (`vector`) and hybrid search functions.
   - `20261024000002_rls_policies.sql`: Row Level Security policies.
2. **Auth & URL Configuration in Supabase Dashboard**:
   - Go to **Authentication > URL Configuration**.
   - **Site URL**: Set to your production Vercel URL (e.g., `https://explorex-travel.vercel.app` or `https://explorex.in`).
   - **Redirect URLs**: Add:
     - `https://<your-project>.vercel.app/**`
     - `http://localhost:5180/**`
     - `https://manikanta9394.github.io/Explorex/**`
3. **Enable Auth Providers**:
   - Under **Authentication > Providers**:
     - **Email**: Enable Email signup (toggle off "Confirm email" if you wish to allow instant guest exploration).
     - **Google**: Enter Google Client ID and Secret if enabling Google Sign-In.
4. **Confirm Row Level Security (RLS)**:
   - Under **Database > Tables**, ensure RLS is enabled on all tables (`profiles`, `saved_places`, `user_feedback`, `audit_logs`).
5. **Create the First Administrator**:
   To preserve governance integrity, sign up normally through the app UI, then promote your account via SQL in the Supabase SQL Editor:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE id = (
     SELECT id FROM auth.users WHERE email = 'your-email@example.com'
   );

   -- Verify promotion
   SELECT id, email, role, display_name FROM public.profiles WHERE role = 'admin';
   ```

---

## 4. Alternative Deployment: GitHub Pages

Explorex includes an automated GitHub Actions deployment workflow at [`.github/workflows/deploy-pages.yml`](file:///Users/manikanta/Documents/exploreAI/Explorex/.github/workflows/deploy-pages.yml).

1. In your GitHub repository, navigate to **Settings > Pages**.
2. Under **Build and deployment > Source**, select **GitHub Actions**.
3. Every push to `main` automatically builds with `VITE_BASE_PATH=/Explorex/` and publishes to:
   **`https://manikanta9394.github.io/Explorex/`**
4. Deep link refreshes without 404s are preserved via the bundled `dist/404.html` SPA routing bridge.

> [!NOTE]
> GitHub Pages is a static host and cannot run serverless functions. When using GitHub Pages, the AI guide automatically uses the built-in deterministic offline RAG generator or can be pointed to an external proxy via `VITE_API_URL`.

---

## 5. Redeploying & Rollback Procedures

### How to Redeploy:
- **Automatic Deploys**: Any push to the `main` branch triggers an automated build and deploy on both Vercel and GitHub Actions.
- **Manual Redeploy in Vercel**:
  1. Go to the Vercel Project Dashboard.
  2. Navigate to the **Deployments** tab.
  3. Click the three dots `...` on the latest deployment and select **Redeploy**.

### How to Roll Back:
- **Instant Rollback in Vercel (Zero Downtime)**:
  1. In the Vercel Dashboard, go to **Deployments**.
  2. Locate the previous stable deployment.
  3. Click `...` > **Promote to Production**. Vercel immediately switches global edge traffic back to that build within 2 seconds.
- **Git Rollback**:
  ```bash
  git revert HEAD
  git push origin main
  ```

---

## 6. Post-Deployment Verification Checklist

Once deployed to your live domain:
- [ ] **Home Page**: Verify the Incredible India entrance loads smoothly with local time theme.
- [ ] **Explore Page**: Verify 507 destination cards load with authentic INR pricing (`₹`) and weather badges.
- [ ] **Map Page**: Verify Leaflet map pins cluster properly inside India boundary.
- [ ] **Trip Planner**: Test budget slider and day itinerary switching.
- [ ] **AI Guide**: Verify typewriter streaming responses cite destinations (`[1]`).
- [ ] **Auth Flow**: Test Sign Up, Sign In, and "Continue as Guest" modes.
- [ ] **Admin Console (`/admin`)**: Verify non-admin users are blocked by `AdminAuthGuard`.
- [ ] **Deep Link Refresh**: Refresh `/explore/charminar-hyderabad` directly in the browser address bar and confirm no 404.
- [ ] **PWA Audit**: Inspect Network tab to ensure `manifest.webmanifest` returns HTTP 200 with `application/manifest+json`.
