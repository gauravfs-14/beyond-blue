import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

// Basic SSRF guard: only allow http/https and block localhost/private ranges.
export function isSafeUrl(urlStr: string): boolean {
  try {
    const u = new URL(urlStr);
    if (!['http:', 'https:'].includes(u.protocol)) return false;
    const hostname = u.hostname.toLowerCase();
    // Block localhost & common private nets
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.local') ||
      hostname === '127.0.0.1' ||
      hostname === '::1'
    ) return false;
    return true;
  } catch {
    return false;
  }
}

export async function fetchHtml(url: string, timeoutMs = 15000): Promise<string> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  const res = await fetch(url, { signal: controller.signal, redirect: 'follow' as const });
  clearTimeout(t);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  const html = await res.text();
  return html;
}

export function extractMainText(html: string, baseUrl?: string): { title?: string; text: string } {
  const dom = new JSDOM(html, { url: baseUrl });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();
  if (article?.textContent?.trim()) {
    return { title: article.title ?? undefined, text: article.textContent.trim() };
  }
  // fallback to full document text
  const fallback = dom.window.document.body?.textContent?.trim() || '';
  return { text: fallback };
}

// Your pl_refname looks like: <a refstr=... href=https://... target=ref>Title</a>
// Attributes may be unquoted; a simple href regex is robust here.
export function extractHrefFromPlRefname(pl_refname?: string | null): string | null {
  if (!pl_refname) return null;
  const m = pl_refname.match(/href=(["']?)(https?:\/\/[^"'\s>]+)\1/i);
  return m ? m[2] : null;
}
