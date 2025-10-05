import Link from "next/link";
import Image from "next/image";
import { SerpImage } from "@/components/serp-image";
import type { Planet } from "@/lib/types";
import { pickSampleImage } from "@/lib/utils/sample-images";
import { formatValue } from "@/lib/utils/planet-utils";

interface PlanetCardProps {
  planet: Planet;
}

export function PlanetCard({ planet }: PlanetCardProps) {
  const habitableZoneColors = {
    habitable: "bg-green-500",
    inner: "bg-orange-500",
    outer: "bg-blue-500",
    unknown: "bg-gray-500",
  };

  const habitableZoneLabels = {
    habitable: "Habitable Zone",
    inner: "Too Hot",
    outer: "Too Cold",
    unknown: "Unknown",
  };

  const zoneKey = (planet.habitableZone ||
    "unknown") as keyof typeof habitableZoneColors;
  const habitableZoneColor = habitableZoneColors[zoneKey];
  const habitableZoneLabel = habitableZoneLabels[zoneKey];
  const showHabitableBadge =
    planet.habitableZone !== undefined && planet.habitableZone !== "unknown";

  return (
    <Link
      href={`/planet/${planet._id}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card/50 shadow-sm backdrop-blur-sm transition-smooth hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        <SerpImage
          query={`${planet.pl_name} exoplanet ${planet.hostname || ""}`}
          fallbackUrl={
            planet.images && planet.images.length > 0
              ? planet.images[0]
              : pickSampleImage(planet._id)
          }
          alt={planet.pl_name}
          className="object-cover transition-all duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {showHabitableBadge && (
          <div className="absolute top-3 right-3 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 backdrop-blur-md">
            <div
              className={`h-2 w-2 rounded-full ${habitableZoneColor} shadow-lg`}
              aria-hidden="true"
            />
            <span className="text-white text-xs font-medium">
              {habitableZoneLabel}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4 p-6">
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground text-lg leading-tight transition-smooth group-hover:text-primary">
            {planet.pl_name}
          </h3>
          {planet.tagline && (
            <p className="text-muted-foreground text-sm leading-snug">
              {planet.tagline}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground text-xs">
          <span className="flex items-center gap-1">
            <span className="text-foreground/60">Host:</span> {planet.hostname}
          </span>
          {planet.disc_year && (
            <span className="flex items-center gap-1">
              <span className="text-foreground/60">Discovered:</span>{" "}
              {planet.disc_year}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/30 p-4 text-sm">
          {planet.pl_rade !== undefined && (
            <div className="space-y-1">
              <div className="text-muted-foreground text-xs font-medium">
                Radius
              </div>
              <div className="font-mono font-semibold text-foreground">
                {formatValue(planet.pl_rade)} R⊕
              </div>
            </div>
          )}
          {planet.pl_bmasse !== undefined && (
            <div className="space-y-1">
              <div className="text-muted-foreground text-xs font-medium">
                Mass
              </div>
              <div className="font-mono font-semibold text-foreground">
                {formatValue(planet.pl_bmasse)} M⊕
              </div>
            </div>
          )}
          {planet.pl_orbper !== undefined && (
            <div className="space-y-1">
              <div className="text-muted-foreground text-xs font-medium">
                Period
              </div>
              <div className="font-mono font-semibold text-foreground">
                {formatValue(planet.pl_orbper)} days
              </div>
            </div>
          )}
          {planet.sy_dist !== undefined && (
            <div className="space-y-1">
              <div className="text-muted-foreground text-xs font-medium">
                Distance
              </div>
              <div className="font-mono font-semibold text-foreground">
                {formatValue(planet.sy_dist)} pc
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
