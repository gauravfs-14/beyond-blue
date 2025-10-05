import type { Planet } from "@/lib/types";
import { Field } from "@/components/primitives/field";
import { fieldDescriptions } from "@/lib/field-descriptions";
import { formatUncertainty, formatValue } from "@/lib/utils/planet-utils";
import { PlanetGallery } from "@/components/planet-gallery";
import { PlanetSummaryHeader } from "@/components/planet-summary-header";
import { MapPin, Calendar } from "lucide-react";

interface PlanetDetailProps {
  planet: Planet;
}

export function PlanetDetail({ planet }: PlanetDetailProps) {
  const habitableZoneLabels = {
    habitable: "Habitable Zone",
    inner: "Inner (Too Hot)",
    outer: "Outer (Too Cold)",
    unknown: "Unknown",
  };

  const habitableZoneColors = {
    habitable: "text-green-600 dark:text-green-400",
    inner: "text-orange-600 dark:text-orange-400",
    outer: "text-blue-600 dark:text-blue-400",
    unknown: "text-gray-600 dark:text-gray-400",
  };

  return (
    <div className="space-y-12">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-8 md:p-12">
        <div className="relative z-10 space-y-6">
          {/* Planet Name and Host Star */}
          <div className="space-y-3">
            <h1 className="text-balance font-bold text-4xl leading-tight tracking-tight md:text-5xl lg:text-6xl">
              {planet.pl_name}
            </h1>
            {planet.tagline && (
              <p className="text-balance font-medium text-primary text-xl leading-snug md:text-2xl">
                {planet.tagline}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Orbiting {planet.hostname}</span>
              </div>
              {planet.disc_year && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Discovered {planet.disc_year}</span>
                </div>
              )}
            </div>
          </div>

          {/* Habitable Zone Badge */}
          {planet.habitableZone && (
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 backdrop-blur-sm">
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  planet.habitableZone === "habitable"
                    ? "bg-green-500"
                    : planet.habitableZone === "inner"
                    ? "bg-orange-500"
                    : planet.habitableZone === "outer"
                    ? "bg-blue-500"
                    : "bg-gray-500"
                }`}
              />
              <span
                className={`font-medium text-sm ${
                  habitableZoneColors[planet.habitableZone]
                }`}
              >
                {habitableZoneLabels[planet.habitableZone]}
              </span>
            </div>
          )}

          {/* AI Summary */}
          <PlanetSummaryHeader planetId={planet._id} />
        </div>

        {/* Decorative background element */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Gallery */}
      {planet.images && planet.images.length > 0 && (
        <PlanetGallery images={planet.images} planetName={planet.pl_name} />
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Discovery & Basic Info */}
        <section className="space-y-4">
          <h2 className="font-semibold text-xl">Discovery Information</h2>
          <div className="rounded-xl bg-muted/30 p-6">
            <dl className="divide-y divide-border/50">
              {planet.discoverymethod && (
                <Field
                  label="Discovery Method"
                  value={planet.discoverymethod}
                  help={fieldDescriptions.discoverymethod}
                />
              )}
              {planet.disc_year && (
                <Field
                  label="Discovery Year"
                  value={planet.disc_year}
                  help={fieldDescriptions.disc_year}
                />
              )}
              {planet.disc_facility && (
                <Field
                  label="Discovery Facility"
                  value={planet.disc_facility}
                  help={fieldDescriptions.disc_facility}
                />
              )}
              {planet.releasedate && (
                <Field label="Release Date" value={planet.releasedate} />
              )}
            </dl>
          </div>
        </section>

        {/* Physical Parameters */}
        <section className="space-y-4">
          <h2 className="font-semibold text-xl">Physical Parameters</h2>
          <div className="rounded-xl bg-muted/30 p-6">
            <dl className="divide-y divide-border/50">
              {planet.pl_rade !== undefined && (
                <Field
                  label="Planet Radius"
                  value={`${formatUncertainty(
                    planet.pl_rade,
                    planet.pl_radeerr1,
                    planet.pl_radeerr2
                  )} R⊕`}
                  help={fieldDescriptions.pl_rade}
                />
              )}
              {planet.pl_bmasse !== undefined && (
                <Field
                  label="Planet Mass"
                  value={`${formatUncertainty(
                    planet.pl_bmasse,
                    planet.pl_bmasseerr1,
                    planet.pl_bmasseerr2
                  )} M⊕`}
                  help={fieldDescriptions.pl_bmasse}
                />
              )}
              {planet.pl_eqt !== undefined && (
                <Field
                  label="Equilibrium Temperature"
                  value={`${formatUncertainty(
                    planet.pl_eqt,
                    planet.pl_eqterr1,
                    planet.pl_eqterr2,
                    0
                  )} K`}
                  help={fieldDescriptions.pl_eqt}
                />
              )}
              {planet.earthSimilarityIndex !== undefined && (
                <Field
                  label="Earth Similarity Index"
                  value={formatValue(planet.earthSimilarityIndex, 2)}
                  help={fieldDescriptions.earthSimilarityIndex}
                />
              )}
            </dl>
          </div>
        </section>

        {/* Orbital Parameters */}
        <section className="space-y-4">
          <h2 className="font-semibold text-xl">Orbital Parameters</h2>
          <div className="rounded-xl bg-muted/30 p-6">
            <dl className="divide-y divide-border/50">
              {planet.pl_orbper !== undefined && (
                <Field
                  label="Orbital Period"
                  value={`${formatUncertainty(
                    planet.pl_orbper,
                    planet.pl_orbpererr1,
                    planet.pl_orbpererr2
                  )} days`}
                  help={fieldDescriptions.pl_orbper}
                />
              )}
              {planet.pl_orbsmax !== undefined && (
                <Field
                  label="Semi-Major Axis"
                  value={`${formatUncertainty(
                    planet.pl_orbsmax,
                    planet.pl_orbsmaxerr1,
                    planet.pl_orbsmaxerr2
                  )} AU`}
                  help={fieldDescriptions.pl_orbsmax}
                />
              )}
              {planet.pl_orbeccen !== undefined && (
                <Field
                  label="Eccentricity"
                  value={formatUncertainty(
                    planet.pl_orbeccen,
                    planet.pl_orbeccenerr1,
                    planet.pl_orbeccenerr2,
                    3
                  )}
                  help={fieldDescriptions.pl_orbeccen}
                />
              )}
              {planet.pl_insol !== undefined && (
                <Field
                  label="Insolation Flux"
                  value={`${formatUncertainty(
                    planet.pl_insol,
                    planet.pl_insolerr1,
                    planet.pl_insolerr2
                  )} S⊕`}
                  help={fieldDescriptions.pl_insol}
                />
              )}
            </dl>
          </div>
        </section>

        {/* Stellar Parameters */}
        <section className="space-y-4">
          <h2 className="font-semibold text-xl">Stellar Parameters</h2>
          <div className="rounded-xl bg-muted/30 p-6">
            <dl className="divide-y divide-border/50">
              {planet.st_teff !== undefined && (
                <Field
                  label="Stellar Temperature"
                  value={`${formatUncertainty(
                    planet.st_teff,
                    planet.st_tefferr1,
                    planet.st_tefferr2,
                    0
                  )} K`}
                  help={fieldDescriptions.st_teff}
                />
              )}
              {planet.st_rad !== undefined && (
                <Field
                  label="Stellar Radius"
                  value={`${formatUncertainty(
                    planet.st_rad,
                    planet.st_raderr1,
                    planet.st_raderr2
                  )} R☉`}
                  help={fieldDescriptions.st_rad}
                />
              )}
              {planet.st_mass !== undefined && (
                <Field
                  label="Stellar Mass"
                  value={`${formatUncertainty(
                    planet.st_mass,
                    planet.st_masserr1,
                    planet.st_masserr2
                  )} M☉`}
                  help={fieldDescriptions.st_mass}
                />
              )}
              {planet.st_met !== undefined && (
                <Field
                  label="Stellar Metallicity"
                  value={formatUncertainty(
                    planet.st_met,
                    planet.st_meterr1,
                    planet.st_meterr2
                  )}
                  help={fieldDescriptions.st_met}
                />
              )}
              {planet.st_logg !== undefined && (
                <Field
                  label="Surface Gravity"
                  value={formatUncertainty(
                    planet.st_logg,
                    planet.st_loggerr1,
                    planet.st_loggerr2
                  )}
                  help={fieldDescriptions.st_logg}
                />
              )}
            </dl>
          </div>
        </section>
      </div>

      <section className="space-y-4">
        <h2 className="font-semibold text-xl">Photometry & Location</h2>
        <div className="rounded-xl bg-muted/30 p-6">
          <dl className="divide-y divide-border/50">
            {planet.sy_vmag !== undefined && (
              <Field
                label="V-band Magnitude"
                value={formatValue(planet.sy_vmag)}
                help={fieldDescriptions.sy_vmag}
              />
            )}
            {planet.sy_kmag !== undefined && (
              <Field
                label="K-band Magnitude"
                value={formatValue(planet.sy_kmag)}
                help={fieldDescriptions.sy_kmag}
              />
            )}
            {planet.sy_gaiamag !== undefined && (
              <Field
                label="Gaia Magnitude"
                value={formatValue(planet.sy_gaiamag)}
                help={fieldDescriptions.sy_gaiamag}
              />
            )}
            {planet.ra !== undefined && (
              <Field
                label="Right Ascension"
                value={`${formatValue(planet.ra)}°`}
                help={fieldDescriptions.ra}
              />
            )}
            {planet.dec !== undefined && (
              <Field
                label="Declination"
                value={`${formatValue(planet.dec)}°`}
                help={fieldDescriptions.dec}
              />
            )}
            {planet.sy_dist !== undefined && (
              <Field
                label="Distance"
                value={`${formatUncertainty(
                  planet.sy_dist,
                  planet.sy_disterr1,
                  planet.sy_disterr2
                )} pc`}
                help={fieldDescriptions.sy_dist}
              />
            )}
          </dl>
        </div>
      </section>
    </div>
  );
}
