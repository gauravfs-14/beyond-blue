"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PlanetCard } from "@/components/planet-card";
import { FiltersBar } from "@/components/filters-bar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { filterPlanets, sortPlanets } from "@/lib/utils/planet-utils";
import { fetchPlanetsWithFilters } from "@/lib/utils/api-service";
import type { FilterOptions, SortOption, Planet } from "@/lib/types";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface ExploreClientProps {
  initialPlanets: Planet[];
  currentPage: number;
  limit: number;
}

export function ExploreClient({
  initialPlanets,
  currentPage,
  limit,
}: ExploreClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterOptions>({ limit });
  const [sort, setSort] = useState<SortOption>({
    field: "pl_name",
    direction: "asc",
  });
  const [planets, setPlanets] = useState<Planet[]>(initialPlanets);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch planets when filters change
  useEffect(() => {
    // Only fetch from API if we have active filters
    const hasActiveFilters =
      (filters.disposition && filters.disposition !== "all") ||
      !!filters.search ||
      !!filters.sy_dist ||
      !!filters.limit;

    if (!hasActiveFilters) {
      // Reset to initial planets when no filters are applied
      setPlanets(initialPlanets);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchPlanetsWithFilters({
          ...filters,
          limit: filters.limit || 50,
          skip: (currentPage - 1) * (filters.limit || 50),
        });

        setPlanets(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch planets"
        );
        console.error("Error fetching planets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, currentPage, initialPlanets]);

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    if (filters.limit) params.set("limit", String(filters.limit));
    router.push(`/explore?${params.toString()}`);
  };

  const filteredAndSortedPlanets = useMemo(() => {
    // If we have API-based filters, use the fetched planets directly
    if (filters.disposition || filters.search) {
      return sortPlanets(planets, sort);
    }

    // Otherwise, fall back to client-side filtering for legacy filters
    const filtered = filterPlanets(planets, filters);
    return sortPlanets(filtered, sort);
  }, [planets, filters, sort]);

  // Check if we have more data available for pagination
  const hasMoreData = planets.length === (filters.limit || 50);

  return (
    <div className="space-y-4">
      <FiltersBar filters={filters} onFiltersChange={setFilters} />

      <div className="flex items-center justify-between gap-4">
        <div className="text-muted-foreground text-sm">
          Showing {filteredAndSortedPlanets.length} planets on page{" "}
          {currentPage}
          {hasMoreData && " (more available)"}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-sm">Sort by:</span>
          <Select
            value={`${sort.field}-${sort.direction}`}
            onValueChange={(value) => {
              const [field, direction] = value.split("-");
              setSort({
                field: field as keyof Planet,
                direction: direction as "asc" | "desc",
              });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pl_name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="pl_name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="disc_year-desc">Year (Newest)</SelectItem>
              <SelectItem value="disc_year-asc">Year (Oldest)</SelectItem>
              <SelectItem value="pl_rade-desc">Radius (Largest)</SelectItem>
              <SelectItem value="pl_rade-asc">Radius (Smallest)</SelectItem>
              <SelectItem value="sy_dist-asc">Distance (Nearest)</SelectItem>
              <SelectItem value="sy_dist-desc">Distance (Farthest)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground text-lg">Loading planets...</p>
          </div>
        ) : error ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border p-12 text-center">
            <p className="text-destructive text-lg">Error: {error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        ) : filteredAndSortedPlanets.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground text-lg">
              No planets match your filters
            </p>
            <Button variant="outline" onClick={() => setFilters({})}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedPlanets.map((planet) => (
              <PlanetCard key={planet._id} planet={planet} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-4 pt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => updatePage(currentPage - 1)}
          disabled={currentPage <= 1 || loading}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">
            Page {currentPage}
            {filters.limit && (
              <span className="text-muted-foreground text-xs">
                {" "}
                ({filters.limit} per page)
              </span>
            )}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => updatePage(currentPage + 1)}
          disabled={!hasMoreData || loading}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
