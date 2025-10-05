"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { HelpIcon } from "@/components/primitives/help-icon";
import { PlanetCard } from "@/components/planet-card";
import type { Planet } from "@/lib/types";
import { fetchSimilarPlanetsLocal } from "@/lib/utils/api-service";
import type { ClassifierInput, ClassifierResult } from "@/lib/types";

export function ClassifierForm() {
  const [formData, setFormData] = useState<ClassifierInput>({
    koi_period: 0,
    koi_duration: 0,
    koi_depth: 0,
    koi_impact: undefined,
    koi_srho: undefined,
    koi_incl: undefined,
  });

  const [result, setResult] = useState<ClassifierResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [similar, setSimilar] = useState<Planet[] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Client-side validation for clearer UX
    if (
      formData.koi_period === undefined ||
      formData.koi_duration === undefined ||
      formData.koi_depth === undefined
    ) {
      setError("Please fill period, duration, and depth.");
      return;
    }
    if (formData.koi_impact !== undefined && formData.koi_impact < 0) {
      setError("Impact parameter must be non-negative.");
      return;
    }
    if (
      formData.koi_incl !== undefined &&
      (formData.koi_incl < 0 || formData.koi_incl > 180)
    ) {
      setError("Inclination must be between 0 and 180 degrees.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    setSimilar(null);

    try {
      const response = await fetch("http://0.0.0.0:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Parse FastAPI error shapes
        let detailText = `Classification failed (${response.status})`;
        try {
          const errorData = await response.json();
          const detail = (errorData && errorData.detail) || errorData;
          if (typeof detail === "string") {
            detailText = detail;
          } else if (Array.isArray(detail)) {
            // Pydantic error list
            detailText = detail
              .map((d: any) => d?.msg || JSON.stringify(d))
              .join("; ");
          } else if (detail && typeof detail === "object") {
            detailText = JSON.stringify(detail);
          }
        } catch (_) {
          // ignore JSON parse errors
        }
        throw new Error(detailText);
      }

      const data = await response.json();
      setResult(data);

      // Fetch similar planets by orbital period (client-side, no backend change)
      if (formData.koi_period) {
        try {
          const sim = await fetchSimilarPlanetsLocal({
            periodDays: formData.koi_period,
            tolerancePct: 10,
            limit: 12,
            poolSize: 400,
            includeCandidates: true,
            includeFalsePositives: true,
          });
          setSimilar(sim.data);
        } catch (e) {
          // Non-fatal for UI
          console.warn("Similar planets fetch failed", e);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ClassifierInput, value: string) => {
    const numValue = value === "" ? undefined : Number(value);
    setFormData((prev) => ({ ...prev, [field]: numValue }));
  };

  const loadExample = () => {
    setFormData({
      koi_period: 9.488,
      koi_duration: 2.958,
      koi_depth: 615.8,
      koi_impact: 0.14,
      koi_srho: 3.208,
      koi_incl: 89.6,
    });
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Planet Parameters</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={loadExample}
                className="hover:text-primary cursor-pointer"
              >
                Load Example
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="koi_period"
                  className="inline-flex items-center gap-1"
                >
                  Orbital Period (days) *
                  <HelpIcon content="Time the planet takes to complete one orbit around its star (days)." />
                </Label>
                <Input
                  id="koi_period"
                  type="number"
                  step="0.001"
                  placeholder="e.g., 384.843"
                  value={formData.koi_period ?? ""}
                  onChange={(e) =>
                    handleInputChange("koi_period", e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="koi_duration"
                  className="inline-flex items-center gap-1"
                >
                  Transit Duration (hours) *
                  <HelpIcon content="Time the planet spends passing in front of the star, from ingress to egress (hours)." />
                </Label>
                <Input
                  id="koi_duration"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 8.5"
                  value={formData.koi_duration ?? ""}
                  onChange={(e) =>
                    handleInputChange("koi_duration", e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="koi_depth"
                  className="inline-flex items-center gap-1"
                >
                  Transit Depth (ppm) *
                  <HelpIcon content="How much the star dims during transit, in parts per million (ppm). Proportional to (planet radius / star radius)^2." />
                </Label>
                <Input
                  id="koi_depth"
                  type="number"
                  step="1"
                  placeholder="e.g., 1500"
                  value={formData.koi_depth ?? ""}
                  onChange={(e) =>
                    handleInputChange("koi_depth", e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="koi_impact"
                  className="inline-flex items-center gap-1"
                >
                  Impact Parameter (≥ 0)
                  <HelpIcon content="Projected distance between the planet's transit chord and stellar center in stellar radii. 0 is central; values ≥1 indicate grazing or fit uncertainty." />
                </Label>
                <Input
                  id="koi_impact"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g., 0.3 (may exceed 1 for grazing)"
                  value={formData.koi_impact ?? ""}
                  onChange={(e) =>
                    handleInputChange("koi_impact", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="koi_srho"
                  className="inline-flex items-center gap-1"
                >
                  Stellar Density (g/cm³)
                  <HelpIcon content="Mean density of the host star. Helps constrain transit geometry and duration." />
                </Label>
                <Input
                  id="koi_srho"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 1.4"
                  value={formData.koi_srho ?? ""}
                  onChange={(e) =>
                    handleInputChange("koi_srho", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="koi_incl"
                  className="inline-flex items-center gap-1"
                >
                  Orbital Inclination (degrees)
                  <HelpIcon content="Tilt of the planet's orbit relative to our line of sight. ≈90° is edge-on (transiting)." />
                </Label>
                <Input
                  id="koi_incl"
                  type="number"
                  step="0.1"
                  min="0"
                  max="180"
                  placeholder="e.g., 89.5"
                  value={formData.koi_incl ?? ""}
                  onChange={(e) =>
                    handleInputChange("koi_incl", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </Card>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Classifying...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Classify Planet
            </>
          )}
        </Button>
      </form>

      {error && (
        <Card className="border-destructive bg-destructive/10 p-6">
          <p className="text-destructive text-sm">{error}</p>
        </Card>
      )}

      {result && (
        <Card className="border-primary/50 bg-primary/5 p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Classification Result</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground text-sm">
                  Classification
                </span>
                <span className="font-semibold text-lg text-primary">
                  {result.prediction === 1
                    ? "CONFIRMED PLANET"
                    : "FALSE POSITIVE"}
                </span>
              </div>

              {(() => {
                const predictedProb =
                  result.prediction === 1
                    ? result.probability
                    : 1 - result.probability;
                return (
                  <div className="flex items-baseline justify-between">
                    <span className="text-muted-foreground text-sm inline-flex items-center gap-1">
                      Probability (predicted class)
                      <HelpIcon content="We show the probability of the predicted class. If the model predicts FALSE POSITIVE, we display 1 - P(planet)." />
                    </span>
                    <span className="font-mono text-foreground">
                      {(predictedProb * 100).toFixed(2)}%
                    </span>
                  </div>
                );
              })()}

              {(() => {
                const predictedProb =
                  result.prediction === 1
                    ? result.probability
                    : 1 - result.probability;
                return (
                  <div
                    className="h-2 w-full overflow-hidden rounded-full bg-muted"
                    aria-hidden
                  >
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${(predictedProb * 100).toFixed(2)}%` }}
                    />
                  </div>
                );
              })()}

              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground text-sm inline-flex items-center gap-1">
                  Confidence Level
                  <HelpIcon content="Heuristic bucket based on probability: HIGH if ≥80% or ≤20%; MEDIUM if ≥60% or ≤40%; LOW otherwise. Low probability toward 0 implies high confidence of FALSE POSITIVE." />
                </span>
                <span className="font-semibold text-foreground">
                  {result.confidence}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground text-sm">
                  Threshold Used
                </span>
                <span className="font-mono text-foreground">
                  {result.threshold_used}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground text-sm">
                  Model Type
                </span>
                <span className="text-foreground text-sm">
                  {result.model_info.model_type} v{result.model_info.version}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {result && similar && similar.length > 0 && (
        <Card className="border-border/60 bg-card/40 p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">Similar Planets</h3>
              <span className="text-muted-foreground text-sm">
                Matching orbital period ±10%
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
              {similar.map((p) => (
                <PlanetCard key={p._id} planet={p} />
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
