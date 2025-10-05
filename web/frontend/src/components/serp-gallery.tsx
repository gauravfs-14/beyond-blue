"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlanetGallery } from "@/components/planet-gallery";

export function SerpGallery({
  query,
  limit = 8,
  fallbackImages,
  planetNameForFallback,
}: {
  query: string;
  limit?: number;
  fallbackImages?: string[];
  planetNameForFallback?: string;
}) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        setIdx(0);
        const params = new URLSearchParams({ q: query, num: String(limit) });
        const res = await fetch(`/api/images?${params.toString()}`);
        if (!res.ok) throw new Error(`Failed ${res.status}`);
        const data = await res.json();
        const fetched = Array.isArray(data.images) ? data.images : [];
        if (active) setImages(fetched);
      } catch (e: any) {
        if (active) {
          console.error("SerpAPI image fetch failed:", e);
          setError(e?.message || "Failed to load images");
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [query, limit]);

  if (loading) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-muted">
        <div className="text-muted-foreground text-sm">Fetching images…</div>
      </div>
    );
  }

  if (error || images.length === 0) {
    if (fallbackImages && fallbackImages.length > 0) {
      return (
        <PlanetGallery
          images={fallbackImages}
          planetName={planetNameForFallback || query}
        />
      );
    }
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-muted">
        <p className="text-muted-foreground text-sm">No images found</p>
      </div>
    );
  }

  const goPrev = () => setIdx((p) => (p === 0 ? images.length - 1 : p - 1));
  const goNext = () => setIdx((p) => (p === images.length - 1 ? 0 : p + 1));

  return (
    <div className="space-y-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted shadow-xl">
        <Image
          src={images[idx]}
          alt={`${query} – Image ${idx + 1}`}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-[11px] text-white/80">
          From Google Images
        </div>

        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-1/2 left-4 -translate-y-1/2 bg-background/80 backdrop-blur-md"
              onClick={goPrev}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous image</span>
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-background/80 backdrop-blur-md"
              onClick={goNext}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next image</span>
            </Button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              className={`h-2 rounded-full transition-all ${
                i === idx
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
