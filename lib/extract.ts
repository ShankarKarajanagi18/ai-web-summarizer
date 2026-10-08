import { load } from "cheerio";

export const MAX_TEXT_CHARS = 20_000; // text sent to the model
export const MIN_TEXT_CHARS = 200;

/** Pulls the page title and the main readable text out of raw HTML. */
export function extractContent(html: string): { title: string; text: string } {
  const $ = load(html);

  const title =
    $("meta[property='og:title']").attr("content")?.trim() ||
    $("title").first().text().trim() ||
    "";

  $(
    "script, style, noscript, template, svg, iframe, canvas, form, nav, footer, header, aside, [role='navigation'], [role='banner'], [aria-hidden='true']"
  ).remove();

  // Prefer semantic main-content containers, fall back to <body>.
  const candidates = ["article", "main", "[role='main']", "#content", ".content", "body"];
  let selected = "body";
  for (const sel of candidates) {
    const el = $(sel).first();
    if (el.length && el.text().trim().length > MIN_TEXT_CHARS) {
      selected = sel;
      break;
    }
  }
  const root = $(selected).first();

  // Add spacing between block elements so words don't glue together.
  root.find("p, div, li, h1, h2, h3, h4, h5, h6, br, tr, section").append(" \n");

  const text = root
    .text()
    .replace(/[ \t\f\v ]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { title, text: text.slice(0, MAX_TEXT_CHARS) };
}
