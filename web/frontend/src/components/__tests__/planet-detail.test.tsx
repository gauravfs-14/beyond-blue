import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PlanetDetail } from "@/components/planet-detail";

const planet = {
  _id: "p1",
  pl_name: "TRAPPIST-1 e",
  hostname: "TRAPPIST-1",
  disc_year: 2017,
  habitableZone: "habitable",
  images: ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
} as any;

describe("PlanetDetail", () => {
  it("renders header and gallery", () => {
    const { getByText, getByRole } = render(<PlanetDetail planet={planet} />);
    expect(getByText("TRAPPIST-1 e")).toBeInTheDocument();
    // Gallery dots or next/prev imply carousel rendered
    expect(getByRole("button", { name: /Next image/i })).toBeInTheDocument();
  });
});
