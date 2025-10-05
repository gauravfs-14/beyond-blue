"use client";

import { useState, useMemo } from "react";
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
import type { FilterOptions, SortOption, Planet } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sort, setSort] = useState<SortOption>({
    field: "pl_name",
    direction: "asc",
  });

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/explore?${params.toString()}`);
  };

  const filteredAndSortedPlanets = useMemo(() => {
    const filtered = filterPlanets(initialPlanets, filters);
    return sortPlanets(filtered, sort);
  }, [initialPlanets, filters, sort]);

  // Check if we have more data available for pagination
  const hasMoreData = initialPlanets.length === limit;

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
        {filteredAndSortedPlanets.length === 0 ? (
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
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">
            Page {currentPage}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => updatePage(currentPage + 1)}
          disabled={!hasMoreData}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
