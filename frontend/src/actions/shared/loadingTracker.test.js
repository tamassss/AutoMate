import { beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(function() {
  vi.resetModules();
  globalThis.window = {
    fetch: vi.fn(),
    __automateFetchPatched: false,
  };
});

describe("subscribeLoading", function() {
  it("immediately notifies with the current pending count", async function() {
    const { subscribeLoading } = await import("./loadingTracker");
    const listener = vi.fn();

    const unsubscribe = subscribeLoading(listener);

    expect(listener).toHaveBeenCalledWith(0);
    unsubscribe();
  });
});

describe("installFetchLoadingTracker", function() {
  it("wraps fetch and notifies listeners before and after the request", async function() {
    const originalFetch = vi.fn().mockResolvedValue({ ok: true });
    globalThis.window.fetch = originalFetch;

    const { installFetchLoadingTracker, subscribeLoading } = await import("./loadingTracker");
    const calls = [];
    const unsubscribe = subscribeLoading(function(count) {
      calls.push(count);
    });

    installFetchLoadingTracker();
    await window.fetch("/test");

    expect(originalFetch).toHaveBeenCalledWith("/test");
    expect(calls).toEqual([0, 1, 0]);
    unsubscribe();
  });

  it("patches fetch only once", async function() {
    const originalFetch = vi.fn().mockResolvedValue({ ok: true });
    globalThis.window.fetch = originalFetch;

    const { installFetchLoadingTracker } = await import("./loadingTracker");

    installFetchLoadingTracker();
    const firstPatchedFetch = window.fetch;
    installFetchLoadingTracker();

    expect(window.fetch).toBe(firstPatchedFetch);
  });
});
