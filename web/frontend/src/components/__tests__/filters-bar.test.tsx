import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { FiltersBar } from "@/components/filters-bar";

describe("FiltersBar", () => {
  it("calls onFiltersChange on search input", async () => {
    const onFiltersChange = vi.fn();
    const { getByPlaceholderText } = render(
      <FiltersBar filters={{ limit: 20 }} onFiltersChange={onFiltersChange} />
    );
    const input = getByPlaceholderText(/Search planets/i) as HTMLInputElement;
    const user = userEvent.setup();
    await user.type(input, "Kepler");
    expect(onFiltersChange).toHaveBeenCalled();
  });
});
