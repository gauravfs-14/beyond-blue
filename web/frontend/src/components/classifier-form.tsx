"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import type { ClassifierInput, ClassifierResult } from "@/lib/types";

export function ClassifierForm() {
  const [formData, setFormData] = useState<ClassifierInput>({
    pl_rade: undefined,
    pl_bmasse: undefined,
    pl_orbper: undefined,
    pl_orbsmax: undefined,
    pl_eqt: undefined,
    st_teff: undefined,
    st_rad: undefined,
    st_mass: undefined,
  });

  const [result, setResult] = useState<ClassifierResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/model/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Classification failed");
      }

      const data = await response.json();
      setResult(data);
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
      pl_rade: 1.63,
      pl_bmasse: 5.0,
      pl_orbper: 384.843,
      pl_orbsmax: 1.046,
      pl_eqt: 265,
      st_teff: 5757,
      st_rad: 1.11,
      st_mass: 1.04,
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
              >
                Load Example
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pl_rade">Planet Radius (R⊕)</Label>
                <Input
                  id="pl_rade"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 1.63"
                  value={formData.pl_rade ?? ""}
                  onChange={(e) => handleInputChange("pl_rade", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pl_bmasse">Planet Mass (M⊕)</Label>
                <Input
                  id="pl_bmasse"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 5.0"
                  value={formData.pl_bmasse ?? ""}
                  onChange={(e) =>
                    handleInputChange("pl_bmasse", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pl_orbper">Orbital Period (days)</Label>
                <Input
                  id="pl_orbper"
                  type="number"
                  step="0.001"
                  placeholder="e.g., 384.843"
                  value={formData.pl_orbper ?? ""}
                  onChange={(e) =>
                    handleInputChange("pl_orbper", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pl_orbsmax">Semi-Major Axis (AU)</Label>
                <Input
                  id="pl_orbsmax"
                  type="number"
                  step="0.001"
                  placeholder="e.g., 1.046"
                  value={formData.pl_orbsmax ?? ""}
                  onChange={(e) =>
                    handleInputChange("pl_orbsmax", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pl_eqt">Equilibrium Temperature (K)</Label>
                <Input
                  id="pl_eqt"
                  type="number"
                  step="1"
                  placeholder="e.g., 265"
                  value={formData.pl_eqt ?? ""}
                  onChange={(e) => handleInputChange("pl_eqt", e.target.value)}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Stellar Parameters</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="st_teff">Stellar Temperature (K)</Label>
                <Input
                  id="st_teff"
                  type="number"
                  step="1"
                  placeholder="e.g., 5757"
                  value={formData.st_teff ?? ""}
                  onChange={(e) => handleInputChange("st_teff", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="st_rad">Stellar Radius (R☉)</Label>
                <Input
                  id="st_rad"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 1.11"
                  value={formData.st_rad ?? ""}
                  onChange={(e) => handleInputChange("st_rad", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="st_mass">Stellar Mass (M☉)</Label>
                <Input
                  id="st_mass"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 1.04"
                  value={formData.st_mass ?? ""}
                  onChange={(e) => handleInputChange("st_mass", e.target.value)}
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
                  {result.label}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground text-sm">
                  Confidence
                </span>
                <span className="font-mono text-foreground">
                  {(result.probability * 100).toFixed(1)}%
                </span>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${result.probability * 100}%` }}
                  aria-label={`Confidence: ${(result.probability * 100).toFixed(
                    1
                  )}%`}
                />
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-muted-foreground text-sm">Rationale</span>
                <p className="text-foreground text-sm leading-relaxed">
                  {result.rationale}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
