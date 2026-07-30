import { describe, expect, it } from "vitest";
import { CARD_SURFACE_BACKGROUND } from "./Primitives";

describe("superficie compartida de tarjetas", () => {
  it("usa exclusivamente el token temático de panel", () => {
    expect(CARD_SURFACE_BACKGROUND).toBe("var(--panel)");
    expect(CARD_SURFACE_BACKGROUND).not.toMatch(/#[0-9a-f]{3,8}/i);
    expect(CARD_SURFACE_BACKGROUND).not.toContain("gradient");
  });
});
