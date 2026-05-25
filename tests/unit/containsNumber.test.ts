import { describe, it, expect } from "vitest";
import { containsNumber } from "~/utils/validation-rules";

describe("containsNumber custom rule", () => {
  it("returns true for values containing a digit", () => {
    const result = containsNumber.validator("abc1");
    expect(result).toBe(true);
  });

  it("returns false for values without any digit", () => {
    const result = containsNumber.validator("abcdef");
    expect(result).toBe(false);
  });

  it("returns true for empty string (delegates to required rule)", () => {
    const result = containsNumber.validator("");
    expect(result).toBe(true);
  });

  it("returns true for null (delegates to required rule)", () => {
    const result = containsNumber.validator(null);
    expect(result).toBe(true);
  });

  it("returns true for undefined (delegates to required rule)", () => {
    const result = containsNumber.validator(undefined);
    expect(result).toBe(true);
  });
});
