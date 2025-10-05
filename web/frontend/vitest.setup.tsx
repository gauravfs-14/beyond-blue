import "@testing-library/jest-dom";
import React from "react";

// Minimal Next.js mocks for components/hooks used in tests
vi.mock("next/navigation", () => {
  return {
    useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
    useSearchParams: () => new URLSearchParams(),
  };
});

vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: any) =>
    React.createElement(
      "a",
      { href: typeof href === "string" ? href : "#", ...rest },
      children
    ),
}));

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return React.createElement("img", {
      alt: props.alt,
      src: props.src,
      ...props,
    });
  },
}));

// Minimal EventSource mock for jsdom
class EventSourceMock {
  url: string;
  withCredentials = false;
  onmessage: ((this: EventSource, ev: MessageEvent) => any) | null = null;
  onerror: ((this: EventSource, ev: Event) => any) | null = null;
  onopen: ((this: EventSource, ev: Event) => any) | null = null;
  readyState = 0;
  constructor(url: string) {
    this.url = url;
  }
  close() {
    this.readyState = 2;
  }
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent(): boolean {
    return true;
  }
}

// @ts-ignore
globalThis.EventSource = (globalThis.EventSource || EventSourceMock) as any;
