<div align="justify">

# JobScan

## Executive Summary

JobScan is an intelligent, comprehensive job verification platform engineered to protect job seekers from fraudulent employment opportunities. Leveraging cutting-edge artificial intelligence, the platform analyzes job descriptions and recruitment materials to generate actionable trust scores, risk assessments, and detailed scam pattern recognition. JobScan operates across multiple surfaces—a web application, an installable Progressive Web App (PWA), and a browser extension—to provide real-time protection directly where users discover opportunities.

The project was built as an MCA final-year project to address the growing epidemic of sophisticated recruitment scams. As job boards have become flooded with deceptive postings—ranging from identity theft schemes to fake remote work opportunities—job seekers struggle to distinguish legitimate employers from bad actors. JobScan solves this by automating the due diligence process and bringing enterprise-grade threat intelligence to everyday users.

Target users include active job seekers, recent graduates, remote workers, and anyone using popular employment platforms like LinkedIn or Indeed. By combining AI analysis, OCR processing, and a community reporting system, JobScan aims to create a safer digital employment ecosystem.

## Project Goals

*   **Primary objectives:** Provide an accurate, accessible, and instantaneous method for identifying fraudulent job postings across various formats (text and images). Provide clear explanations of why a posting is risky.
*   **Business goals:** Establish a centralized hub for recruitment scam intelligence, track emerging fraud patterns, and provide a seamless, multi-platform user experience.
*   **User benefits:** Protect personal information, prevent financial loss, save time spent on fake opportunities, and build confidence during the job search process.

## Key Features

### AI Job Scam Detection
*   **Purpose:** The core engine that evaluates job descriptions for scam indicators.
*   **User workflow:** A user pastes a job description into the web app or uses the extension to scan a page. The system analyzes the text and returns an assessment.
*   **Technical implementation:** Uses Google Gemini AI via `src/backend/ai/gemini-provider.ts` to analyze text against a predefined system prompt (`prompts.ts`). It identifies red flags, positive signals, and outputs a structured JSON response. A local, Regex-based fallback analysis is included for quota limits or API failures.

### Gemini Analysis
*   **Purpose:** Provides deep, contextual understanding of job listings.
*   **User workflow:** Transparent to the user; it powers the scam detection and chat features.
*   **Technical implementation:** Implemented using `@google/generative-ai` SDK. Primary model is `gemini-3.1-flash-lite`, falling back to `gemini-2.5-flash`. Includes timeouts, caching (`MemoryCache`), and fallback mechanisms.

### Trust Score Generation
*   **Purpose:** Distills complex AI analysis into an easy-to-understand metric (0-100).
*   **User workflow:** Users see a primary score and a detailed breakdown on the dashboard.
*   **Technical implementation:** The AI generates category-specific scores (employer, contact, salary, urgency). The backend normalizes these and calculates an overall `TrustScore` and `RiskLevel` (LOW, MEDIUM, HIGH, CRITICAL).

### OCR/Poster Analysis
*   **Purpose:** Allows scanning of image-based job advertisements (posters, screenshots).
*   **User workflow:** Users upload an image file containing a job advert.
*   **Technical implementation:** Multimodal Gemini processing extracts text from the image and analyzes the content simultaneously, returning the same structured assessment as text-based scans.

### Scan History
*   **Purpose:** Allows users to review previously analyzed jobs.
*   **User workflow:** Users navigate to the history tab in their dashboard to see past scans.
*   **Technical implementation:** Handled by the `Scans` module (`src/backend/modules/scans`). Data is persisted in the PostgreSQL `job_scans` table and retrieved via the `/api/history` route.

### User Dashboard
*   **Purpose:** The central hub for users to view stats, history, and manage their profile.
*   **User workflow:** Users log in and are redirected to the dashboard interface.
*   **Technical implementation:** Built with React/Next.js components (`src/frontend/components/dashboard`). Uses Radix UI for interactive elements and Tailwind CSS for styling.

### Authentication
*   **Purpose:** Secures user accounts and scan histories.
*   **User workflow:** Users register/login using an email and password.
*   **Technical implementation:** Implemented with NextAuth v5 (`src/backend/auth/index.ts`). Uses `bcryptjs` for secure password hashing. Token-based session management protects backend API routes.

### Reporting System
*   **Purpose:** Allows users to manually report known scams to improve the system.
*   **User workflow:** Users click "Report Scam" on a scanned job and provide a reason.
*   **Technical implementation:** Handled by the `Reports` module (`src/backend/modules/reports`) and stored in the `scam_reports` database table. Exposed via `/api/reports`.

### Browser Extension
*   **Purpose:** Brings JobScan's capabilities directly to job boards.
*   **User workflow:** The user opens a job on LinkedIn/Indeed, clicks the extension, and gets an instant rating.
*   **Technical implementation:** A Chrome extension built using `wxt` (Manifest V3). It injects content scripts (`src/extension/content.ts`) into supported sites, extracts DOM text, and communicates with the Next.js API.

### Progressive Web App
*   **Purpose:** Provides a native app experience on mobile and desktop.
*   **User workflow:** Users are prompted to "Install App" from their browser.
*   **Technical implementation:** Built using `@serwist/next`. Features a Service Worker (`src/app/sw.ts`) that precaches static assets and provides offline fallback (`/~offline`).

### Chat Assistant
*   **Purpose:** Allows users to ask specific questions about a scanned job.
*   **User workflow:** Users open the chat interface on a scanned job page and ask questions like "Is the salary realistic?"
*   **Technical implementation:** Uses Gemini's `startChat` API via `/api/chat`, maintaining conversation history and injecting the current job's context. Stored in `chat_messages` table.

## Technology Stack

### Frontend
*   **Next.js 15 (App Router):** Chosen for Server-Side Rendering (SSR), SEO benefits, and unified full-stack routing.
*   **React 19:** For building interactive user interfaces.
*   **Tailwind CSS:** For rapid, utility-first styling and maintaining a consistent design system.
*   **Radix UI:** For accessible, unstyled UI primitives (dialogs, tabs, progress bars).
*   **Lucide React:** For clean, scalable iconography.

### Backend
*   **Next.js API Routes:** Provides a serverless backend tightly coupled with the frontend for simplified deployment.
*   **Node.js:** Runtime environment.
*   **Zod:** Used for strict schema validation of AI responses and API inputs.

### Database
*   **PostgreSQL:** A robust, relational database used to ensure data integrity and complex querying for histories and reports. Accessed via the `pg` driver using raw SQL queries for maximum performance and explicit control.

### Authentication
*   **NextAuth v5 (Auth.js):** The standard authentication solution for Next.js. Configured with the Credentials provider to handle local username/password flows securely.

### AI Layer
*   **Google Gemini API (`@google/generative-ai`):** Used for advanced natural language understanding and image processing. Chosen for its multimodal capabilities and speed.

### Browser Extension
*   **WXT (`wxt.dev`):** A next-generation framework for building cross-browser extensions. Simplifies Manifest V3 compliance and build processes.

### PWA
*   **Serwist (`@serwist/next`):** A modern fork of Workbox, used to easily integrate Service Workers and caching strategies into Next.js.

## Architecture Decisions

*   **Next.js App Router:** Chosen for server-side rendering (SSR), optimized SEO, built-in API routes, and seamless React integration. It simplifies full-stack development by co-locating backend logic and frontend UI.
*   **PostgreSQL:** Selected for its robust relational data model, ensuring data integrity for user accounts, scan histories, and reports. It supports complex querying needed for the dashboard.
*   **Raw SQL instead of ORM:** Chosen for explicit control over database queries, maximum performance, and to avoid ORM overhead or "magic" behavior. It enforces a deep understanding of the database schema.
*   **Google Gemini AI:** Selected for its multimodal capabilities (processing both text and images) and high speed. It provides the advanced natural language understanding required to detect subtle scam patterns.
*   **NextAuth v5:** Provides a secure, standardized, and easily configurable authentication system out-of-the-box for Next.js, handling sessions securely without manual cookie management.
*   **Serwist:** Chosen over older PWA plugins because of its modern architecture and active maintenance, seamlessly integrating Service Workers into the Next.js App Router build process.
*   **WXT:** Selected as a next-generation framework for building browser extensions. It simplifies Manifest V3 compliance, provides HMR during development, and streamlines the build process for multiple browsers.
*   **Tailwind CSS:** Chosen for rapid, utility-first styling, enabling responsive and consistent design without context-switching between CSS files and React components.
*   **Radix UI:** Selected to provide accessible, unstyled UI primitives. It handles complex accessibility (WAI-ARIA) requirements for interactive components like dialogs and dropdowns while allowing custom styling via Tailwind.

## High-Level Architecture

The architecture follows a modular, monolithic approach utilizing Next.js as the core orchestrator.

### Job Analysis Flow

```text
User
↓
Analyzer UI
↓
API Route
↓
Validation
↓
Scan Service
↓
Gemini Provider
↓
Database
↓
Response
```

### Chat Assistant Flow

```text
User
↓
Chat UI
↓
API Route
↓
Gemini Chat
↓
Database
↓
Response
```

### Browser Extension Flow

```text
LinkedIn / Indeed
↓
Content Script
↓
Extension UI
↓
JobScan API
↓
Gemini Analysis
↓
Result
```

### Authentication Flow

```text
Login Page
↓
NextAuth
↓
Credentials Validation
↓
Database
↓
Session Creation
↓
Dashboard
```

```text
User / Browser Extension
       │
       ▼ (HTTP/REST)
Next.js API Layer (src/app/api)
       │
       ▼
Business Logic Layer (src/backend/modules)
       │
   ┌───┴───────────┐
   ▼               ▼
PostgreSQL      Gemini AI
(Database)      (Analysis Engine)
```

1.  **Client Layer:** The Web UI or Browser Extension sends a request containing job text or an image.
2.  **API Layer:** Next.js Route Handlers (`src/app/api/*`) receive requests, validate session tokens via NextAuth, and route to specific modules.
3.  **Business Logic Layer:** Modules (`src/backend/modules/*`) handle data orchestration, validation, and enforce business rules (e.g., verifying user ownership before returning scan history).
4.  **AI Engine:** The `gemini-provider.ts` handles communication with Google's APIs, including prompt construction, parsing, and local fallback logic.
5.  **Database Layer:** Raw SQL queries execute against the PostgreSQL database to persist scans, users, and reports.

## Folder Responsibilities

| Folder | Responsibility |
| :--- | :--- |
| `src/app` | Routing |
| `src/backend` | Business Logic |
| `src/frontend` | UI Layer |
| `src/database` | Database Layer |
| `extension` | Browser Extension |
| `scripts` | Utility Scripts |

## Folder Structure

```text
src/
├── app/               # Next.js App Router structure
│   ├── api/           # Backend REST API routes
│   ├── auth/          # Frontend authentication pages
│   ├── dashboard/     # Frontend user dashboard pages
│   ├── ~offline/      # PWA offline fallback page
│   └── sw.ts          # Service Worker configuration
├── backend/           # Core Backend Architecture
│   ├── ai/            # Gemini AI integration and prompts
│   ├── auth/          # NextAuth configuration
│   ├── cache/         # In-memory caching utilities
│   ├── db/            # PostgreSQL connection pool
│   ├── logging/       # Custom application loggers
│   └── modules/       # Business logic (scans, reports, users)
├── database/          # Database definitions
│   └── schema.sql     # PostgreSQL table definitions
├── extension/         # Browser Extension source code
│   ├── content/       # Content scripts injected into web pages
│   ├── entrypoints/   # Extension entry points (background, sidepanel)
│   └── wxt.config.ts  # WXT build configuration
├── frontend/          # Reusable Frontend Architecture
│   ├── components/    # Reusable React components (UI, layout)
│   ├── context/       # React Context providers (Auth, Job, PWA)
│   └── hooks/         # Custom React hooks
└── lib/               # Shared utilities
```

## Frontend Architecture

The frontend uses Next.js App Router (`src/app`) for page routing and `src/frontend` for reusable architecture.

*   **App Router Structure:** Pages are defined in `page.jsx` files within routing folders. Layouts (`layout.jsx`) wrap pages to provide persistent UI elements (navbars, sidebars).
*   **Context Providers:** Located in `src/frontend/context/`.
    *   `auth-context.jsx`: Manages user session state, login, logout, and profile updates. Wraps NextAuth's `useSession`.
    *   `job-context.jsx`: Manages the state of the currently analyzed job across the dashboard.
    *   `pwa-context.jsx`: Handles PWA installation prompts and service worker lifecycle events.
*   **Components:** Modular UI elements built with Radix UI primitives and Tailwind CSS. Grouped logically (e.g., `dashboard`, `landing`, `ui`).

## Backend Architecture

### API Layer

| Endpoint | Method | Auth Required | Purpose |
| :--- | :--- | :--- | :--- |
| `/api/analyze` | POST | Yes | Analyze job posting |
| `/api/chat` | POST | Yes | AI chat assistant |
| `/api/history` | GET | Yes | Retrieve scan history |
| `/api/profile` | POST | Yes | Update profile info |
| `/api/reports` | POST | Yes | Submit a scam report |
| `/api/stats` | GET | Yes | Retrieve user stats |
| `/api/auth/register` | POST | No | Register a user |
| `/api/password` | POST | Yes | Update user password |

### Business Modules

Located in `src/backend/modules/`. This isolates database operations from HTTP routing.

*   **Auth Module:** Manages user creation (`user-service.ts`) and database queries (`user-queries.ts`).
*   **Scans Module:** Handles storing and retrieving scan results (`job_scans` table).
*   **Reports Module:** Manages the submission of user scam reports (`scam_reports` table).
*   **Chat Module:** Manages the storage of user-AI conversations (`chat_messages` table).

## Database Design

Defined in `src/database/schema.sql`.

*   **`users`**: Stores user accounts.
    *   `id` (UUID), `email`, `name`, `password_hash`, `retention_days`.
*   **`job_scans`**: Stores the results of AI analyses.
    *   `id` (UUID), `user_id` (FK), `content` (Original text), `content_hash` (For deduplication), `trust_score`, `risk_level`, `pattern_name`, `red_flags` (JSONB), `positive_signals` (JSONB), `analysis` (JSONB).
*   **`scam_reports`**: Stores user-submitted scam flags.
    *   `id` (UUID), `scan_id` (FK), `reported_by` (FK), `reason`.
*   **`chat_messages`**: Stores conversation history.
    *   `id` (UUID), `user_id` (FK), `role`, `content`.

```text
users
│
├── job_scans
│      │
│      └── scam_reports
│
└── chat_messages
```

*   **Relationships:** A user can have many job scans, scam reports, and chat messages. A job scan can have many scam reports.
*   **Foreign keys:** `user_id` in `job_scans` and `chat_messages`. `scan_id` and `reported_by` in `scam_reports`.
*   **Cascade behavior:** All foreign keys use `ON DELETE CASCADE`, meaning if a user is deleted, all their associated data is securely wiped.

**Data Flow:** When a user scans a job, a record is created in `job_scans`. If they report it, a linked record is created in `scam_reports`. All user data is tied to the `users` table via `user_id` foreign keys with `ON DELETE CASCADE`.

## Authentication & Security

*   **Login Flow:** NextAuth handles the session lifecycle. The Credentials provider checks the email against the DB and verifies the password using `bcryptjs.compare`.
*   **Session Handling:** JWT-based session management provided by NextAuth.
*   **Password Hashing:** Handled securely by `bcryptjs` with a salt round of 12 (`src/backend/modules/auth/auth-service.ts`).
*   **Authorization:** API routes use NextAuth's `auth()` helper to verify the user is logged in before allowing access to sensitive endpoints (e.g., history, analyze).
*   **Security Logging:** Custom logger (`src/backend/logging/logger.ts`) tracks security events (e.g., failed logins, duplicate registration attempts).

## Security Considerations

*   **Password hashing:** Passwords are never stored in plain text. They are hashed using `bcryptjs` with a secure salt round of 12 before being stored in the database.
*   **Session security:** NextAuth manages secure, HTTP-only, encrypted JWT sessions, protecting against XSS attacks stealing session tokens.
*   **API protection:** All sensitive API routes use the `auth()` helper to strictly enforce authentication checks before processing requests or accessing the database.
*   **Input validation:** `Zod` schemas are used to strictly validate and sanitize the structure of AI responses and API inputs to prevent malformed data from causing issues.
*   **SQL injection protection:** The `pg` library is used with parameterized queries (e.g., `WHERE email = $1`), effectively neutralizing SQL injection vulnerabilities.
*   **Authentication checks:** Business modules verify that requested data (like scan history) belongs to the authenticated `user_id`, preventing lateral data access (IDOR).
*   **Sensitive environment variables:** Secrets like `NEXTAUTH_SECRET` and `GEMINI_API_KEY` are isolated in `.env.local` and are never exposed to the client-side bundle.

## AI Analysis Engine

Located entirely within `src/backend/ai/gemini-provider.ts`.

*   **Prompt Structure:** Defined in `prompts.ts`, it instructs the AI to adopt the persona of an expert fraud investigator and mandates a strict JSON response format.
*   **Pipeline:**
    1.  Receives input (text or image base64).
    2.  Checks `MemoryCache` to prevent redundant API calls.
    3.  Attempts processing with `gemini-3.1-flash-lite`.
    4.  If a quota limit is hit, automatically falls back to `gemini-2.5-flash`.
    5.  If API fails completely, utilizes `localFallbackAnalysis` (a Regex-based heuristic engine).
    6.  Parses the response through a Zod schema (`ResponseSchema`) to ensure structural integrity and bounds checking (e.g., clamping scores between 0-100).
    7.  Calculates final Trust Score and Risk Level.

## Browser Extension

*   **Architecture:** Built with `wxt` (Manifest V3). Consists of a background script (`src/extension/entrypoints/background.ts`) and content scripts (`src/extension/content/`).
*   **Communication Flow:** The content script injects a floating UI or button into supported sites (LinkedIn, Indeed). When clicked, it extracts the job description from the DOM and sends it to the JobScan backend API (`http://localhost:3000` or production URL).
*   **Build Commands:**
    *   `npm run ext:dev`: Runs the extension in development mode with HMR.
    *   `npm run ext:build`: Compiles the extension to the `dist-ext/` directory for deployment.

## Browser Extension Development

*   **Extension architecture:** Built using a Background Script (for service worker tasks) and Content Scripts (injected into job boards to extract DOM text and render the overlay).
*   **Manifest V3:** The extension strictly adheres to Manifest V3 guidelines, ensuring modern security, privacy, and performance standards.
*   **WXT usage:** WXT is used as the build framework, abstracting away complex manifest management and providing a Vite-powered development experience.

### Development Commands
```bash
npm run ext:dev
npm run ext:build
```

### How to load unpacked extension
1. Open Chrome and navigate to `chrome://extensions`.
2. Enable "Developer mode" in the top right.
3. Click "Load unpacked" and select the generated `dist-ext/` folder.

### Supported websites
*   LinkedIn
*   Indeed
*   Naukri
*   Foundit
*   Internshala

### Extension communication flow
1. Content script detects a job posting on a supported site.
2. User triggers analysis via the extension UI.
3. Content script extracts the text and sends an HTTP POST request to the JobScan API.
4. The Next.js API processes the request via Gemini and returns the JSON result.
5. Content script renders the result directly on the job board page.

## Progressive Web App

*   **Offline Support:** Utilizes a Service Worker (`src/app/sw.ts`) configured by Serwist. It caches static assets and provides a custom offline page (`/~offline/page.jsx`) when no network is available.
*   **Manifest:** Next.js generates the PWA manifest dynamically or via static configuration to define app icons, colors, and display modes.
*   **Installation:** Managed by `src/frontend/context/pwa-context.jsx`, which intercepts the `beforeinstallprompt` event to show a custom installation button to the user.

## Progressive Web App (PWA)

*   **Serwist integration:** Uses `@serwist/next` to auto-generate the Service Worker during the build process.
*   **Service Worker behavior:** The SW intercepts network requests. API routes are configured as `NetworkOnly`, while static assets use caching.
*   **Offline fallback:** If the network is unavailable, the SW serves a custom offline page (`/~offline`).
*   **Install prompt:** A custom context intercepts the browser's `beforeinstallprompt` event to show an install button.
*   **Update flow:** The Service Worker takes effect immediately upon reload.

### PWA lifecycle
1. Registration
2. Installation
3. Activation

### Caching strategy
*   API Routes: `NetworkOnly`
*   Static Assets: Cached via Serwist defaults

### Offline behavior
Graceful degradation. The user can view the offline page, and native installation continues to function.

## Configuration

| Variable | Required | Description |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Yes | Google Gemini API Key |
| `NEXTAUTH_SECRET` | Yes | Session encryption secret |
| `DB_HOST` | Yes | PostgreSQL host |
| `DB_USER` | Yes | PostgreSQL connection user |
| `DB_NAME` | Yes | PostgreSQL database name |
| `DB_PASSWORD` | Yes | PostgreSQL connection password |
| `DB_PORT` | Yes | PostgreSQL connection port |
| `NEXTAUTH_URL` | Yes | Canonical URL of the site |
| `AUTH_SECRET` | Yes | Fallback session encryption secret |
| `PORT` | No | Port for the Next.js server (e.g., 3000) |
| `NODE_ENV` | No | Environment mode (e.g., development) |
| `CONSOLE_LOG_LEVEL`| No | Controls logging verbosity |

## Installation Guide

### Prerequisites
*   Node.js (v18+)
*   PostgreSQL (v14+)
*   Google Gemini API Key

### Database Setup
1.  Open your PostgreSQL CLI or GUI.
2.  Create a database: `CREATE DATABASE jobscan;`
3.  Run the schema file: `psql -d jobscan -f src/database/schema.sql`

### Environment Setup
Create a `.env.local` file in the root directory using the Configuration section above as a template.

### Dependency Installation
```bash
npm install
```

### Running Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

### Building Production Version
```bash
npm run build
```

### Running Production Version
```bash
npm start
```

### Building Browser Extension
```bash
npm run ext:build
```
Load the generated `dist-ext/` folder as an unpacked extension in Chrome.

## Deployment Guide

### Recommended Deployment Stack

*   **Frontend:** Vercel
*   **Database:** PostgreSQL (Neon / Supabase / Railway)
*   **AI:** Gemini API
*   **Authentication:** NextAuth

### Environment Variables
Production variables required:
*   `DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT`
*   `NEXTAUTH_URL`
*   `NEXTAUTH_SECRET` / `AUTH_SECRET`
*   `GEMINI_API_KEY`
*   `NODE_ENV=production`

### Build Commands
```bash
npm run build
```

### Start Commands
```bash
npm start
```

### Post Deployment Verification
Checklist:
*   [ ] Login works
*   [ ] Gemini analysis works
*   [ ] Database connection works
*   [ ] PWA installs
*   [ ] Extension API works

## Development Workflow

*   **Scripts:**
    *   `npm run dev`: Next.js dev server.
    *   `npm run build`: Production build.
    *   `npm run lint`: Runs ESLint for code quality.
    *   `npm run ext:dev`: WXT dev server for the extension.
*   **Linting:** Configured via `eslint.config.mjs` using Next.js core web vitals settings.
*   **Deployment:** The project is designed for Vercel (Next.js frontend/API) and requires a hosted PostgreSQL database (e.g., Supabase, Neon) for production.

## API Request Lifecycle

**Example: User submits a job description**

1.  **User Interface:** User clicks "Analyze" on the frontend.
2.  **API Route:** Request hits `src/app/api/analyze/route.js`.
3.  **Validation:** NextAuth `auth()` ensures the user is logged in. Input is checked for length/validity.
4.  **Service / AI:** `geminiService.analyzeJobMultimodal` is invoked. It checks the cache. If missed, it sends the prompt to the Gemini API.
5.  **Database:** The resulting trust score and parsed JSON are passed to `scanService.createScan` (in `src/backend/modules/scans/scan-service.js`), which executes an `INSERT` statement into the PostgreSQL `job_scans` table.
6.  **Response:** The API returns a 200 status with the structured JSON analysis, which the frontend renders.

## Important Files

*   **`package.json`**: Defines all dependencies (Next.js, Radix UI, Serwist, WXT) and project scripts.
*   **`src/database/schema.sql`**: The single source of truth for the database structure.
*   **`src/backend/ai/gemini-provider.ts`**: The core logic engine connecting the application to AI, containing crucial fallback and parsing logic.
*   **`src/backend/auth/index.ts`**: NextAuth configuration, securing the entire application.
*   **`src/app/sw.ts`**: Service worker configuration defining PWA caching behavior.
*   **`src/extension/wxt.config.ts`**: Configures the browser extension build, permissions, and host targeting.

## Known Risks & Limitations

*   **AI Hallucinations:** While structured, Gemini may occasionally misinterpret nuance in job descriptions.
*   **Quota Limits:** High traffic could exhaust the Gemini API free tier, though mitigated by the caching and fallback mechanisms.
*   **Extension Breakages:** Changes to the DOM structure of LinkedIn or Indeed could break the extension's content extraction scripts.
*   **Technical Debt:** Raw SQL queries without an ORM (like Prisma or Drizzle) require careful maintenance and migrations.

## Troubleshooting

*   **Database connection fails:** Ensure PostgreSQL is running and `DB_*` variables in `.env.local` are correct. Check if the `jobscan` database was created.
*   **AI returns "Fallback used":** Your `GEMINI_API_KEY` is invalid, missing, or you have hit rate limits.
*   **Extension doesn't load:** Ensure you have enabled "Developer Mode" in Chrome and loaded the correct `dist-ext` output directory.
*   **Login fails:** Ensure `NEXTAUTH_URL` matches your exact local URL and `NEXTAUTH_SECRET` is set.

## Developer Onboarding Guide

*   **Where to start:** Read `src/database/schema.sql` to understand the data model. Next, look at `src/backend/ai/gemini-provider.ts` to understand the core feature. Finally, browse `src/app/api/analyze/route.js` to see how the pieces connect.
*   **Recommended learning order:** React/Next.js App Router -> NextAuth -> PostgreSQL/`pg` -> Chrome Extension APIs (via WXT).
*   **Important architecture decisions:** Using raw SQL instead of an ORM for explicit control. Implementing a multimodal AI provider to handle both text and images seamlessly.
*   **Common mistakes:** Modifying database tables without updating the corresponding `SELECT`/`INSERT` queries in `src/backend/modules/`. Forgetting to add `"use client"` directives to interactive React components.

## AI Assistant Development Rules

Before modifying:
*   Authentication
*   Database Schema
*   Gemini Provider
*   Service Worker
*   Browser Extension

review dependencies carefully.

Do NOT:
*   Change API contracts
*   Change Trust Score structure
*   Change Risk Level values
*   Modify database schema without migrations

Preserve:
*   JSON response formats
*   Authentication flow
*   Extension communication protocol
*   PWA routing

**Project-Specific Constraints:**
*   **Coding conventions:** Use standard Next.js conventions. Server components by default, `"use client"` where interactivity is needed. Use Tailwind for all styling.
*   **Folder responsibilities:** Never place business logic directly in `src/app/api/` routes; always extract to `src/backend/modules/`. Keep AI specific logic isolated in `src/backend/ai/`.
*   **Architectural rules:** Database operations must use parameterized queries (`$1, $2`) to prevent SQL injection.
*   **Important dependencies:** `@google/generative-ai`, `next-auth`, `pg`, `serwist`, `wxt`, `radix-ui`.
*   **Careful modifications:** Editing `gemini-provider.ts` or `prompts.ts` can drastically alter the accuracy of the platform. Always test changes against both obvious scams and legitimate job postings.
*   **Typical patterns:** Utilizing Radix UI primitives wrapped in Tailwind classes for accessible, consistent frontend components. Using NextAuth `auth()` for protecting server-side routes and API endpoints.

</div>
