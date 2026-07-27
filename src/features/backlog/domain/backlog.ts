import type {
  ActivityItem,
  BacklogData,
  CompletionFormValue,
  Game,
  MissionFormValue,
  QueueItem,
  QueueState,
} from "../../../shared/kernel/backlog";
import { nextGeneratedId, normalize } from "../../../shared/kernel/backlogSelectors";

function nowIso(): string {
  return new Date().toISOString();
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function touch(data: BacklogData): BacklogData {
  const queue = data.queue.map(item => {
    if (!["queued", "blocked"].includes(item.state)) return item;
    const game = data.games.find(candidate => candidate.id === item.gameId);
    if (!game?.dependencies.length)
      return item.state === "blocked" ? { ...item, state: "queued" as const } : item;
    const unresolved = game.dependencies.some(dependencyId => {
      const dependency = data.games.find(candidate => candidate.id === dependencyId);
      return dependency && !["Terminado", "Completado"].includes(dependency.status);
    });
    return { ...item, state: unresolved ? ("blocked" as const) : ("queued" as const) };
  });
  return { ...data, queue, meta: { ...data.meta, updatedAt: nowIso() } };
}

function withActivity(data: BacklogData, item: Omit<ActivityItem, "id" | "at">): BacklogData {
  const activity: ActivityItem = {
    id: nextGeneratedId(
      "A",
      data.activityLog.map(item => item.id)
    ),
    at: nowIso(),
    ...item,
  };
  return {
    ...data,
    activityLog: [activity, ...data.activityLog].slice(0, 200),
  };
}

function applyPinnedPositions(queue: QueueItem[]): QueueItem[] {
  const sorted = [...queue].sort((a, b) => a.position - b.position);
  const pinned = sorted
    .filter(item => item.pinned && item.pinnedPosition)
    .sort((a, b) => (a.pinnedPosition ?? 9999) - (b.pinnedPosition ?? 9999));
  const free = sorted.filter(item => !item.pinned || !item.pinnedPosition);
  const result: QueueItem[] = [];
  let freeIndex = 0;
  for (let position = 1; position <= sorted.length; position += 1) {
    const pinnedItem = pinned.find(item => item.pinnedPosition === position);
    result.push(pinnedItem ?? free[freeIndex++]);
  }
  while (freeIndex < free.length) result.push(free[freeIndex++]);
  return result.filter(Boolean).map((item, index) => ({ ...item, position: index + 1 }));
}

function moveQueue(
  queue: QueueItem[],
  gameId: string,
  targetPosition: number,
  state: QueueState,
  patch: Partial<QueueItem> = {}
): QueueItem[] {
  const ordered = [...queue].sort((a, b) => a.position - b.position);
  const existing = ordered.find(item => item.gameId === gameId);
  if (!existing) return ordered;
  const without = ordered.filter(item => item.gameId !== gameId);
  const target = Math.max(1, Math.min(targetPosition, without.length + 1));
  without.splice(target - 1, 0, { ...existing, ...patch, state, position: target });
  return applyPinnedPositions(without.map((item, index) => ({ ...item, position: index + 1 })));
}

function updateGame(data: BacklogData, gameId: string, updater: (game: Game) => Game): BacklogData {
  return { ...data, games: data.games.map(game => (game.id === gameId ? updater(game) : game)) };
}

function queuePosition(data: BacklogData, gameId: string): number {
  return data.queue.find(item => item.gameId === gameId)?.position ?? data.queue.length;
}

function replayQueueState(intent: CompletionFormValue["replayIntent"]): QueueState {
  if (intent === "yes") return "replay";
  if (intent === "maybe") return "replay-later";
  return "archived";
}

function replayTarget(intent: CompletionFormValue["replayIntent"], length: number): number {
  if (intent === "yes") return Math.ceil(length / 2);
  if (intent === "maybe") return Math.ceil(length * 0.75);
  return length;
}

function replayReason(intent: CompletionFormValue["replayIntent"]): string {
  if (intent === "yes") return "Terminado; marcado para rejugada futura.";
  if (intent === "maybe") return "Terminado; quizá se rejuegue más adelante.";
  return "Terminado; sin intención actual de rejugarlo.";
}

function activeGameStatus(contentType: MissionFormValue["contentType"], slotId: string): string {
  if (contentType === "replay") return "Rejugando";
  if (slotId === "secondary") return "Jugando secundario";
  return "Jugando";
}

function setMissionPausedState(
  data: BacklogData,
  missionId: string,
  missionStatus: "paused" | "deferred" | "abandoned",
  gameStatus: string,
  queueState: QueueState,
  targetPosition: number,
  description: string
): BacklogData {
  const mission = data.missions.find(item => item.id === missionId);
  if (!mission) return data;
  const game = data.games.find(item => item.id === mission.gameId);
  if (!game) return data;
  let next = {
    ...data,
    missions: data.missions.map(item =>
      item.id === missionId
        ? {
            ...item,
            status: missionStatus,
            finishedAt: missionStatus === "abandoned" ? today() : null,
          }
        : item
    ),
    scheduleRules: data.scheduleRules.filter(rule => rule.missionId !== missionId),
    queue: moveQueue(data.queue, mission.gameId, targetPosition, queueState, {
      preferredCopyId: mission.copyId,
      preferredDevice: mission.activeDevice,
      preferredDeviceId: mission.activeDeviceId,
      preferredSlotId: mission.slotId,
      deferredAt: missionStatus === "deferred" ? today() : null,
      reason: description,
    }),
  };
  next = updateGame(next, mission.gameId, current => ({
    ...current,
    status: gameStatus,
    copies: current.copies.map(copy =>
      copy.id === mission.copyId
        ? { ...copy, status: missionStatus === "abandoned" ? "Disponible" : "Pausado" }
        : copy
    ),
    contents: current.contents.map(content =>
      content.id === mission.contentId
        ? { ...content, status: missionStatus === "abandoned" ? "abandoned" : "paused" }
        : content
    ),
    playthroughs: current.playthroughs.map(play =>
      play.id === mission.playthroughId
        ? {
            ...play,
            status: missionStatus === "abandoned" ? "Abandonado" : "Pausado",
            finishedAt: missionStatus === "abandoned" ? today() : play.finishedAt,
          }
        : play
    ),
  }));
  next = withActivity(next, {
    type: `mission-${missionStatus}`,
    gameId: game.id,
    missionId,
    description,
  });
  return touch(next);
}

export function pauseMission(data: BacklogData, missionId: string): BacklogData {
  const mission = data.missions.find(item => item.id === missionId);
  if (!mission) return data;
  const game = data.games.find(item => item.id === mission.gameId);
  return setMissionPausedState(
    data,
    missionId,
    "paused",
    "Pausado",
    "paused",
    queuePosition(data, mission.gameId),
    `${game?.title ?? "La misión"} fue pausada y conserva su posición.`
  );
}

export function deferMission(data: BacklogData, missionId: string): BacklogData {
  const mission = data.missions.find(item => item.id === missionId);
  if (!mission) return data;
  const game = data.games.find(item => item.id === mission.gameId);
  return setMissionPausedState(
    data,
    missionId,
    "deferred",
    "Pausado",
    "deferred",
    data.preferences.deferPosition,
    `${game?.title ?? "La misión"} fue aplazado a la posición ${data.preferences.deferPosition}.`
  );
}

export function sendMissionToEnd(data: BacklogData, missionId: string): BacklogData {
  const mission = data.missions.find(item => item.id === missionId);
  if (!mission) return data;
  const game = data.games.find(item => item.id === mission.gameId);
  return setMissionPausedState(
    data,
    missionId,
    "deferred",
    "Probablemente no lo juegue",
    "low-interest",
    data.queue.length,
    `${game?.title ?? "La misión"} fue enviado al final de la cola.`
  );
}

export function abandonMission(data: BacklogData, missionId: string): BacklogData {
  const mission = data.missions.find(item => item.id === missionId);
  if (!mission) return data;
  const game = data.games.find(item => item.id === mission.gameId);
  return setMissionPausedState(
    data,
    missionId,
    "abandoned",
    "Abandonado",
    "archived",
    data.queue.length,
    `${game?.title ?? "La misión"} fue abandonado y archivado.`
  );
}

export function finishMission(
  data: BacklogData,
  missionId: string,
  form: CompletionFormValue
): BacklogData {
  const mission = data.missions.find(item => item.id === missionId);
  if (!mission) return data;
  const game = data.games.find(item => item.id === mission.gameId);
  if (!game) return data;
  const copy =
    game.copies.find(item => item.id === form.copyId) ??
    game.copies.find(item => item.id === mission.copyId);
  const shouldCountCompletion =
    form.scope === "game" || mission.contentType === "campaign" || mission.contentType === "replay";
  const target = replayTarget(form.replayIntent, data.queue.length);
  const queueState = replayQueueState(form.replayIntent);
  let next: BacklogData = {
    ...data,
    missions: data.missions.map(item =>
      item.id === missionId
        ? {
            ...item,
            status: "finished",
            finishedAt: today(),
            activeDevice: form.device,
            activeDeviceId: form.deviceId,
            copyId: form.copyId,
          }
        : item
    ),
    scheduleRules: data.scheduleRules.filter(rule => rule.missionId !== missionId),
    queue: moveQueue(data.queue, game.id, target, queueState, {
      replayIntent: form.replayIntent,
      preferredCopyId: form.copyId,
      preferredDevice: form.device,
      preferredDeviceId: form.deviceId,
      preferredSlotId: mission.slotId,
      deferredAt: null,
      reason: replayReason(form.replayIntent),
    }),
  };
  next = updateGame(next, game.id, current => {
    const completions = current.progress.completions + (shouldCountCompletion ? 1 : 0);
    const existingPlay = current.playthroughs.some(play => play.id === mission.playthroughId);
    const closedPlay = existingPlay
      ? current.playthroughs.map(play =>
          play.id === mission.playthroughId
            ? {
                ...play,
                platform: copy?.library ?? play.platform,
                device: form.device,
                deviceId: form.deviceId,
                copyId: form.copyId,
                contentId: mission.contentId,
                status: form.result,
                finishedAt: today(),
                notes: form.notes || play.notes,
              }
            : play
        )
      : [
          ...current.playthroughs,
          {
            id: nextGeneratedId(
              "P",
              data.games.flatMap(item => item.playthroughs.map(play => play.id))
            ),
            number: Math.max(1, completions),
            platform: copy?.library ?? "Por confirmar",
            device: form.device,
            deviceId: form.deviceId,
            copyId: form.copyId,
            contentId: mission.contentId,
            status: form.result,
            startedAt: mission.startedAt,
            finishedAt: today(),
            notes: form.notes,
          },
        ];
    return {
      ...current,
      status: form.result,
      notes: form.notes || current.notes,
      progress: {
        ...current.progress,
        completions,
        replays: Math.max(current.progress.replays, Math.max(0, completions - 1)),
        lastPlayedAt: today(),
      },
      copies: current.copies.map(item =>
        item.id === form.copyId ? { ...item, status: form.result } : item
      ),
      contents: current.contents.map(content =>
        content.id === mission.contentId
          ? {
              ...content,
              status: form.result === "Completado" ? "completed" : "finished",
              notes: form.notes || content.notes,
            }
          : content
      ),
      playthroughs: closedPlay,
    };
  });
  next = withActivity(next, {
    type: "mission-finished",
    gameId: game.id,
    missionId,
    description: `${game.title}: ${mission.contentTitle} marcado como ${form.result.toLowerCase()}.`,
  });
  return touch(next);
}

function slug(value: string): string {
  const result = normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return result || "custom-content";
}

function updateOrCreatePlaythrough(
  data: BacklogData,
  game: Game,
  missionId: string | null,
  form: MissionFormValue,
  contentId: string
): { playthroughId: string; game: Game } {
  const existingMission = missionId
    ? data.missions.find(mission => mission.id === missionId)
    : null;
  const reusable = existingMission
    ? game.playthroughs.find(play => play.id === existingMission.playthroughId)
    : [...game.playthroughs]
        .reverse()
        .find(play => ["Pausado", "Pendiente"].includes(play.status) && !play.finishedAt);
  if (reusable) {
    return {
      playthroughId: reusable.id,
      game: {
        ...game,
        playthroughs: game.playthroughs.map(play =>
          play.id === reusable.id
            ? {
                ...play,
                platform:
                  game.copies.find(copy => copy.id === form.copyId)?.library ?? play.platform,
                device: form.activeDevice,
                deviceId: form.activeDeviceId,
                copyId: form.copyId,
                contentId,
                status: "Jugando",
                finishedAt: null,
              }
            : play
        ),
      },
    };
  }
  const id = nextGeneratedId(
    "P",
    data.games.flatMap(item => item.playthroughs.map(play => play.id))
  );
  return {
    playthroughId: id,
    game: {
      ...game,
      playthroughs: [
        ...game.playthroughs,
        {
          id,
          number: Math.max(1, game.progress.completions + 1),
          platform: game.copies.find(copy => copy.id === form.copyId)?.library ?? "Por confirmar",
          device: form.activeDevice,
          deviceId: form.activeDeviceId,
          copyId: form.copyId,
          contentId,
          status: "Jugando",
          startedAt: today(),
          finishedAt: null,
          notes: form.notes,
        },
      ],
    },
  };
}

export function activateMission(
  original: BacklogData,
  form: MissionFormValue,
  existingMissionId: string | null = null
): BacklogData {
  let data = original;
  const occupied = data.missions.find(
    mission =>
      mission.status === "active" &&
      mission.slotId === form.slotId &&
      mission.id !== existingMissionId
  );
  if (occupied && form.replaceOccupied) data = deferMission(data, occupied.id);
  if (occupied && !form.replaceOccupied) return data;

  const game = data.games.find(item => item.id === form.gameId);
  if (!game) return data;
  const copy = game.copies.find(item => item.id === form.copyId);
  if (!copy) return data;
  const existingMission = existingMissionId
    ? data.missions.find(item => item.id === existingMissionId)
    : null;
  const contentId = existingMission?.contentId ?? slug(form.contentTitle);
  const playResult = updateOrCreatePlaythrough(data, game, existingMissionId, form, contentId);
  const missionId =
    existingMission?.id ??
    nextGeneratedId(
      "M",
      data.missions.map(item => item.id)
    );
  const ruleId = form.weekdays.length
    ? (existingMission?.scheduleRuleId ??
      nextGeneratedId(
        "SR",
        data.scheduleRules.map(item => item.id)
      ))
    : null;
  const mission = {
    id: missionId,
    gameId: game.id,
    contentId,
    contentTitle: form.contentTitle,
    contentType: form.contentType,
    copyId: form.copyId,
    activeDevice: form.activeDevice,
    activeDeviceId: form.activeDeviceId,
    slotId: form.slotId,
    status: "active" as const,
    playthroughId: playResult.playthroughId,
    scheduleRuleId: ruleId,
    startedAt: existingMission?.startedAt ?? today(),
    finishedAt: null,
    notes: form.notes,
  };

  let next: BacklogData = {
    ...data,
    missions: existingMission
      ? data.missions.map(item => (item.id === existingMission.id ? mission : item))
      : [...data.missions, mission],
    scheduleRules: [
      ...data.scheduleRules.filter(rule => rule.missionId !== missionId),
      ...(ruleId
        ? [
            {
              id: ruleId,
              missionId,
              weekdays: form.weekdays,
              durationMin: form.durationMin,
              durationMax: form.durationMax,
              enabled: true,
            },
          ]
        : []),
    ],
    queue: moveQueue(data.queue, game.id, 1, "active", {
      preferredCopyId: form.copyId,
      preferredDevice: form.activeDevice,
      preferredDeviceId: form.activeDeviceId,
      preferredSlotId: form.slotId,
      deferredAt: null,
      reason: form.notes || `${form.contentTitle} activo en ${form.activeDevice}.`,
    }),
  };
  next = {
    ...next,
    games: next.games.map(item =>
      item.id === game.id
        ? {
            ...playResult.game,
            status: activeGameStatus(form.contentType, form.slotId),
            suggestedSession: form.slotId,
            notes: form.notes || item.notes,
            progress: { ...item.progress, chapter: form.contentTitle, lastPlayedAt: today() },
            copies: item.copies.map(currentCopy =>
              currentCopy.id === form.copyId ? { ...currentCopy, status: "Jugando" } : currentCopy
            ),
            contents: item.contents.some(content => content.id === contentId)
              ? item.contents.map(content =>
                  content.id === contentId
                    ? {
                        ...content,
                        title: form.contentTitle,
                        type: form.contentType,
                        status: "active",
                        notes: form.notes,
                      }
                    : content
                )
              : [
                  ...item.contents,
                  {
                    id: contentId,
                    title: form.contentTitle,
                    type: form.contentType,
                    status: "active",
                    notes: form.notes,
                  },
                ],
          }
        : item
    ),
  };
  next = withActivity(next, {
    type: existingMission ? "mission-updated" : "mission-activated",
    gameId: game.id,
    missionId,
    description: `${game.title} ${existingMission ? "actualizó su plataforma o programación" : "se convirtió en misión activa"} (${form.activeDevice}).`,
  });
  return touch(next);
}

export function moveQueueOneStep(
  data: BacklogData,
  gameId: string,
  direction: -1 | 1
): BacklogData {
  const current = data.queue.find(item => item.gameId === gameId);
  if (!current || current.pinned) return data;
  const queue = moveQueue(data.queue, gameId, current.position + direction, current.state);
  return touch(
    withActivity(
      { ...data, queue },
      {
        type: "queue-moved",
        gameId,
        missionId: null,
        description: `Se ajustó manualmente la posición de ${data.games.find(game => game.id === gameId)?.title ?? gameId}.`,
      }
    )
  );
}

export function updatePreferences(
  data: BacklogData,
  patch: Partial<BacklogData["preferences"]>
): BacklogData {
  return touch({ ...data, preferences: { ...data.preferences, ...patch } });
}
