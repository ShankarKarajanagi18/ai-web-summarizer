# AI Web Summarizer

Paste a webpage URL, click **Summarize**, and get a short AI-written summary: a quick overview plus key takeaways.

- **Frontend:** React (Next.js App Router) with a single page, a URL input, and a loading state
- **Backend:** Next.js API route at `POST /api/summarize`
- **Scraping:** `fetch` + [Cheerio](https://cheerio.js.org/) (strips scripts, nav, footers, etc. and keeps the main text)
- **AI:** [Google Gemini API](https://aistudio.google.com/) on the free tier (`gemini-2.5-flash` by default)

Frontend and backend live in one Next.js project, so one command runs both.

## How it works

1. The browser sends `{ "url": "..." }` to `/api/summarize`.
2. The server validates the URL (http/https only, blocks localhost and private IP ranges), downloads the HTML, and extracts the main text.
3. The text (capped at ~20,000 characters) is sent to Gemini with a summarization prompt.
4. The summary is returned as JSON and rendered on the page.

## Run locally

**Requirements:** Node.js 18.18+ (Node 20 or 22 recommended) and npm.

### 1. Get a free Gemini API key

Create one at <https://aistudio.google.com/apikey> (no credit card needed).

### 2. Install dependencies

```bash
git clone <your-repo-url>
cd ai-web-summarizer
npm install
```

### 3. Add your `.env` file

Create a file named **`.env.local` in the project root** (the same folder as `package.json`):

```bash
cp .env.example .env.local
```

Then open `.env.local` and paste your key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Optional: set `GEMINI_MODEL` to use a different Gemini model (default: `gemini-2.5-flash`).

> `.env.local` is git-ignored, so your key is never committed. Never put the key in frontend code. It is only read by the server route.

### 4. Start the app (frontend and backend together)

```bash
npm run dev
```

Open <http://localhost:3000>. The UI and the API (`/api/summarize`) both run from this one process.

To run a production build locally instead:

```bash
npm run build
npm start
```

## API

`POST /api/summarize`

Request:

```json
{ "url": "https://example.com/some-article" }
```

Success (`200`):

```json
{
  "title": "Page title",
  "url": "https://example.com/some-article",
  "summary": "Overview...\n\n- Key point\n- Key point",
  "charactersAnalyzed": 4210
}
```

Errors return `{ "error": "message" }` with an appropriate status code (`400` bad URL, `422` not enough text found, `429` AI rate limit, `502` page or AI service failure).

Quick test with curl:

```bash
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{"url":"https://en.wikipedia.org/wiki/Web_scraping"}'
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to <https://vercel.com/new> and import the repository (the Next.js preset is detected automatically).
3. Under **Environment Variables**, add `GEMINI_API_KEY` with your key.
4. Click **Deploy**. Vercel gives you a live URL.

If you change the key later, update it under *Project → Settings → Environment Variables* and redeploy.

## Project structure

```
app/
  page.tsx               # UI: input, Summarize button, loading, result card
  layout.tsx
  globals.css
  api/summarize/route.ts # API: validate URL, fetch HTML, call Gemini
lib/
  extract.ts             # HTML -> clean main text (Cheerio)
.env.example             # copy to .env.local
```

## Limitations

- Only reads server-rendered HTML. Pages that need JavaScript to render (many SPAs) or that block bots may return too little text or a 403.
- Very long pages are truncated to ~20,000 characters before summarizing.
- The free Gemini tier is rate limited. If you see a rate-limit message, wait a minute and try again.
- Basic SSRF protection is included (private and loopback addresses are blocked, including across redirects), but this is a demo, not a hardened proxy.
