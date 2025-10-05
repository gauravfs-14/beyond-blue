"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, X, Search } from "lucide-react";
import type { FilterOptions } from "@/lib/types";
// import { discoveryMethods, habitableZones } from "@/lib/utils/constants";

interface FiltersBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export function FiltersBar({ filters, onFiltersChange }: FiltersBarProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
  };

  const handleReset = () => {
    const emptyFilters: FilterOptions = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const activeFilterCount = Object.keys(filters).filter((key) => {
    const value = filters[key as keyof FilterOptions];
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object") return Object.keys(value).length > 0;
    return value !== undefined && value !== "";
  }).length;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/50 bg-card/50 p-6 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search planets or host stars..."
          value={filters.search || ""}
          onChange={(e) =>
            onFiltersChange({ ...filters, search: e.target.value })
          }
          className="max-w-md border-border/50 bg-background/50 pl-10 shadow-sm backdrop-blur-sm transition-smooth focus:border-primary/50"
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="default"
            className="border-border/50 bg-background/50 shadow-sm backdrop-blur-sm transition-smooth hover:border-primary/50"
          >
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-sm">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80 border-border/50 bg-card/95 shadow-xl backdrop-blur-xl"
          align="end"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-base">Advanced Filters</h4>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <X className="mr-1 h-3 w-3" />
                Reset
              </Button>
            </div>

            {/* Discovery Method */}
            <div className="space-y-3">
              <Label className="font-medium text-sm">Discovery Method</Label>
              <div className="space-y-2">
                {/* {discoveryMethods.map((method: string) => (
                  <div key={method} className="flex items-center space-x-2">
                    <Checkbox
                      id={`method-${method}`}
                      checked={
                        localFilters.discoverymethod?.includes(method) || false
                      }
                      onCheckedChange={(checked) => {
                        const current = localFilters.discoverymethod || [];
                        const updated = checked
                          ? [...current, method]
                          : current.filter((m) => m !== method);
                        setLocalFilters({
                          ...localFilters,
                          discoverymethod: updated,
                        });
                      }}
                    />
                    <label
                      htmlFor={`method-${method}`}
                      className="cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {method}
                    </label>
                  </div>
                ))} */}
              </div>
            </div>

            {/* Habitable Zone */}
            <div className="space-y-3">
              <Label className="font-medium text-sm">Habitable Zone</Label>
              <div className="space-y-2">
                {/* {habitableZones.map((zone: string) => (
                  <div key={zone} className="flex items-center space-x-2">
                    <Checkbox
                      id={`zone-${zone}`}
                      checked={
                        localFilters.habitableZone?.includes(zone) || false
                      }
                      onCheckedChange={(checked) => {
                        const current = localFilters.habitableZone || [];
                        const updated = checked
                          ? [...current, zone]
                          : current.filter((z) => z !== zone);
                        setLocalFilters({
                          ...localFilters,
                          habitableZone: updated,
                        });
                      }}
                    />
                    <label
                      htmlFor={`zone-${zone}`}
                      className="cursor-pointer text-sm capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {zone}
                    </label>
                  </div>
                ))} */}
              </div>
            </div>

            {/* Discovery Year Range */}
            <div className="space-y-3">
              <Label className="font-medium text-sm">Discovery Year</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={localFilters.disc_year?.min || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      disc_year: {
                        ...localFilters.disc_year,
                        min: Number(e.target.value) || undefined,
                      },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={localFilters.disc_year?.max || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      disc_year: {
                        ...localFilters.disc_year,
                        max: Number(e.target.value) || undefined,
                      },
                    })
                  }
                />
              </div>
            </div>

            <Button onClick={handleApply} className="w-full">
              Apply Filters
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
