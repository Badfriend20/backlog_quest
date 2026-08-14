import { describe, expect, it } from "vitest";
import { recommendationMoveOptions } from "./recommendationMove";

describe("destinos para mover recomendaciones", () => {
  it.each([
    [30, [15, 20, 30]],
    [5, [3, 4, 5]],
    [2, [1, 2, 2]],
    [1, [1, 1, 1]],
  ])("calcula destinos continuos para una lista de %i elementos", (length, positions) => {
    expect(recommendationMoveOptions(length, 0).map(option => option.position)).toEqual(positions);
  });

  it("deshabilita destinos iguales o anteriores a la posición actual", () => {
    expect(recommendationMoveOptions(30, 22).map(option => option.disabled)).toEqual([
      true,
      true,
      false,
    ]);
  });

  it("deshabilita todos los destinos cuando el elemento ya está al final", () => {
    expect(recommendationMoveOptions(7, 7).every(option => option.disabled)).toBe(true);
  });
});
