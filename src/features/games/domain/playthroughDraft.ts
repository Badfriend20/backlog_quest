import type { BacklogData, Game, Playthrough } from "../../../shared/kernel/backlog";
import { copyDeviceIds, deviceName } from "../../../shared/kernel/backlogSelectors";

const UNKNOWN_LABEL = "Por confirmar";

export function createPlaythroughDraft(
  data: BacklogData,
  game: Game,
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
): Playthrough | undefined {
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
    status: contentId ? "Jugando" : "Pendiente",
    startedAt,
    finishedAt: null,
    notes: "",
    contentId: content.id,
    contentTitle: content.title,
    contentType: content.type,
    copyId: copy.id,
  };
}
