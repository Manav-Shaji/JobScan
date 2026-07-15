<div align="justify">

# JobScan - AI-Powered Job Scam Detection Platform

JobScan is an intelligent job verification platform that helps users identify fraudulent job opportunities using AI-powered analysis, OCR scanning, trust scoring, and scam pattern detection.

Built as an MCA final-year project, JobScan combines modern web technologies, artificial intelligence, browser integration, and Progressive Web App capabilities to provide a complete job safety ecosystem.

---

## Features

### AI Job Analysis
- Analyze job descriptions using Google Gemini AI
- Generate trust scores and risk levels
- Detect suspicious recruitment patterns
- Identify common scam indicators

### OCR & Poster Scanning
- Upload recruitment posters and advertisements
- Extract text using OCR processing
- Analyze extracted content for scam indicators
- Detect fake hiring campaigns

### Browser Extension
- Chrome Manifest V3 extension
- Analyze job listings directly from:
  - LinkedIn
  - Indeed
  - Naukri
  - Foundit
  - Internshala
- One-click trust analysis

### Progressive Web App (PWA)
- Installable on Desktop and Android
- Offline support
- Mobile-optimized experience
- Native app-like interface

### User Dashboard
- Scan history tracking
- Trust score monitoring
- Scam reporting system
- Profile management

### Security Features
- Secure authentication with NextAuth
- Password hashing with bcryptjs
- Rate-limited sensitive endpoints (In-memory cache; Redis recommended for multi-instance scaling)
- Structured security logging
- Data layer isolation (Repositories vs Services)

---

## Tech Stack

### Frontend
- Next.js 15
- React
- Tailwind CSS
- Radix UI
- Lucide Icons
- React Query (Data Fetching)
- Zustand (State Management)
- Framer Motion (Animations)
- View Transition API (Theme Toggling)

### Backend
- Next.js API Routes
- PostgreSQL
- Raw SQL Queries
- NextAuth v5
- Zod Validation

### AI & Analysis
- Google Gemini API
- OCR Processing
- Scam Pattern Detection Engine

### Additional Platforms
- Progressive Web App (PWA) via Serwist
- Chrome Extension (Manifest V3) via WXT

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Manav-Shaji/JobScan.git

cd JobScan
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create:

```env
.env.local
```

Example:

```env
PORT=3000

DB_USER=devuser
DB_HOST=localhost
DB_NAME=jobscan
DB_PASSWORD=<your_db_password>
DB_PORT=5435

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate_a_strong_secret_here>
AUTH_SECRET=<generate_a_strong_secret_here>

GEMINI_API_KEY=<your_api_key_here>

NODE_ENV=development
CONSOLE_LOG_LEVEL=warn
```

---

## Database Setup

Create PostgreSQL database:

```sql
CREATE DATABASE jobscan;
```

The application automatically initializes the schema during startup.

---

## Development

> **Note**: For deep technical onboarding, architecture details, and developer guidelines, please refer to [INFO.md](./INFO.md).

Start the Next.js development server:

```bash
npm run dev
```

Start the Browser Extension development server (HMR):

```bash
npm run ext:dev
```

Open:

```text
http://localhost:3000
```

---

## Future Enhancements

- Resume analysis
- Recruiter reputation database
- Community scam reporting
- Push notifications
- Multi-language support
- Advanced AI fraud detection

---

## Author

**Manav Shaji**

MCA Final Year Project

---

## License

This project is intended for academic and educational purposes.

</div>