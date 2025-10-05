import { NextRequest, NextResponse } from "next/server";

const SERP_API_ENDPOINT = "https://serpapi.com/search.json";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const tbs = searchParams.get("tbs") || undefined; // advanced filters if needed
    const gl = searchParams.get("gl") || "us";
    const hl = searchParams.get("hl") || "en";
    const num = Number(searchParams.get("num") || 12);

    if (!q) {
      return NextResponse.json(
        { error: "Missing q parameter" },
        { status: 400 }
      );
    }

    const apiKey = process.env.SERP_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "SERP_API_KEY not configured on server" },
        { status: 500 }
      );
    }

    const url = new URL(SERP_API_ENDPOINT);
    url.searchParams.set("engine", "google_images");
    url.searchParams.set("q", q);
    url.searchParams.set("gl", gl);
    url.searchParams.set("hl", hl);
    url.searchParams.set("api_key", apiKey);
    // Prefer licensable images if possible; comment out to broaden results
    if (tbs) url.searchParams.set("tbs", tbs);

    // Note: google_images uses pages via ijn; SerpAPI can still return many results.
    // We'll slice client-side to `num`.

    const resp = await fetch(url.toString(), {
      cache: "no-store",
      // Work around any proxy/cors hiccups in dev by sending explicit headers
      headers: { Accept: "application/json" },
    });
    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      return NextResponse.json(
        { error: `SerpAPI error ${resp.status}`, detail: text },
        { status: 502 }
      );
    }
    let data: any;
    try {
      data = await resp.json();
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid JSON from SerpAPI" },
        { status: 502 }
      );
    }
    const images: string[] = Array.isArray(data?.images_results)
      ? data.images_results
          .map((r: any) => r?.original || r?.thumbnail)
          .filter((u: any) => typeof u === "string")
          .slice(0, Math.max(1, Math.min(50, num)))
      : [];

    return NextResponse.json({ images });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
