# Explorex – All-India Travel & Heritage Companion

> **Explore India the way locals do.** Explorex is a multimodal nationwide heritage explorer, trip planner, and AI travel companion covering all 36 States and Union Territories of India. Crafted with authentic cultural aesthetics, trustworthy open-source data (Wikidata, Wikipedia, ASI), zero image duplication guarantees, responsive split-screen authentication, and live spatial clustering maps.

---

## 🇮🇳 Nationwide Expansion & Image Integrity

Explorex expands from Hyderabad to **ALL of India** with strict data authenticity and visual integrity standards:

1. **Trustworthy Nationwide Dataset (`scripts/seed/`)**:
   - Curated dataset covering all 36 Indian States & Union Territories.
   - Grounded in Wikidata entity IDs (`wikidata_id`) as the single source of truth for names, coordinates, and authentic Wikipedia imagery.
   - **No fabricated facts**: Null ratings/hours display transparently as *"Not listed, verify locally"* or *"No reviews yet"*. Entry fees reflect official Archaeological Survey of India (ASI) or state tourism rates in Indian Rupees (₹) with Indian number grouping (`₹1,50,000`).
2. **Absolute Image Integrity & SHA-256 Uniqueness**:
   - Every place's imagery is fetched strictly from the Wikimedia Commons file attached to that exact place's `wikidata_id` (property P18).
   - Rejects duplicate URLs and identical SHA-256 file hashes across different places.
   - Verified metadata includes author attribution, Creative Commons license (e.g. CC BY-SA 4.0), and source link.
   - Where no verified photograph exists, deterministic vector fallback illustrations (`source: 'ai_generated'`) are generated with unique seed parameters and an *"🎨 Illustration"* badge.
3. **Automated CI Image Audit (`npm run check:images`)**:
   - Verifies 100% unique image hashes across all published places.
   - Confirms that iconic landmarks (Charminar, Taj Mahal, Gateway of India, Golden Temple, Hawa Mahal, Konark Sun Temple) strictly display their own verified photos.
4. **Interactive Spatial Map & Nationwide Clustering**:
   - Centers on India (`[22.5, 79.5]`, zoom 5) by default.
   - Leaflet marker clustering groups places at national scale and smoothly disperses down to state and city levels.
   - Strict national boundary validation (lat 6.0°–37.5° N, lng 68.0°–97.5° E) flags and hides any out-of-bounds coordinates.
5. **State Landing Pages & Region Switcher**:
   - Dedicated state portals (`/states/:slug`, e.g. `/states/tamil-nadu`, `/states/rajasthan`) featuring regional taglines, signature highlights, best time to visit, and filtered destinations.
   - Navbar and mobile drawer Region Switcher for one-click jumping between All India and individual states.

---

## 🏛️ Key Features

- **Curated Heritage Directory (`/explore`, `/explore/:id`)**:
  - 400 verified attractions, Nizami royal monuments, heritage stays, and authentic dining spots.
  - Live weather badge (temperature in °C and conditions via cached Open-Meteo API).
  - Recommended "Best Time to Visit" seasonal guidance.
  - Hourly crowd level mini bar chart with real-time "Now" indicator.
  - Turn-by-turn navigation via Google Maps with walking, cycling, and driving modes.
  - Wishlist heart saving (works seamlessly for guests and syncs to account upon sign-in).

- **Clustered Spatial Explorer (`/map`)**:
  - Clustered interactive Leaflet map using custom color-coded category pins.
  - Strict geographic validation restricting and logging any pins outside Telangana/Hyderabad boundaries.
  - "My Location" GPS geolocation with custom pulsing marker.
  - Spatial place preview popup with distance, transit time, and direction actions.

- **Multimodal Trip Planner (`/planner`)**:
  - 1- to 4-day customizable itineraries clustered by proximity (nearest-neighbour algorithm).
  - Geographic anchor seeding (Old City, Golconda, Hussain Sagar, HITEC City).
  - Midpoint lunch recommendations near each day's cluster.
  - Interactive budget slider with dynamic warning when exceeding budget.
  - "Trim stops to fit budget" automatic budget optimization toggle.
  - Direct export to Google Maps route (origin, intermediate waypoints, destination).
  - "Refine with AI" one-click transfer to AI guide.
  - **Shareable Trip Link**: Encodes parameters in URL for instant sharing and loading.
  - **Group Expense Splitter**: Equal & custom split calculation, debt settlement algorithm ("Who owes whom"), and WhatsApp-ready settlement clipboard copy.

- **Explorex AI Assistant (`/ai`)**:
  - Dataset-grounded AI travel companion powered by a secure backend proxy (OpenRouter / local fallback).
  - Zero client-side API key leakage.
  - Structured responses with bullet points, tips, ₹ prices, and km distances.
  - Suggested question chips, markdown rendering, typing indicator, and clickable destination cards.
  - Voice speech input (Web Speech API).

- **Telangana Festival Calendar (`/festivals`)**:
  - Interactive seasonal guide to 5 iconic celebrations: Bonalu, Ramzan Nights, Sankranti Kite Festival, Bathukamma, and Numaish.
  - Seasonal filter tabs, cultural background, visitor etiquette tips, and direct links to related landmark destinations.

- **Telangana Emergency & Tourist Directory**:
  - 24x7 verified helpline numbers (Police 100, Ambulance 108, Tourism 1800-425-46464, SHE Teams 181, Fire 101) with `tel:` links.
  - Nearest multispecialty trauma care hospitals with direct directions.
  - Live GPS coordinate beacon with one-click copy.

- **Multilingual Support (English, తెలుగు, हिन्दी)**:
  - Instant UI language toggle persisting selection in `localStorage`.
  - Native scripts: English, Telugu (`తెలుగు`), and Hindi (`हिन्दी`).

---

## 🛠️ Architecture & Tech Stack

- **Frontend**:
  - React 19 + Vite 8
  - Leaflet + `leaflet.markercluster` (interactive mapping & pin clustering)
  - Lucide React (vector iconography)
  - Pure CSS design system with 8px spacing grid, golden ratio typography, and WCAG 2.1 AA focus rings.
- **Backend**:
  - Node.js + Express proxy server (`Explorex/server/`)
  - OpenRouter API integration with automatic free-tier fallbacks
  - OpenRouteService (ORS) routing, distance matrices, and geocoding
  - In-memory & LocalStorage multi-tier caching layer to prevent API tier exhaustion
  - JWT Authentication + Bcrypt password hashing + Google OAuth support

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v20.18.0+ or v22+
- **npm**: v10+

### 2. Installation
Clone the repository and install dependencies for both the frontend and backend:

```bash
cd Explorex
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env` in the `Explorex` folder:

```bash
cp .env.example .env
```

Edit `.env` with your preferred credentials:

```env
# Supabase Configuration (PostgreSQL Database, Auth & RLS)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key_here
# Server-only keys (NEVER expose in frontend code)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_secret_key_here

PORT=5005
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_in_production
MONGODB_URI=mongodb://127.0.0.1:27017/tourmate
CORS_ORIGIN=http://localhost:5173,http://localhost:5180,http://localhost:3000
VITE_API_URL=http://localhost:5005/api
GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=google/gemma-3-27b-it:free
ORS_API_KEY=your_openrouteservice_api_key_here
```

### 4. Supabase Database & Migrations Setup

1. Create a project on [Supabase](https://supabase.com).
2. Run the SQL migrations located in `/supabase/migrations/`:
   - `20261024000001_initial_schema.sql`: Sets up `profiles`, `places`, `place_images`, `saved_places`, `trips`, `conversations`, `messages`, `feedback`, `audit_logs`, `place_embeddings` with `vector(1536)` HNSW indexes, the `is_admin()` function, the `handle_new_user()` trigger, and strict Row-Level Security (RLS) on all tables.
   - `20261024000002_seed_places.sql`: Seeds canonical Hyderabad & Telangana landmarks, royal stays, and authentic culinary dining stops.
3. In your Supabase Dashboard under **Authentication -> Providers**, enable **Anonymous Sign-ins** (Authentication -> Settings -> Allow anonymous sign-ins). This enables visitors to use "Continue as guest" while persisting their data in the database.
4. Copy your **Project URL** and **Anon Public Key** into `.env`.

> **Note**: Even if no external API keys are provided, Explorex includes robust offline fallbacks and an emulator for AI chat, distance calculations, weather, geocoding, and database persistence.

---

## 💻 Run Commands

### Start the Backend Proxy Server:
```bash
PORT=5005 node server/index.js
```
The server will start at `http://localhost:5005`.

### Start the Frontend Dev Server:
```bash
npm run dev
```
Open your browser at `http://localhost:5180/Explorex/`.

### Run Production Build:
```bash
npm run build
```

### Lint Codebase:
```bash
npx oxlint
```

---

## 🛡️ Admin Console & Governance System (`/admin`)

Explorex includes a completely separate administrative and operations dashboard isolated from the user-facing design system:

- **Aesthetic**: Dense, functional slate design (`slate-dark` / `slate-light`), compact data tables, status chips, system font stack, and subtle transitions (zero marketing animations or serifs).
- **Security & Authorization**:
  - `/admin/*` routes are protected on both the client (via `<AdminAuthGuard>`) and the server (via `adminMiddleware.js` enforcing `profiles.role = 'admin'`).
  - Separate dedicated `/admin/login` page with optional Two-Factor Authentication (TOTP).
  - Normal users and unauthenticated guests visiting `/admin` or calling `/api/admin/*` receive HTTP 401/403 and are redirected.
- **First Admin Setup (Strict SQL Command - Never via UI)**:
  Run the following SQL in the Supabase SQL Editor to grant admin access to the first authorized curator:
  ```sql
  -- Set first admin user in profiles table
  UPDATE public.profiles
  SET role = 'admin', totp_enabled = TRUE
  WHERE email = 'admin@explorex.in';

  -- Or promote by exact Auth user ID:
  UPDATE public.profiles
  SET role = 'admin', totp_enabled = TRUE
  WHERE id = 'a0000000-0000-0000-0000-000000000001';
  ```
- **9 Core Operations Modules**:
  1. **Dashboard**: KPIs (Active users, guest vs accounts, saves, AI queries, thumbs-up rate, unanswered rate, open feedback, error rate), 7/30-day activity trends, top destinations, and search query trends.
  2. **Places Management**: Server-side paginated data table, filters (state, category, published, missing image, stale data >6mo), create/edit destination modal with India geo-boundary coordinate validation (`lat 6.0–37.5`, `lng 68.0–98.0`), rules editor, INR entry fee fields with source URL, duplicate detection, and soft-deletion.
  3. **Image Review Queue**: Side-by-side candidate review with Wikipedia links, CC license, and attribution. **Blocks approval if candidate image SHA-256 hash is already used by another destination**.
  4. **Users & Access**: Role toggle (`user` <-> `admin`), disable/enable toggle, view saved counts, and automated ephemeral guest account cleanup job.
  5. **Feedback Inbox**: Master-detail view with SLA breach tracking (>3 days), screenshot lightbox, related place shortcut ("Edit this place"), and verified curator reply dispatcher that immediately synchronizes to the user's "My feedback" panel.
  6. **AI Quality & Golden Eval Set**: Inspect flagged / negative feedback turns with masked identifiers (`exp_***`), audit retrieved pgvector chunks and citations, curate golden evaluation benchmark set, and trigger vector chunks re-indexing.
  7. **Content Studio**: National festival calendar editor, help center FAQ editor, and dynamic Announcement Banner manager (active banner renders immediately at the top of the user app).
  8. **Immutable Audit Trail**: Chronological log of all administrative writes with side-by-side Before/After committed state diff inspector.
  9. **System Settings**: Production feature switches (Guest access, Reviews, AI guide, Emergency SOS), maintenance mode toggle with custom public notice, and external API quota consumption monitor.

---

## 🧪 Automated Testing & Verification

Explorex includes comprehensive Puppeteer end-to-end verification suites and CI audit tools:

```bash
# Verify Admin Console, 2FA, RLS protection, Image Integrity & Audit Logs (20/20 checks)
node scripts/verify_admin_system.js

```bash
# Verify 100% unique image integrity and landmark accuracy
npm run check:images

# RAG Evaluation Benchmark (62 test cases: fees, rules, proximity, multilingual, itineraries, refusal, tricks)
npm run eval:rag

# E2E RAG Production Chatbot Verification (Claude/ChatGPT layout, SSE streaming, Grounding Guard, Telugu/Hindi, Feedback modal)
node scripts/verify_rag_chatbot.js

# Comprehensive nationwide expansion test (Images, State filter, Search highlight, State pages, Map clustering)
node scripts/verify_india_expansion.js

# Verify Supabase Auth, Access Gate & RLS persistence
node scripts/verify_supabase_auth_gate.js

# Verify 7 new advanced features (Weather, Crowd Chart, Shared Link, Expense Splitter, Language Toggle, SOS Help, Festivals)
node scripts/verify_new_features.js

# Verify Trip Planner clustering, budget logic, transit times & map links
node scripts/verify_trip_planner.js

# Verify Split-Screen Authentication & Validation
node scripts/verify_split_screen_auth.js

# Verify Cinematic Scroll & Parallax Animations
node scripts/verify_cinematic_scroll.js

# Verify Full-Page AI Assistant & Dataset Grounding
node scripts/verify_explorex_ai_full_page.js
```

---

## 🔒 Security & Performance Guidelines

- **API Protection**: LLM and routing keys are strictly encapsulated inside the backend server (`server/`) and never exposed in client bundle code.
- **Quota Safeguard**: Distance, route geometry, geocoding, and weather queries are cached in `localStorage` and memory to prevent exhausting free API tiers.
- **Accessibility & Motion**: Compliant with `prefers-reduced-motion: reduce`, includes WCAG 2.1 AA focus rings (`:focus-visible`), and enforces strict aspect ratios on images to avoid layout shift (CLS).
