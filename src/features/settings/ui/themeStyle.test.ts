import { describe, expect, it } from "vitest";
import type { ThemeColors } from "../../../shared/kernel/backlog";
import { THEMES } from "../domain/themes";
import { themeStyle } from "./themeStyle";

const unusedCustomTheme = {} as ThemeColors;

describe("tema claro", () => {
  it("declara controles claros y el esquema nativo correcto", () => {
    const light = THEMES.find(theme => theme.id === "light")!;
    const style = themeStyle("light", unusedCustomTheme) as Record<string, string>;

    expect(style.colorScheme).toBe("light");
    expect(style["--input"]).toBe(light.colors.panel);
    expect(style["--input-text"]).toBe(light.colors.text);
  });
});
