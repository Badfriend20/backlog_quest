import type { Activity, QuestData, QueueItem } from "../../../shared/kernel/quest";
import { unresolvedDependencies } from "../../../shared/kernel/questSelectors";

const PRIORITY_SCORE: Readonly<Record<string, number>> = {
  S: 40,
  Alta: 24,
  Media: 12,
  Baja: 0,
};
const DEVICE_PRIORITY_SCORE: Readonly<Record<string, number>> = {
  S: 8,
  Alta: 6,
  Media: 3,
  Baja: 0,
};
const MAX_RECENCY_DEBT = 24;
const MAX_RECENCY_DAYS = 30;
const SKIPPED_COMPLETION_SCORE = 4;
const MAX_SKIPPED_COMPLETIONS_DEBT = 20;
const NEW_DEVICE_DEBT = 22;
const ACTIVE_DEVICE_PENALTY = 14;
const PINNED_MANUAL_ORDER_BONUS = 32;
const THIRD_DEVICE_REPEAT_PENALTY = 36;
const DAY_IN_MILLISECONDS = 86_400_000;

interface DeviceActivity {
  deviceId: string;
  at: string;
}

export interface RotationScoreBreakdown {
  priority: number;
  manualOrder: number;
  rotationDebt: number;
  devicePriority: number;
  activeDevicePenalty: number;
  diversityAdjustment: number;
}

export interface RotationCandidate {
  item: QueueItem;
  game: Activity;
  deviceId?: string;
  score: number;
  breakdown: RotationScoreBreakdown;
}

export interface RotationPlan {
  candidates: RotationCandidate[];
  generatedAt: string;
}

export interface RotationPlanOptions {
  limit?: number;
  referenceDate?: string | Date;
}

export function explainRotationCandidate(candidate: RotationCandidate): string {
  const device = candidate.item.preferredDevice || "Este recurso";
  if (candidate.item.pinned && candidate.item.pinnedPosition) {
    return `Posición fija #${candidate.item.pinnedPosition} ya disponible.`;
  }
  if (candidate.game.priority === "S" && candidate.breakdown.manualOrder >= 16) {
    return "Prioridad S y posición manual alta.";
  }
  if (candidate.breakdown.activeDevicePenalty > 0) {
    return `${device} ya tiene una misión activa; se favorece diversidad.`;
  }
  if (candidate.deviceId && candidate.breakdown.rotationDebt >= NEW_DEVICE_DEBT) {
    return `${device} tiene poca actividad reciente.`;
  }
  if (candidate.deviceId && candidate.breakdown.rotationDebt > 0) {
    return `${device} lleva varias terminaciones fuera de rotación.`;
  }
  return "Buena combinación de prioridad y posición manual.";
}

export function isRotationEligible(
  data: QuestData,
  item: QueueItem,
  referenceDate: string | Date
): boolean {
  if (item.state !== "queued" && item.state !== "replay") return false;
  const game = data.games.find(candidate => candidate.id === item.gameId);
  if (!game) return false;
  const referenceDay = new Date(referenceDate).toISOString().slice(0, 10);
  const availabilityDates = [item.availableFrom, game.availableFrom].filter(
    (date): date is string => Boolean(date)
  );
  if (availabilityDates.some(date => date > referenceDay)) return false;
  if (unresolvedDependencies(data, game).length > 0) return false;
  const preferredDevice = data.platforms.find(device => device.id === item.preferredDeviceId);
  return preferredDevice?.active !== false;
}

function collectRecentDeviceActivity(data: QuestData): DeviceActivity[] {
  const coveredJourneyIds = new Set<string>();
  const fromLog = data.activityLog.flatMap(event => {
    if (event.type !== "mission-finished" || !event.missionId) return [];
    const mission = data.missions.find(candidate => candidate.id === event.missionId);
    if (!mission?.activeDeviceId) return [];
    if (mission.playthroughId) coveredJourneyIds.add(mission.playthroughId);
    return [{ deviceId: mission.activeDeviceId, at: event.at }];
  });
  const fromJourneys = data.games.flatMap(game =>
    game.playthroughs.flatMap(journey =>
      journey.finishedAt && journey.deviceId && !coveredJourneyIds.has(journey.id)
        ? [{ deviceId: journey.deviceId, at: journey.finishedAt }]
        : []
    )
  );
  return [...fromLog, ...fromJourneys].sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
  );
}

function calculateDeviceRotationDebt(
  activity: DeviceActivity[],
  deviceId: string,
  referenceDate: Date
): number {
  const knownActivity = activity.filter(
    event => new Date(event.at).getTime() <= referenceDate.getTime()
  );
  const lastIndex = knownActivity.findIndex(event => event.deviceId === deviceId);
  if (lastIndex < 0) return NEW_DEVICE_DEBT;
  const lastUsedAt = new Date(knownActivity[lastIndex].at).getTime();
  const elapsedDays = Math.max(0, (referenceDate.getTime() - lastUsedAt) / DAY_IN_MILLISECONDS);
  const recencyDebt = Math.min(
    MAX_RECENCY_DEBT,
    (Math.max(0, elapsedDays - 1) / (MAX_RECENCY_DAYS - 1)) * MAX_RECENCY_DEBT
  );
  const skippedCompletionsDebt = Math.min(
    MAX_SKIPPED_COMPLETIONS_DEBT,
    lastIndex * SKIPPED_COMPLETION_SCORE
  );
  return Math.round((recencyDebt + skippedCompletionsDebt) * 100) / 100;
}

function compareCandidates(a: RotationCandidate, b: RotationCandidate): number {
  return (
    b.score - a.score || a.item.position - b.item.position || a.game.id.localeCompare(b.game.id)
  );
}

function applyDiversity(
  candidate: RotationCandidate,
  remaining: RotationCandidate[],
  selected: RotationCandidate[]
): RotationCandidate {
  const previous = selected.slice(-2);
  const repeatsDevice =
    Boolean(candidate.deviceId) &&
    previous.length === 2 &&
    previous.every(entry => entry.deviceId === candidate.deviceId);
  const hasAlternative = remaining.some(
    entry => entry.deviceId && entry.deviceId !== candidate.deviceId
  );
  const diversityAdjustment = repeatsDevice && hasAlternative ? -THIRD_DEVICE_REPEAT_PENALTY : 0;
  return {
    ...candidate,
    score: candidate.score + diversityAdjustment,
    breakdown: { ...candidate.breakdown, diversityAdjustment },
  };
}

export function buildRotationPlan(
  data: QuestData,
  options: RotationPlanOptions = {}
): RotationPlan {
  const generatedAt = (
    options.referenceDate ? new Date(options.referenceDate) : new Date()
  ).toISOString();
  const referenceDate = new Date(generatedAt);
  const deviceActivity = collectRecentDeviceActivity(data);
  const baseCandidates = data.queue
    .filter(item => isRotationEligible(data, item, generatedAt))
    .map((item): RotationCandidate | null => {
      const game = data.games.find(candidate => candidate.id === item.gameId);
      if (!game) return null;
      const device = data.platforms.find(candidate => candidate.id === item.preferredDeviceId);
      const deviceId = device?.id;
      const breakdown: RotationScoreBreakdown = {
        priority: PRIORITY_SCORE[game.priority] ?? 0,
        manualOrder:
          Math.max(0, 26 - item.position * 2) +
          (item.pinned && item.pinnedPosition ? PINNED_MANUAL_ORDER_BONUS : 0),
        rotationDebt: deviceId
          ? calculateDeviceRotationDebt(deviceActivity, deviceId, referenceDate)
          : 0,
        devicePriority: device ? (DEVICE_PRIORITY_SCORE[device.priority] ?? 0) : 0,
        activeDevicePenalty:
          deviceId &&
          data.missions.some(
            mission => mission.status === "active" && mission.activeDeviceId === deviceId
          )
            ? ACTIVE_DEVICE_PENALTY
            : 0,
        diversityAdjustment: 0,
      };
      return {
        item,
        game,
        deviceId,
        score:
          breakdown.priority +
          breakdown.manualOrder +
          breakdown.rotationDebt +
          breakdown.devicePriority -
          breakdown.activeDevicePenalty,
        breakdown,
      };
    })
    .filter((candidate): candidate is RotationCandidate => Boolean(candidate));
  const remaining = [...baseCandidates];
  const candidates: RotationCandidate[] = [];
  const limit = Math.max(0, options.limit ?? remaining.length);
  while (remaining.length > 0 && candidates.length < limit) {
    const ranked = remaining
      .map(candidate => applyDiversity(candidate, remaining, candidates))
      .sort(compareCandidates);
    const selected = ranked[0];
    candidates.push(selected);
    remaining.splice(
      remaining.findIndex(candidate => candidate.game.id === selected.game.id),
      1
    );
  }

  return { candidates, generatedAt };
}
