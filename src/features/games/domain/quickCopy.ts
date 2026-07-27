import type { GameCopy, QuickCopyPreset } from "../../../shared/kernel/backlog";
import { quickCopyKey } from "../../../shared/kernel/backlogSelectors";

export type QuickCopyPresetInput = Pick<
  QuickCopyPreset,
  | "platformId"
  | "library"
  | "ownership"
  | "deviceIds"
  | "priority"
  | "idealSession"
  | "crossCopyProgress"
  | "notes"
>;

export function createQuickCopyPreset(
  input: QuickCopyPresetInput,
  updatedAt = new Date().toISOString()
): QuickCopyPreset {
  const library = input.library.trim();
  return {
    ...input,
    library,
    key: quickCopyKey(library, input.ownership, input.platformId),
    status: "Disponible",
    updatedAt,
  };
}

export function createGameCopyFromPreset(
  preset: QuickCopyPreset,
  id: string,
  fallbackSession: string
): GameCopy {
  return {
    id,
    platformId: preset.platformId,
    library: preset.library,
    ownership: preset.ownership,
    deviceIds: [],
    device: "Por confirmar",
    status: preset.status || "Disponible",
    priority: preset.priority || "Media",
    idealSession: preset.idealSession || fallbackSession,
    crossCopyProgress: preset.crossCopyProgress || "unknown",
    notes: preset.notes || "",
  };
}
