"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, PartyPopper } from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://beyond-blue.onrender.com";

export function SurpriseMeButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function getRandomPlanet() {
    const segments = ["confirmed", "candidate", "false_positive"];
    for (let attempt = 0; attempt < 5; attempt++) {
      const segment = segments[Math.floor(Math.random() * segments.length)];
      // Try a random window in the first ~4000 entries; backend paginates safely
      const skip = Math.floor(Math.random() * 4000);
      const url = `${API_BASE_URL}/${segment}?limit=1&skip=${skip}`;
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0 && data[0]._id) {
          return data[0];
        }
      } catch {
        // ignore and retry
      }
    }
    return null;
  }

  const handleClick = async () => {
    setLoading(true);
    const planet = await getRandomPlanet();
    setLoading(false);
    if (planet?._id) {
      router.push(`/planet/${planet._id}`);
    } else {
      // Fallback to a random explore page
      const page = 1 + Math.floor(Math.random() * 50);
      router.push(`/explore?page=${page}`);
    }
  };

  return (
    <Button
      onClick={handleClick}
      size="sm"
      className="shadow-sm transition-smooth hover:shadow-md"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Cooking...
        </>
      ) : (
        <>
          {/* <PartyPopper className="mr-2 h-4 w-4" /> */}
          Surprise Me 🎉
        </>
      )}
    </Button>
  );
}
