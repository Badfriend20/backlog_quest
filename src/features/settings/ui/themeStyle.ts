import type { CSSProperties } from "react";
import type { ThemeColors, ThemeId } from "../../../shared/kernel/backlog";
import { getThemeColors } from "../domain/themes";

export function themeStyle(theme: ThemeId, customTheme: ThemeColors): CSSProperties {
  const colors = getThemeColors(theme, customTheme);
  const colorScheme = theme === "light" ? "light" : "dark";
  return {
    colorScheme,
    "--bg": colors.background,
    "--panel": colors.panel,
    "--panel-2": colors.panelAlt,
    "--panel-3": colors.panelAlt,
    "--border": colors.border,
    "--text": colors.text,
    "--muted": colors.muted,
    "--input": colors.panel,
    "--input-text": colors.text,
    "--purple": colors.primary,
    "--purple-2": colors.primary,
    "--pink": colors.primary,
    "--cyan": colors.accent,
    "--green": colors.success,
    "--yellow": colors.warning,
    "--orange": colors.warning,
    "--red": colors.danger,
  } as CSSProperties;
}
