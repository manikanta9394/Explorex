# Explorex – Hyderabad & Telangana Travel Companion

> **Explore Hyderabad the way locals do.** Explorex is a multimodal heritage explorer, trip planner, and AI travel companion for Hyderabad and Telangana. Crafted with authentic Nizam-era aesthetics, responsive split-screen authentication, offline-first fallback resilience, and live spatial maps.

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

## 🧪 Automated Testing & Verification

Explorex includes comprehensive Puppeteer end-to-end verification suites in `scripts/`:

```bash
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
