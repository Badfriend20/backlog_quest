import type {
  BacklogData,
  CopyPlatform,
  Game,
  GameCopy,
  Platform,
} from "../../../shared/kernel/backlog";
import {
  copyDeviceIds,
  deviceLabel,
  deviceName,
  mergeQuickCopyPresets,
  normalize,
  quickCopyKey,
  resolveCopyPlatform,
} from "../../../shared/kernel/backlogSelectors";

const UNKNOWN_DEVICE = "Por confirmar";
const updatedMeta = (data: BacklogData) => ({ ...data.meta, updatedAt: new Date().toISOString() });

function preferredDevice(data: BacklogData, copy?: GameCopy) {
  const deviceId = copy ? copyDeviceIds(data, copy)[0] : undefined;
  return { deviceId, label: deviceId ? deviceName(data, deviceId) : (copy?.device ?? "") };
}

export function replaceGame(data: BacklogData, updated: Game): BacklogData {
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
    games: data.games.map(game => (game.id === updated.id ? updated : game)),
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

export function appendGame(data: BacklogData, game: Game): BacklogData {
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

export function replacePlatforms(data: BacklogData, platforms: Platform[]): BacklogData {
  const nextData = { ...data, platforms };
  const validIds = new Set(platforms.map(platform => platform.id));
  const syncCopy = (copy: GameCopy): GameCopy => {
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

export function replaceCopyPlatforms(
  data: BacklogData,
  platformDraft: CopyPlatform[]
): BacklogData {
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
  const platforms: CopyPlatform[] = [];
  const canonicalByName = new Map<string, CopyPlatform>();
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

  function syncCopy(copy: GameCopy): GameCopy {
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
