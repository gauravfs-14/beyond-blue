"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

export function SerpImage({
  query,
  fallbackUrl,
  alt,
  fill = true,
  className,
}: {
  query: string;
  fallbackUrl?: string;
  alt: string;
  fill?: boolean;
  className?: string;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setError(null);
        setLoading(true);
        const params = new URLSearchParams({ q: query, num: "1" });
        const res = await fetch(`/api/images?${params.toString()}`);
        if (!res.ok) throw new Error(`Failed ${res.status}`);
        const data = await res.json();
        const first =
          Array.isArray(data.images) && data.images.length > 0
            ? data.images[0]
            : null;
        if (active) setSrc(first);
      } catch (e: any) {
        if (active) setError(e?.message || "Failed to load image");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [query]);

  const isSerp = !!src;
  const shouldUseFallback = !loading && !src && !!fallbackUrl;
  const imageUrl = isSerp
    ? (src as string)
    : shouldUseFallback
    ? (fallbackUrl as string)
    : "/placeholder.svg";

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image
        src={imageUrl}
        alt={alt}
        {...(fill ? { fill: true } : {})}
        className={className}
      />
      {loading && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-black/10 to-transparent" />
      )}
      {!loading && (
        <div className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white/80">
          {isSerp ? "From Google Images" : "Representative image"}
        </div>
      )}
    </>
  );
}
