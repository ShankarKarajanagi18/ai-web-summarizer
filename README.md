# SummarAI

Turn long pages into useful summaries. A fast, minimal web intelligence tool that extracts executive summaries and key insights from any public webpage.

## Features

- **Instant Summaries:** Extract core overviews and structured takeaways in seconds.
- **SPA & Dynamic Page Support:** Automatic fallback to headless reader rendering for client-side JavaScript apps (React, Vite, Vue, Next.js).
- **Safety First:** Built-in SSRF protection blocking private IPv4, IPv6, loopback addresses, and redirects.
- **Reading Workspace:** Clean, editorial typography layout with reading time metrics and word condensation statistics.
- **Local History:** Past summaries are automatically saved in browser local storage with instant search.
- **Dark / Light Theme:** Thoughtfully designed neutral color system.

## Tech Stack

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript
- **Styling:** CSS design system (Inter + JetBrains Mono)
- **Scraping:** Cheerio + Reader Pipeline
- **AI Engine:** Groq API (Low-latency LPU inference)

---

## Getting Started

### 1. Prerequisites
- Node.js 18.18+ (Node 20 or 22 recommended)
- A free Groq API key from [Groq Console](https://console.groq.com/keys)

### 2. Installation

```bash
git clone <your-repository-url>
cd ai-web-summarizer
npm install
```

### 3. Configure Environment

Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

Open `.env.local` and add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
# Optional: override model (default: openai/gpt-oss-120b)
# GROQ_MODEL=openai/gpt-oss-120b
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deploying to Vercel (Recommended)

1. Push your repository to GitHub (see below).
2. Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repository.
3. In the **Environment Variables** section, add:
   - `GROQ_API_KEY`: `your_groq_api_key_here`
4. Click **Deploy**. Your site will be live on a `*.vercel.app` domain with automated SSL.

---

## Project Structure

```
app/
  api/summarize/route.ts   # Backend API: SSRF guard, scraping, Groq synthesis
  globals.css              # Editorial design system tokens & typography
  layout.tsx               # Root layout & metadata
  page.tsx                 # Main application state & view coordinator
components/
  Navbar.tsx               # Header navigation & theme toggle
  Hero.tsx                 # Compact headline & description
  UrlInput.tsx             # Command-line search bar & example links
  FeaturesGrid.tsx         # Functional value propositions
  SummaryDashboard.tsx     # Editorial reading workspace
  HistoryDrawer.tsx        # Past summaries drawer with search
  HowItWorksModal.tsx      # System architecture explanation
  LoadingState.tsx         # Quiet, professional loading indicator
  ErrorState.tsx           # Error callout & retry actions
  Toast.tsx                # Copy & action feedback toasts
lib/
  extract.ts               # Cheerio HTML parser & metadata extraction
.env.example               # Environment template (git committed)
.env.local                 # Local secret keys (git ignored)
```
