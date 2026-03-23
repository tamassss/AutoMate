import { beforeEach, describe, expect, it, vi } from "vitest";
import { estimateRoute } from "./routeEstimateActions";
import { createJsonResponse, createLocalStorageMock, getLastFetchBody } from "../shared/testHelpers";

beforeEach(function() {
  globalThis.localStorage = createLocalStorageMock({ token: "secret-token" });
  globalThis.window = { location: { href: "/" } };
  globalThis.fetch = vi.fn();
});

describe("estimateRoute", function() {
  it("posts route estimate input and returns backend data", async function() {
    fetch.mockResolvedValue(createJsonResponse({ distance_km: 144 }));

    await expect(estimateRoute("Budapest", "Gyor", 6.5)).resolves.toEqual({ distance_km: 144 });
    expect(getLastFetchBody()).toEqual({
      from_text: "Budapest",
      to_text: "Gyor",
      avg_consumption: 6.5,
    });
  });
});
