"use client";

import { useState, useEffect } from "react";
import { createPlanetSummaryStream } from "@/lib/utils/get-planet-summary";
import { Loader2 } from "lucide-react";

interface PlanetSummaryHeaderProps {
  planetId: string;
}

export function PlanetSummaryHeader({ planetId }: PlanetSummaryHeaderProps) {
  const [streamingSummary, setStreamingSummary] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  const startStreamingSummary = () => {
    // Close existing connection if any
    if (eventSource) {
      eventSource.close();
    }

    setIsStreaming(true);
    setStreamingSummary("");
    setError(null);

    const newEventSource = createPlanetSummaryStream(planetId);
    setEventSource(newEventSource);

    newEventSource.onmessage = (event) => {
      try {
        if (event.data && event.data !== "{}") {
          const data = JSON.parse(event.data);
          if (data.chunk) {
            setStreamingSummary((prev) => prev + data.chunk);
          }
        }
      } catch (err) {
        console.error("Error parsing streaming data:", err);
        setError("Error parsing streaming data");
        setIsStreaming(false);
        newEventSource.close();
        setEventSource(null);
      }
    };

    newEventSource.addEventListener("done", () => {
      setIsStreaming(false);
      newEventSource.close();
      setEventSource(null);
    });

    newEventSource.onerror = (event) => {
      console.error("EventSource failed:", event);
      setError("Streaming failed - API may be unavailable");
      setIsStreaming(false);
      newEventSource.close();
      setEventSource(null);
    };
  };

  useEffect(() => {
    // Automatically start streaming when component mounts
    startStreamingSummary();

    // Cleanup on unmount
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [planetId]);

  // Don't render anything if there's no content and no error
  if (!streamingSummary && !isStreaming && !error) {
    return null;
  }

  return (
    <div className="max-w-3xl">
      {error && (
        <div className="text-destructive text-sm mb-2 p-2 bg-destructive/10 rounded">
          {error}
        </div>
      )}

      {isStreaming && !streamingSummary && (
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Generating AI summary...</span>
        </div>
      )}

      {streamingSummary && (
        <div className="text-foreground/90 text-lg leading-relaxed">
          {streamingSummary}
          {isStreaming && <span className="animate-pulse text-primary">|</span>}
        </div>
      )}
    </div>
  );
}
