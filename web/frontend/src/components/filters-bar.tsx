"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, X, Search } from "lucide-react";
import type { FilterOptions } from "@/lib/types";

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
    const emptyFilters: FilterOptions = { limit: filters.limit };
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
      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search Input */}
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

        {/* Disposition Filter */}
        <div className="flex items-center gap-2">
          <Label className="text-muted-foreground text-sm">Status:</Label>
          <Select
            value={filters.disposition || "all"}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                disposition: value as
                  | "all"
                  | "confirmed"
                  | "false_positive"
                  | "candidate",
              })
            }
          >
            <SelectTrigger className="w-[140px] border-border/50 bg-background/50 shadow-sm backdrop-blur-sm">
              <SelectValue placeholder="All planets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All planets</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="candidate">Candidate</SelectItem>
              <SelectItem value="false_positive">False Positive</SelectItem>
            </SelectContent>
          </Select>
        </div>
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

            {/* Pagination Controls */}
            <div className="space-y-3">
              <Label className="font-medium text-sm">Results per page</Label>
              <Select
                value={localFilters.limit?.toString() || "50"}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    limit: Number(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="200">200</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Discovery Method */}
            <div className="space-y-3">
              <Label className="font-medium text-sm">Discovery Method</Label>
              <div className="space-y-2">
                <div className="text-muted-foreground text-sm">
                  Discovery method filtering will be available in future
                  updates.
                </div>
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

            {/* Distance from Earth Range */}
            <div className="space-y-3">
              <Label className="font-medium text-sm">
                Distance from Earth (light-years)
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={localFilters.sy_dist?.min || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      sy_dist: {
                        ...localFilters.sy_dist,
                        min: Number(e.target.value) || undefined,
                      },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={localFilters.sy_dist?.max || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      sy_dist: {
                        ...localFilters.sy_dist,
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
