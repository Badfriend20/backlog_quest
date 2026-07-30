import type { QuestData, Mission, ScheduleRule, ScheduleSession } from "./quest";
import { getSlotLabel } from "./questSelectors";

export const WEEKDAY_OPTIONS = [
  { id: 1, label: "L", longLabel: "Lunes" },
  { id: 2, label: "M", longLabel: "Martes" },
  { id: 3, label: "X", longLabel: "Miércoles" },
  { id: 4, label: "J", longLabel: "Jueves" },
  { id: 5, label: "V", longLabel: "Viernes" },
  { id: 6, label: "S", longLabel: "Sábado" },
  { id: 0, label: "D", longLabel: "Domingo" },
] as const;

export const MISSION_SLOT_IDS = ["first", "second", "secondary", "flexible"] as const;

export interface ScheduleGroup {
  slotId: string;
  weekdays: number[];
}

const weekdayOrder = new Map<number, number>(
  WEEKDAY_OPTIONS.map(day => [day.id, WEEKDAY_OPTIONS.indexOf(day)])
);

export function normalizeScheduleSessions(sessions: ScheduleSession[]): ScheduleSession[] {
  const seen = new Set<string>();
  return sessions.filter(session => {
    const key = `${session.weekday}:${session.slotId}`;
    const valid =
      Number.isInteger(session.weekday) &&
      session.weekday >= 0 &&
      session.weekday <= 6 &&
      Boolean(session.slotId) &&
      !seen.has(key);
    if (valid) seen.add(key);
    return valid;
  });
}

export function groupScheduleSessions(sessions: ScheduleSession[]): ScheduleGroup[] {
  const groups = new Map<string, number[]>();
  normalizeScheduleSessions(sessions).forEach(session => {
    groups.set(session.slotId, [...(groups.get(session.slotId) ?? []), session.weekday]);
  });
  return [...groups].map(([slotId, weekdays]) => ({
    slotId,
    weekdays: [...weekdays].sort(
      (left, right) => (weekdayOrder.get(left) ?? 7) - (weekdayOrder.get(right) ?? 7)
    ),
  }));
}

export function scheduleGroupsToSessions(groups: ScheduleGroup[]): ScheduleSession[] {
  return normalizeScheduleSessions(
    groups.flatMap(group => group.weekdays.map(weekday => ({ weekday, slotId: group.slotId })))
  );
}

export function toggleScheduleWeekday(
  groups: ScheduleGroup[],
  slotId: string,
  weekday: number
): ScheduleGroup[] {
  return groups.map(group => {
    if (group.slotId !== slotId) return group;
    const active = group.weekdays.includes(weekday);
    const weekdays = active
      ? group.weekdays.filter(candidate => candidate !== weekday)
      : [...group.weekdays, weekday];
    return {
      ...group,
      weekdays: weekdays.sort(
        (left, right) => (weekdayOrder.get(left) ?? 7) - (weekdayOrder.get(right) ?? 7)
      ),
    };
  });
}

export function scheduleSessionsForRule(
  rule: ScheduleRule,
  mission: Pick<Mission, "slotId">
): ScheduleSession[] {
  const legacy = rule as ScheduleRule & { weekdays?: number[] };
  return normalizeScheduleSessions(
    rule.sessions ??
      (legacy.weekdays ?? []).map(weekday => ({
        weekday,
        slotId: mission.slotId,
      }))
  );
}

export function findScheduleConflicts(
  data: QuestData,
  sessions: ScheduleSession[],
  excludedMissionId?: string
): Mission[] {
  const keys = new Set(
    normalizeScheduleSessions(sessions).map(session => `${session.weekday}:${session.slotId}`)
  );
  if (!keys.size) return [];
  return data.missions.filter(mission => {
    if (mission.id === excludedMissionId || mission.status !== "active") return false;
    const rule = data.scheduleRules.find(item => item.missionId === mission.id && item.enabled);
    return Boolean(
      rule &&
      scheduleSessionsForRule(rule, mission).some(session =>
        keys.has(`${session.weekday}:${session.slotId}`)
      )
    );
  });
}

export function missionScheduleLabel(data: QuestData, mission: Mission): string {
  const rule = data.scheduleRules.find(item => item.missionId === mission.id && item.enabled);
  if (!rule) return "Sin agenda fija";
  const sessions = scheduleSessionsForRule(rule, mission);
  if (!sessions.length) return "Sin agenda fija";
  return sessions
    .map(session => {
      const day = WEEKDAY_OPTIONS.find(option => option.id === session.weekday)?.label ?? "?";
      return `${day} · ${getSlotLabel(data, session.slotId)}`;
    })
    .join(" / ");
}
