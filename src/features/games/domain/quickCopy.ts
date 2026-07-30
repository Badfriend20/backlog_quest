import type { ActivityVariant, QuickVariantPreset } from "../../../shared/kernel/quest";
import { quickCopyKey } from "../../../shared/kernel/questSelectors";

export type QuickCopyPresetInput = Pick<
  QuickVariantPreset,
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
): QuickVariantPreset {
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
  preset: QuickVariantPreset,
  id: string,
  fallbackSession: string
): ActivityVariant {
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
