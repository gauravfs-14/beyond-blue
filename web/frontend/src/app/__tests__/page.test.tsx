import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HomePage from "@/app/page";

describe("Home page", () => {
  it("renders hero content", async () => {
    // HomePage is likely a server component returning JSX; handle possible Promise
    const node = await (HomePage() as any);
    const { getAllByText } = render(node);
    expect(getAllByText(/Beyond Blue/i).length).toBeGreaterThan(0);
  });
});
