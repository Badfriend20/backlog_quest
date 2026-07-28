import { describe, expect, it } from "vitest";
import type { Mission, ScheduleRule } from "./backlog";
import {
  groupScheduleSessions,
  normalizeScheduleSessions,
  scheduleGroupsToSessions,
  scheduleSessionsForRule,
  toggleScheduleWeekday,
} from "./schedule";

describe("schedule", () => {
  it("preserva combinaciones distintas del mismo día y elimina solo duplicados exactos", () => {
    expect(
      normalizeScheduleSessions([
        { weekday: 1, slotId: "first" },
        { weekday: 1, slotId: "second" },
        { weekday: 1, slotId: "first" },
      ])
    ).toEqual([
      { weekday: 1, slotId: "first" },
      { weekday: 1, slotId: "second" },
    ]);
  });

  it("convierte una regla heredada usando la franja preferida de la misión", () => {
    const rule = {
      id: "schedule-legacy",
      missionId: "mission-1",
      weekdays: [1, 3],
      durationMin: 30,
      durationMax: 60,
      enabled: true,
    } as unknown as ScheduleRule;
    const mission = { slotId: "flexible" } as Pick<Mission, "slotId">;

    expect(scheduleSessionsForRule(rule, mission)).toEqual([
      { weekday: 1, slotId: "flexible" },
      { weekday: 3, slotId: "flexible" },
    ]);
  });

  it("agrupa una sola franja con todos sus activadores semanales", () => {
    const groups = groupScheduleSessions([
      { weekday: 1, slotId: "first" },
      { weekday: 3, slotId: "first" },
      { weekday: 2, slotId: "flexible" },
    ]);

    expect(groups).toEqual([
      { slotId: "first", weekdays: [1, 3] },
      { slotId: "flexible", weekdays: [2] },
    ]);
    expect(scheduleGroupsToSessions(groups)).toEqual([
      { weekday: 1, slotId: "first" },
      { weekday: 3, slotId: "first" },
      { weekday: 2, slotId: "flexible" },
    ]);
  });

  it("alterna un día sin duplicar la franja ni afectar los demás activadores", () => {
    const groups = [{ slotId: "second", weekdays: [1, 2] }];

    expect(toggleScheduleWeekday(groups, "second", 2)).toEqual([
      { slotId: "second", weekdays: [1] },
    ]);
    expect(toggleScheduleWeekday(groups, "second", 3)).toEqual([
      { slotId: "second", weekdays: [1, 2, 3] },
    ]);
  });
});
