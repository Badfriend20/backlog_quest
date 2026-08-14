import type { QuestData, Resource } from "../../../shared/kernel/quest";
import { copyDeviceIds, nextGeneratedId } from "../../../shared/kernel/questSelectors";

export function createDevice(platforms: Resource[]): Resource {
  return {
    id: nextGeneratedId(
      "D",
      platforms.map(platform => platform.id)
    ),
    name: "",
    kind: "device",
    active: true,
    priority: "Media",
    notes: "",
  };
}

export function deviceUsageCount(data: QuestData, deviceId: string): number {
  const copyReferences = data.games
    .flatMap(game => game.copies)
    .filter(copy => copyDeviceIds(data, copy).includes(deviceId)).length;
  const playthroughReferences = data.games
    .flatMap(game => game.playthroughs)
    .filter(playthrough => playthrough.deviceId === deviceId).length;
  const missionReferences = data.missions.filter(
    mission => mission.activeDeviceId === deviceId
  ).length;

  return copyReferences + playthroughReferences + missionReferences;
}

export function saveDevice(platforms: Resource[], draft: Resource): Resource[] {
  const device = {
    ...draft,
    name: draft.name.trim() || "Dispositivo sin nombre",
    kind: draft.kind.trim() || "device",
    notes: draft.notes.trim(),
  };
  const index = platforms.findIndex(platform => platform.id === device.id);

  if (index < 0) return [...platforms, device];
  return platforms.map(platform => (platform.id === device.id ? device : platform));
}

export function removeUnusedDevice(data: QuestData, deviceId: string): Resource[] | undefined {
  if (deviceUsageCount(data, deviceId) > 0) return undefined;
  return data.platforms.filter(platform => platform.id !== deviceId);
}
