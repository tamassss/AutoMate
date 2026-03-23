import { describe, expect, it } from "vitest";
import { hasValue } from "./valueChecks";

describe("hasValue", function() {
  it("true-t ad vissza normál szövegre", function() {
    expect(hasValue("abc")).toBe(true);
  });

  it("false-t ad vissza undefined-re", function() {
    expect(hasValue(undefined)).toBe(false);
  });

  it("false-t ad vissza null-ra", function() {
    expect(hasValue(null)).toBe(false);
  });

  it("false-t ad vissza üres stringre", function() {
    expect(hasValue("")).toBe(false);
  });

  it("true-t ad vissza 0-ra", function() {
    expect(hasValue(0)).toBe(true);
  });
});
