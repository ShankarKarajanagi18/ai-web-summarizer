import { NextResponse } from "next/server";
import { extractContent, MIN_TEXT_CHARS } from "@/lib/extract";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_HTML_BYTES = 2_000_000; // stop reading after ~2MB
const FETCH_TIMEOUT_MS = 12_000;
const MAX_REDIRECTS = 5;

class HttpError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

/* ---------- URL safety (basic SSRF protection) ---------- */

function isPrivateIPv4(ip: string): boolean {
  const [a, b] = ip.split(".").map(Number);
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224
  );
}

function isPrivateIPv6(ip: string): boolean {
  const v = ip.toLowerCase();
  if (v === "::1" || v === "::") return true;
  if (v.startsWith("fc") || v.startsWith("fd")) return true; // unique local
  if (v.startsWith("fe80")) return true; // link local
  const mapped = v.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isPrivateIPv4(mapped[1]);
  return false;
}

async function assertPublicUrl(raw: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new HttpError("That doesn't look like a valid URL.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new HttpError("Only http and https URLs are supported.");
  }

  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".localhost")) {
    throw new HttpError("That address isn't allowed.");
  }

  const ipVersion = isIP(host);
  const addresses = ipVersion
    ? [{ address: host, family: ipVersion }]
    : await lookup(host, { all: true }).catch(() => {
        throw new HttpError("Couldn't resolve that domain.");
      });

  for (const { address, family } of addresses) {
    const blocked = family === 4 ? isPrivateIPv4(address) : isPrivateIPv6(address);
    if (blocked) throw new HttpError("That address isn't allowed.");
  }
  return url;
}

/* ---------- Scraping ---------- */

async function fetchHtml(startUrl: URL): Promise<{ html: string; finalUrl: URL }> {
  let current = startUrl;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    await assertPublicUrl(current.toString());

    let res: Response;
    try {
      res = await fetch(current, {
        redirect: "manual",
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; AISummarizerBot/1.0; +https://github.com)",
          Accept: "text/html,application/xhtml+xml",
        },
      });
    } catch {
      throw new HttpError("Couldn't reach that page (timeout or network error).", 502);
    }

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) throw new HttpError("Page redirected without a location.", 502);
      current = new URL(location, current);
      continue;
    }

    if (!res.ok) {
      throw new HttpError(`The page responded with status ${res.status}.`, 502);
    }

    const type = res.headers.get("content-type") ?? "";
    if (!/text\/html|application\/xhtml\+xml|text\/plain/i.test(type)) {
      throw new HttpError("That URL doesn't point to an HTML page.");
    }

    // Read the body with a size cap.
    const reader = res.body?.getReader();
    if (!reader) throw new HttpError("The page had no content.", 502);
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (total < MAX_HTML_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      total += value.length;
    }
    reader.cancel().catch(() => {});

    const html = Buffer.concat(chunks).toString("utf-8");
    return { html, finalUrl: current };
  }

  throw new HttpError("Too many redirects.", 502);
}

/* ---------- AI summary (Google Gemini free tier) ---------- */

async function summarize(title: string, text: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new HttpError(
      "Server is missing GEMINI_API_KEY. See the README for setup.",
      500
    );
  }
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  const prompt = [
    "Summarize the web page content below for a busy reader.",
    "Format:",
    "1. A 2-3 sentence overview in plain text.",
    "2. A blank line, then 3-5 bullet points of the key takeaways, each starting with '- '.",
    "Be accurate, neutral, and concise. Do not invent facts that are not in the content.",
    "",
    title ? `Page title: ${title}` : "",
    "Page content:",
    text,
  ].join("\n");

  let res: Response;
  try {
    res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3 },
        }),
        signal: AbortSignal.timeout(45_000),
      }
    );
  } catch {
    throw new HttpError("The AI service didn't respond in time. Try again.", 504);
  }

  if (res.status === 429) {
    throw new HttpError("AI rate limit reached (free tier). Wait a minute and retry.", 429);
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("Gemini error", res.status, detail.slice(0, 500));
    throw new HttpError("The AI service returned an error.", 502);
  }

  const data = await res.json();
  const out: string | undefined = data?.candidates?.[0]?.content?.parts
    ?.map((p: { text?: string }) => p.text ?? "")
    .join("")
    .trim();

  if (!out) {
    throw new HttpError("The AI returned an empty response. Try another page.", 502);
  }
  return out;
}

/* ---------- Route handler ---------- */

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const rawUrl = typeof body?.url === "string" ? body.url.trim() : "";
    if (!rawUrl) throw new HttpError("Please provide a URL.");

    const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
    const url = await assertPublicUrl(withProtocol);

    const { html, finalUrl } = await fetchHtml(url);
    const { title, text } = extractContent(html);

    if (text.length < MIN_TEXT_CHARS) {
      throw new HttpError(
        "Couldn't find enough text on that page. It may need JavaScript to render, or block scrapers.",
        422
      );
    }

    const summary = await summarize(title, text);

    return NextResponse.json({
      title,
      url: finalUrl.toString(),
      summary,
      charactersAnalyzed: text.length,
    });
  } catch (err) {
    if (err instanceof HttpError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Unexpected error", err);
    return NextResponse.json({ error: "Something went wrong on the server." }, { status: 500 });
  }
}
