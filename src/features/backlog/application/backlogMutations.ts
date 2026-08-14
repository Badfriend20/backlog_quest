import type {
  QuestData,
  Channel,
  Activity,
  ActivityVariant,
  Resource,
} from "../../../shared/kernel/quest";
import {
  copyDeviceIds,
  deviceLabel,
  deviceName,
  mergeQuickCopyPresets,
  normalize,
  normalizeOwnershipDisplayRules,
  quickCopyKey,
  resolveCopyPlatform,
} from "../../../shared/kernel/questSelectors";
import type { OwnershipDisplayRules } from "../../../shared/kernel/quest";

const UNKNOWN_DEVICE = "Por confirmar";
const updatedMeta = (data: QuestData) => ({ ...data.meta, updatedAt: new Date().toISOString() });

function preferredDevice(data: QuestData, copy?: ActivityVariant) {
  const deviceId = copy ? copyDeviceIds(data, copy)[0] : undefined;
  return { deviceId, label: deviceId ? deviceName(data, deviceId) : (copy?.device ?? "") };
}

export function updateActivityPriority(
  data: QuestData,
  gameId: string,
  priority: string
): QuestData {
  if (!data.catalogs.priorities.some(item => item.label === priority)) return data;
  const game = data.games.find(item => item.id === gameId);
  if (!game || game.priority === priority) return data;
  return {
    ...data,
    meta: updatedMeta(data),
    games: data.games.map(item => (item.id === gameId ? { ...item, priority } : item)),
  };
}

export function removeGameContent(data: QuestData, gameId: string, contentId: string): QuestData {
  const game = data.games.find(item => item.id === gameId);
  const content = game?.contents.find(item => item.id === contentId);
  if (!game || !content) return data;
  return {
    ...data,
    meta: updatedMeta(data),
    games: data.games.map(item =>
      item.id === gameId
        ? {
            ...item,
            contents: item.contents.filter(candidate => candidate.id !== contentId),
            playthroughs: item.playthroughs.map(playthrough =>
              playthrough.contentId === contentId
                ? {
                    ...playthrough,
                    contentId: undefined,
                    contentTitle: playthrough.contentTitle ?? content.title,
                    contentType: playthrough.contentType ?? content.type,
                  }
                : playthrough
            ),
          }
        : item
    ),
    missions: data.missions.map(mission =>
      mission.gameId === gameId && mission.contentId === contentId
        ? {
            ...mission,
            contentId: "",
            contentTitle: mission.contentTitle || content.title,
            contentType: mission.contentType || content.type,
          }
        : mission
    ),
  };
}

export type MissionRelation = { kind: "copy"; id: string } | { kind: "playthrough"; id: string };

export function linkMissionRelation(
  data: QuestData,
  missionId: string,
  relation: MissionRelation
): QuestData {
  const mission = data.missions.find(item => item.id === missionId);
  const game = data.games.find(item => item.id === mission?.gameId);
  if (!mission || !game) return data;

  const playthrough =
    relation.kind === "playthrough"
      ? game.playthroughs.find(play => play.id === relation.id)
      : game.playthroughs.find(play => play.id === mission.playthroughId);
  const copyId = relation.kind === "copy" ? relation.id : playthrough?.copyId;
  const copy = game.copies.find(item => item.id === copyId);
  if (!copy || (relation.kind === "playthrough" && !playthrough)) return data;

  return {
    ...data,
    meta: updatedMeta(data),
    games: data.games.map(item =>
      item.id === game.id && playthrough
        ? {
            ...item,
            playthroughs: item.playthroughs.map(play =>
              play.id === playthrough.id
                ? { ...play, copyId: copy.id, platform: copy.library }
                : play
            ),
          }
        : item
    ),
    missions: data.missions.map(item =>
      item.id === mission.id
        ? {
            ...item,
            copyId: copy.id,
            playthroughId: relation.kind === "playthrough" ? relation.id : item.playthroughId,
            activeDevice:
              relation.kind === "playthrough" && playthrough?.device
                ? playthrough.device
                : item.activeDevice,
            activeDeviceId:
              relation.kind === "playthrough" ? playthrough?.deviceId : item.activeDeviceId,
          }
        : item
    ),
    queue: data.queue.map(item =>
      item.gameId === game.id
        ? {
            ...item,
            preferredCopyId: copy.id,
            preferredDevice:
              relation.kind === "playthrough" && playthrough?.device
                ? playthrough.device
                : item.preferredDevice,
            preferredDeviceId:
              relation.kind === "playthrough" ? playthrough?.deviceId : item.preferredDeviceId,
          }
        : item
    ),
  };
}

export function replaceGame(data: QuestData, updated: Activity): QuestData {
  const firstCopy = updated.copies[0];
  const fallback = preferredDevice(data, firstCopy);
  const validCopyIds = new Set(updated.copies.map(copy => copy.id));
  return {
    ...data,
    meta: updatedMeta(data),
    preferences: {
      ...data.preferences,
      quickCopyPresetsReady: true,
      quickCopyPresets: mergeQuickCopyPresets(
        data,
        data.preferences.quickCopyPresetsReady ? data.preferences.quickCopyPresets : [],
        updated.copies
      ),
    },
    games: data.games.map(game =>
      game.id === updated.id
        ? {
            ...updated,
            playthroughs: updated.playthroughs.map(playthrough => {
              const content = updated.contents.find(item => item.id === playthrough.contentId);
              return content
                ? {
                    ...playthrough,
                    contentTitle: content.title,
                    contentType: content.type,
                  }
                : playthrough;
            }),
          }
        : game
    ),
    missions: data.missions.map(mission => {
      if (mission.gameId !== updated.id) return mission;
      const content = updated.contents.find(item => item.id === mission.contentId);
      return content
        ? {
            ...mission,
            contentTitle: content.title,
            contentType: content.type,
          }
        : mission;
    }),
    queue: data.queue.map(item => {
      if (item.gameId !== updated.id) return item;
      if (item.preferredCopyId && validCopyIds.has(item.preferredCopyId)) return item;
      return {
        ...item,
        preferredCopyId: firstCopy?.id ?? null,
        preferredDevice: fallback.label,
        preferredDeviceId: fallback.deviceId,
      };
    }),
  };
}

export function appendGame(data: QuestData, game: Activity): QuestData {
  const firstCopy = game.copies[0];
  const fallback = preferredDevice(data, firstCopy);
  return {
    ...data,
    meta: updatedMeta(data),
    preferences: {
      ...data.preferences,
      quickCopyPresetsReady: true,
      quickCopyPresets: mergeQuickCopyPresets(
        data,
        data.preferences.quickCopyPresetsReady ? data.preferences.quickCopyPresets : [],
        game.copies
      ),
    },
    games: [...data.games, game],
    queue: [
      ...data.queue,
      {
        gameId: game.id,
        position: data.queue.length + 1,
        state: "queued",
        preferredCopyId: firstCopy?.id ?? null,
        preferredDevice: fallback.label,
        preferredDeviceId: fallback.deviceId,
        preferredSlotId: "flexible",
        replayIntent: "unknown",
        availableFrom: game.availableFrom,
        pinned: false,
        pinnedPosition: null,
        deferredAt: null,
        reason: game.notes,
      },
    ],
  };
}

export function removePlaythrough(
  data: QuestData,
  gameId: string,
  playthroughId: string
): QuestData {
  const game = data.games.find(item => item.id === gameId);
  if (!game?.playthroughs.some(play => play.id === playthroughId)) return data;
  return {
    ...data,
    meta: updatedMeta(data),
    games: data.games.map(item =>
      item.id === gameId
        ? {
            ...item,
            playthroughs: item.playthroughs.filter(play => play.id !== playthroughId),
          }
        : item
    ),
    missions: data.missions.map(mission =>
      mission.gameId === gameId && mission.playthroughId === playthroughId
        ? { ...mission, playthroughId: "" }
        : mission
    ),
  };
}

export function removeCopy(data: QuestData, gameId: string, copyId: string): QuestData {
  const game = data.games.find(item => item.id === gameId);
  if (!game?.copies.some(copy => copy.id === copyId)) return data;
  return {
    ...data,
    meta: updatedMeta(data),
    games: data.games.map(item =>
      item.id === gameId
        ? {
            ...item,
            copies: item.copies.filter(copy => copy.id !== copyId),
            playthroughs: item.playthroughs.map(play =>
              play.copyId === copyId ? { ...play, copyId: undefined } : play
            ),
          }
        : item
    ),
    missions: data.missions.map(mission =>
      mission.gameId === gameId && mission.copyId === copyId ? { ...mission, copyId: "" } : mission
    ),
    queue: data.queue.map(item =>
      item.gameId === gameId && item.preferredCopyId === copyId
        ? {
            ...item,
            preferredCopyId: null,
            preferredDevice: "",
            preferredDeviceId: undefined,
          }
        : item
    ),
  };
}

export function replacePlatforms(data: QuestData, platforms: Resource[]): QuestData {
  const nextData = { ...data, platforms };
  const validIds = new Set(platforms.map(platform => platform.id));
  const syncCopy = (copy: ActivityVariant): ActivityVariant => {
    const deviceIds = copyDeviceIds(nextData, copy).filter(id => validIds.has(id));
    return { ...copy, deviceIds, device: deviceLabel(nextData, deviceIds) };
  };
  const games = data.games.map(game => {
    const copies = game.copies.map(syncCopy);
    return {
      ...game,
      copies,
      playthroughs: game.playthroughs.map(play => {
        const selectedCopy = copies.find(copy => copy.id === play.copyId);
        const allowed = selectedCopy?.deviceIds ?? [];
        const deviceId = play.deviceId && validIds.has(play.deviceId) ? play.deviceId : allowed[0];
        return {
          ...play,
          deviceId,
          device: deviceId ? deviceName(nextData, deviceId) : UNKNOWN_DEVICE,
        };
      }),
    };
  });
  const missions = data.missions.map(mission => {
    const game = games.find(item => item.id === mission.gameId);
    const copy = game?.copies.find(item => item.id === mission.copyId);
    const deviceId =
      mission.activeDeviceId && validIds.has(mission.activeDeviceId)
        ? mission.activeDeviceId
        : copy?.deviceIds?.[0];
    return {
      ...mission,
      activeDeviceId: deviceId,
      activeDevice: deviceId ? deviceName(nextData, deviceId) : UNKNOWN_DEVICE,
    };
  });
  const queue = data.queue.map(item => {
    const game = games.find(candidate => candidate.id === item.gameId);
    const copy = game?.copies.find(candidate => candidate.id === item.preferredCopyId);
    const deviceId =
      item.preferredDeviceId && validIds.has(item.preferredDeviceId)
        ? item.preferredDeviceId
        : copy?.deviceIds?.[0];
    return {
      ...item,
      preferredDeviceId: deviceId,
      preferredDevice: deviceId ? deviceName(nextData, deviceId) : UNKNOWN_DEVICE,
    };
  });
  return {
    ...data,
    platforms,
    games,
    missions,
    queue,
    preferences: {
      ...data.preferences,
      quickCopyPresets: data.preferences.quickCopyPresets.map(preset => ({
        ...preset,
        deviceIds: preset.deviceIds.filter(id => validIds.has(id)),
      })),
    },
    meta: updatedMeta(data),
  };
}

export function replaceCopyPlatforms(data: QuestData, platformDraft: Channel[]): QuestData {
  const referencedIds = new Set([
    ...data.games.flatMap(game => game.copies.map(copy => copy.platformId).filter(Boolean)),
    ...data.preferences.quickCopyPresets.map(preset => preset.platformId).filter(Boolean),
  ]);
  const draftIds = new Set(platformDraft.map(platform => platform.id));
  const safeDraft = [
    ...platformDraft,
    ...data.catalogs.platforms.filter(
      platform => referencedIds.has(platform.id) && !draftIds.has(platform.id)
    ),
  ];
  const platforms: Channel[] = [];
  const canonicalByName = new Map<string, Channel>();
  const idMap = new Map<string, string>();

  for (const item of safeDraft) {
    const name = item.name.trim();
    if (!name) continue;
    const nameKey = normalize(name);
    const canonical = canonicalByName.get(nameKey);
    if (canonical) {
      idMap.set(item.id, canonical.id);
      continue;
    }
    const platform = { ...item, name };
    platforms.push(platform);
    canonicalByName.set(nameKey, platform);
    idMap.set(item.id, item.id);
  }

  function syncCopy(copy: ActivityVariant): ActivityVariant {
    const previous = resolveCopyPlatform(data.catalogs.platforms, copy.platformId, copy.library);
    const platformId = previous ? idMap.get(previous.id) : undefined;
    const platform = platforms.find(item => item.id === platformId);
    return platform ? { ...copy, platformId: platform.id, library: platform.name } : copy;
  }

  const games = data.games.map(game => {
    const copies = game.copies.map(syncCopy);
    return {
      ...game,
      copies,
      playthroughs: game.playthroughs.map(play => {
        const copy = copies.find(item => item.id === play.copyId);
        return copy ? { ...play, platform: copy.library } : play;
      }),
    };
  });
  const quickCopyPresets = data.preferences.quickCopyPresets.map(preset => {
    const previous = resolveCopyPlatform(
      data.catalogs.platforms,
      preset.platformId,
      preset.library
    );
    const platformId = previous ? idMap.get(previous.id) : undefined;
    const platform = platforms.find(item => item.id === platformId);
    if (!platform) return preset;
    return {
      ...preset,
      platformId: platform.id,
      library: platform.name,
      key: quickCopyKey(platform.name, preset.ownership, platform.id),
    };
  });

  return {
    ...data,
    meta: updatedMeta(data),
    catalogs: { ...data.catalogs, platforms },
    games,
    preferences: { ...data.preferences, quickCopyPresets },
  };
}

export function replaceOwnershipCatalog(
  data: QuestData,
  ownershipDraft: string[],
  displayRules: OwnershipDisplayRules
): QuestData {
  const seen = new Set<string>();
  const ownership = ownershipDraft
    .map(item => item.trim())
    .filter(item => {
      const key = normalize(item);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  const allowed = new Set(ownership.map(normalize));
  const ownershipDisplayRules = normalizeOwnershipDisplayRules(ownership, displayRules);

  return {
    ...data,
    meta: updatedMeta(data),
    catalogs: { ...data.catalogs, ownership },
    preferences: {
      ...data.preferences,
      ownershipDisplayRules,
      quickCopyPresets: data.preferences.quickCopyPresets.filter(preset =>
        allowed.has(normalize(preset.ownership))
      ),
    },
  };
}
