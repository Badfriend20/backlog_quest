import type { CSSProperties } from "react";
import type { ThemeColors, ThemeId } from "../../../shared/kernel/quest";
import { getThemeColors } from "../domain/themes";

function relativeLuminance(hex: string): number {
  const channels = hex
    .replace("#", "")
    .match(/.{2}/g)
    ?.map(channel => Number.parseInt(channel, 16) / 255)
    .map(channel =>
      channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4)
    );
  if (!channels || channels.length !== 3) return 0;
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrastRatio(left: string, right: string): number {
  const leftLum = relativeLuminance(left);
  const rightLum = relativeLuminance(right);
  return (Math.max(leftLum, rightLum) + 0.05) / (Math.min(leftLum, rightLum) + 0.05);
}

function primaryTextColor(background: string): string {
  return contrastRatio(background, "#ffffff") >= contrastRatio(background, "#140b22")
    ? "#ffffff"
    : "#140b22";
}

export function themeStyle(theme: ThemeId, customTheme: ThemeColors): CSSProperties {
  const colors = getThemeColors(theme, customTheme);
  const colorScheme = theme === "light" ? "light" : "dark";
  return {
    colorScheme,
    color: colors.text,
    "--bg": colors.background,
    "--container": colors.container,
    "--sidebar": colors.sidebar,
    "--panel": colors.panel,
    "--panel-2": colors.panelAlt,
    "--panel-3": colors.panelAlt,
    "--border": colors.border,
    "--text": colors.text,
    "--muted": colors.muted,
    "--input": colors.panel,
    "--input-text": colors.text,
    "--purple": colors.primary,
    "--primary-text": primaryTextColor(colors.primary),
    "--purple-2": colors.primary,
    "--pink": colors.primary,
    "--cyan": colors.accent,
    "--green": colors.success,
    "--yellow": colors.warning,
    "--orange": colors.warning,
    "--red": colors.danger,
  } as CSSProperties;
}
