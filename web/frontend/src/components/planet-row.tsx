import Link from "next/link";
import type { Planet } from "@/lib/types";
import { formatValue } from "@/lib/utils/planet-utils";

interface PlanetRowProps {
  planet: Planet;
}

export function PlanetRow({ planet }: PlanetRowProps) {
  const habitableZoneColors = {
    habitable: "bg-green-500",
    inner: "bg-orange-500",
    outer: "bg-blue-500",
    unknown: "bg-gray-500",
  };

  const habitableZoneColor =
    habitableZoneColors[planet.habitableZone || "unknown"];

  return (
    <Link
      href={`/planet/${planet._id}`}
      className="group block rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${habitableZoneColor}`}
              aria-hidden="true"
            />
            <h3 className="font-semibold text-foreground text-lg group-hover:text-primary">
              {planet.pl_name}
            </h3>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-1 text-muted-foreground text-sm">
            <span>Host: {planet.hostname}</span>
            {planet.discoverymethod && (
              <span>Method: {planet.discoverymethod}</span>
            )}
            {planet.disc_year && <span>Discovered: {planet.disc_year}</span>}
          </div>

          <div className="grid gap-x-6 gap-y-1 pt-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
            {planet.pl_rade !== undefined && (
              <div>
                <span className="text-muted-foreground">Radius: </span>
                <span className="font-mono">
                  {formatValue(planet.pl_rade)} R⊕
                </span>
              </div>
            )}
            {planet.pl_bmasse !== undefined && (
              <div>
                <span className="text-muted-foreground">Mass: </span>
                <span className="font-mono">
                  {formatValue(planet.pl_bmasse)} M⊕
                </span>
              </div>
            )}
            {planet.pl_orbper !== undefined && (
              <div>
                <span className="text-muted-foreground">Period: </span>
                <span className="font-mono">
                  {formatValue(planet.pl_orbper)} days
                </span>
              </div>
            )}
            {planet.sy_dist !== undefined && (
              <div>
                <span className="text-muted-foreground">Distance: </span>
                <span className="font-mono">
                  {formatValue(planet.sy_dist)} pc
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
