# JobScan

JobScan is a modern web application designed to help users identify and avoid job scams. By leveraging the power of the Google Gemini API, JobScan analyzes job postings, emails, and recruiter communications for potential threats and red flags.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **Database:** PostgreSQL (with raw SQL queries via `pg`)
- **Authentication:** [NextAuth.js v5](https://authjs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) + Lucide Icons
- **AI Integration:** Google Gemini API (`@google/generative-ai`)

## Prerequisites

Before running the application locally, ensure you have the following installed:
- Node.js (v18 or higher recommended)
- PostgreSQL (running locally or accessible via your network)
- A valid Google Gemini API Key

## Setup & Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory based on the following template:

   ```env
   # Application Port
   PORT=3000
   NODE_ENV=development

   # PostgreSQL Configuration
   DB_USER=devuser
   DB_HOST=localhost
   DB_NAME=jobscan
   DB_PASSWORD=devpass
   DB_PORT=5435

   # NextAuth Setup
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_generated_secret
   AUTH_SECRET=your_generated_secret

   # Google Gemini API
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Initialize the Database:**
   Ensure your PostgreSQL server is running and the database specified in `DB_NAME` exists. The application runs its database migrations and schema checks automatically during startup.

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `src/app/` - Next.js App Router pages and layouts.
- `src/backend/` - Server-side logic, API handlers, authentication, database migrations, and AI logic.
- `src/frontend/` - React components, layouts, hooks, and UI assets.
- `src/database/` - Database schemas and initial SQL files.
- `src/scripts/` - Custom utility scripts (e.g., static icon generation).
- `extension/` - Files related to the JobScan browser extension.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new). Make sure to configure your production environment variables (including your remote database connection details and Gemini API key) in the Vercel dashboard.
