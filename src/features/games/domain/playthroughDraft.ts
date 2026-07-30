import type { QuestData, Activity, Journey } from "../../../shared/kernel/quest";
import { copyDeviceIds, deviceName } from "../../../shared/kernel/questSelectors";

const UNKNOWN_LABEL = "Por confirmar";

export function createPlaythroughDraft(
  data: QuestData,
  game: Activity,
  {
    id,
    preferredCopyId,
    contentId,
    startedAt = null,
  }: {
    id: string;
    preferredCopyId?: string;
    contentId?: string;
    startedAt?: string | null;
  }
): Journey | undefined {
  const copy = game.copies.find(item => item.id === preferredCopyId) ?? game.copies[0];
  const content = game.contents.find(item => item.id === contentId) ?? game.contents[0];
  if (!copy || !content) return undefined;
  const deviceId = copyDeviceIds(data, copy)[0];
  return {
    id,
    number: Math.max(0, ...game.playthroughs.map(item => item.number)) + 1,
    platform: copy.library || UNKNOWN_LABEL,
    device: deviceId ? deviceName(data, deviceId) : UNKNOWN_LABEL,
    deviceId,
    status: contentId ? "En curso" : "Pendiente",
    startedAt,
    finishedAt: null,
    notes: "",
    contentId: content.id,
    contentTitle: content.title,
    contentType: content.type,
    copyId: copy.id,
  };
}
