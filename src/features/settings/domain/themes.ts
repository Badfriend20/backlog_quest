import type { ThemeColors, ThemeId } from "../../../shared/kernel/backlog";

export interface ThemeDefinition {
  id: Exclude<ThemeId, "custom">;
  label: string;
  description: string;
  colors: ThemeColors;
}

export const THEMES: ThemeDefinition[] = [
  {
    id: "midnight",
    label: "Medianoche",
    description: "Oscuro con acentos violeta y cian.",
    colors: {
      background: "#0d0a17",
      panel: "#171126",
      panelAlt: "#211a35",
      border: "#443762",
      text: "#f4f0ff",
      muted: "#aaa0bd",
      primary: "#a673ff",
      accent: "#61e7ff",
      success: "#7effa2",
      warning: "#ffd56a",
      danger: "#ff6f7d",
    },
  },
  {
    id: "graphite",
    label: "Grafito",
    description: "Neutro, sobrio y de alto contraste.",
    colors: {
      background: "#111315",
      panel: "#1b1f23",
      panelAlt: "#252b31",
      border: "#47515b",
      text: "#f5f7f8",
      muted: "#a8b0b7",
      primary: "#9ba7b2",
      accent: "#77c7d9",
      success: "#76c893",
      warning: "#e9c46a",
      danger: "#ef767a",
    },
  },
  {
    id: "forest",
    label: "Bosque",
    description: "Oscuro con verdes naturales.",
    colors: {
      background: "#0b1512",
      panel: "#12231d",
      panelAlt: "#1a3028",
      border: "#355c4d",
      text: "#edf7f1",
      muted: "#9bb7aa",
      primary: "#67c587",
      accent: "#83d9c2",
      success: "#8ee3a5",
      warning: "#e8c66a",
      danger: "#f07f79",
    },
  },
  {
    id: "light",
    label: "Claro",
    description: "Fondos claros y controles definidos.",
    colors: {
      background: "#f4f6fb",
      panel: "#ffffff",
      panelAlt: "#e9edf5",
      border: "#b7c0d0",
      text: "#18202b",
      muted: "#5f6b7a",
      primary: "#7357c8",
      accent: "#087f9c",
      success: "#16834b",
      warning: "#a76600",
      danger: "#bd3343",
    },
  },
];

export function getThemeColors(theme: ThemeId, customTheme: ThemeColors): ThemeColors {
  return theme === "custom"
    ? customTheme
    : (THEMES.find(candidate => candidate.id === theme)?.colors ?? THEMES[0].colors);
}
