import { describe, expect, it } from "vitest";
import type { ThemeColors } from "../../../shared/kernel/quest";
import { THEMES } from "../domain/themes";
import { themeStyle } from "./themeStyle";

const unusedCustomTheme = {} as ThemeColors;

function relativeLuminance(hex: string): number {
  const channels = hex
    .replace("#", "")
    .match(/.{2}/g)!
    .map(channel => Number.parseInt(channel, 16) / 255)
    .map(channel =>
      channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4)
    );
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrastRatio(left: string, right: string): number {
  const luminances = [relativeLuminance(left), relativeLuminance(right)].sort((a, b) => b - a);
  return (luminances[0] + 0.05) / (luminances[1] + 0.05);
}

describe("tema claro", () => {
  it("declara controles claros y el esquema nativo correcto", () => {
    const light = THEMES.find(theme => theme.id === "light")!;
    const style = themeStyle("light", unusedCustomTheme) as Record<string, string>;

    expect(style.colorScheme).toBe("light");
    expect(style.color).toBe(light.colors.text);
    expect(style["--input"]).toBe(light.colors.panel);
    expect(style["--input-text"]).toBe(light.colors.text);
    expect(style["--primary-text"]).toBe("#ffffff");
  });

  it("mantiene el texto de acento por encima del contraste AA", () => {
    const light = THEMES.find(theme => theme.id === "light")!;

    expect(contrastRatio(light.colors.accent, light.colors.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(light.colors.accent, light.colors.panel)).toBeGreaterThanOrEqual(4.5);
  });

  it("expone colores editables para el contenedor y la barra lateral", () => {
    const custom = {
      background: "#010101",
      container: "#020202",
      sidebar: "#030303",
      panel: "#040404",
      panelAlt: "#050505",
      border: "#060606",
      text: "#fefefe",
      muted: "#aaaaaa",
      primary: "#7000ff",
      accent: "#00ffff",
      success: "#00ff00",
      warning: "#ffff00",
      danger: "#ff0000",
    } as ThemeColors;

    const style = themeStyle("custom", custom) as Record<string, string>;

    expect(style["--container"]).toBe(custom.container);
    expect(style["--sidebar"]).toBe(custom.sidebar);
  });
});
