import { describe, expect, it } from "vitest";
import type { Activity, QuestData, QueueItem } from "../../../shared/kernel/quest";
import { createBacklogFixture } from "../../../shared/testing/backlogFixture";
import { buildRotationPlan } from "./rotation";

const REFERENCE_DATE = "2026-06-15T12:00:00.000Z";
const PRIMARY_DEVICE_ID = "device-primary";
const SECONDARY_DEVICE_ID = "device-secondary";
const MISSION_FINISHED = "mission-finished";

function candidate(
  id: string,
  title: string,
  priority: string,
  position: number,
  deviceId = SECONDARY_DEVICE_ID
): { game: Activity; item: QueueItem } {
  const fixture = createBacklogFixture();
  const game: Activity = {
    ...structuredClone(fixture.games[1]),
    id,
    title,
    priority,
    playthroughs: [],
    dependencies: [],
    availableFrom: null,
  };
  const item: QueueItem = {
    ...structuredClone(fixture.queue[1]),
    gameId: id,
    position,
    state: "queued",
    preferredDeviceId: deviceId,
    preferredDevice:
      fixture.platforms.find(device => device.id === deviceId)?.name ?? "Por confirmar",
    availableFrom: null,
    pinned: false,
    pinnedPosition: null,
  };
  return { game, item };
}

function withCandidates(...entries: Array<{ game: Activity; item: QueueItem }>): QuestData {
  const fixture = createBacklogFixture();
  return {
    ...fixture,
    games: entries.map(entry => entry.game),
    queue: entries.map(entry => entry.item),
    missions: [],
    scheduleRules: [],
    activityLog: [],
  };
}

describe("buildRotationPlan", () => {
  it("respeta la prioridad cuando el resto de factores es equivalente", () => {
    const medium = candidate("medium", "Prioridad media", "Media", 1);
    const top = candidate("top", "Prioridad S", "S", 1);
    const data = withCandidates(medium, top);

    const plan = buildRotationPlan(data, { referenceDate: REFERENCE_DATE });

    expect(plan.candidates.map(entry => entry.game.id)).toEqual(["top", "medium"]);
    expect(plan.candidates[0].breakdown.priority).toBe(40);
  });

  it("mantiene la influencia de la posición manual", () => {
    const later = candidate("later", "Más tarde", "Media", 8);
    const first = candidate("first", "Primero", "Media", 1);

    const plan = buildRotationPlan(withCandidates(later, first), {
      referenceDate: REFERENCE_DATE,
    });

    expect(plan.candidates.map(entry => entry.game.id)).toEqual(["first", "later"]);
    expect(plan.candidates[0].breakdown.manualOrder).toBeGreaterThan(
      plan.candidates[1].breakdown.manualOrder
    );
  });

  it.each([
    "active",
    "blocked",
    "wishlist",
    "archived",
    "low-interest",
    "replay-later",
    "paused",
    "deferred",
  ] as const)("excluye el estado %s", state => {
    const entry = candidate(state, state, "S", 1);
    entry.item.state = state;

    expect(
      buildRotationPlan(withCandidates(entry), { referenceDate: REFERENCE_DATE }).candidates
    ).toEqual([]);
  });

  it("excluye actividades cuya disponibilidad todavía está en el futuro", () => {
    const entry = candidate("future", "Futuro", "S", 1);
    entry.item.availableFrom = "2026-06-16";

    expect(
      buildRotationPlan(withCandidates(entry), { referenceDate: REFERENCE_DATE }).candidates
    ).toEqual([]);
  });

  it("considera actividades disponibles desde la fecha actual", () => {
    const entry = candidate("today", "Disponible hoy", "Media", 1);
    entry.game.availableFrom = "2026-06-15";

    expect(
      buildRotationPlan(withCandidates(entry), { referenceDate: REFERENCE_DATE }).candidates[0].game
        .id
    ).toBe("today");
  });

  it("no recomienda actividades con dependencias pendientes", () => {
    const dependency = candidate("dependency", "Dependencia", "Baja", 2);
    dependency.game.status = "Disponible";
    dependency.item.state = "archived";
    const dependent = candidate("dependent", "Dependiente", "S", 1);
    dependent.game.dependencies = [dependency.game.id];

    expect(
      buildRotationPlan(withCandidates(dependent, dependency), {
        referenceDate: REFERENCE_DATE,
      }).candidates
    ).toEqual([]);
  });

  it("respeta los dispositivos desactivados", () => {
    const entry = candidate("inactive-device", "Sin recurso disponible", "S", 1);
    const data = withCandidates(entry);
    data.platforms = data.platforms.map(device =>
      device.id === entry.item.preferredDeviceId ? { ...device, active: false } : device
    );

    expect(buildRotationPlan(data, { referenceDate: REFERENCE_DATE }).candidates).toEqual([]);
  });

  it("tolera un preferredDeviceId inexistente o vacío", () => {
    const missing = candidate("missing", "ID inexistente", "Media", 1, "missing-device");
    const empty = candidate("empty", "Sin ID", "Media", 2, "");

    expect(() =>
      buildRotationPlan(withCandidates(missing, empty), { referenceDate: REFERENCE_DATE })
    ).not.toThrow();
    expect(
      buildRotationPlan(withCandidates(missing, empty), { referenceDate: REFERENCE_DATE })
        .candidates
    ).toHaveLength(2);
  });

  it("es determinista con fecha inyectada y no muta QuestData", () => {
    const data = withCandidates(
      candidate("one", "Uno", "Alta", 1),
      candidate("two", "Dos", "Media", 2)
    );
    const original = structuredClone(data);

    const first = buildRotationPlan(data, { referenceDate: REFERENCE_DATE });
    const second = buildRotationPlan(data, { referenceDate: REFERENCE_DATE });

    expect(first).toEqual(second);
    expect(first.generatedAt).toBe(REFERENCE_DATE);
    expect(data).toEqual(original);
  });

  it("aumenta la deuda para un dispositivo que lleva más tiempo sin utilizarse", () => {
    const recent = candidate("recent", "Uso reciente", "Media", 1, PRIMARY_DEVICE_ID);
    const stale = candidate("stale", "Uso antiguo", "Media", 1, SECONDARY_DEVICE_ID);
    const journeyTemplate = createBacklogFixture().games[0].playthroughs[0];
    recent.game.playthroughs = [
      {
        ...journeyTemplate,
        id: "journey-recent",
        deviceId: PRIMARY_DEVICE_ID,
        finishedAt: "2026-06-14",
        status: "Terminado",
      },
    ];
    stale.game.playthroughs = [
      {
        ...journeyTemplate,
        id: "journey-stale",
        deviceId: SECONDARY_DEVICE_ID,
        finishedAt: "2026-05-26",
        status: "Terminado",
      },
    ];

    const plan = buildRotationPlan(withCandidates(recent, stale), {
      referenceDate: REFERENCE_DATE,
    });
    const debts = Object.fromEntries(
      plan.candidates.map(entry => [entry.game.id, entry.breakdown.rotationDebt])
    );

    expect(debts.stale).toBeGreaterThan(debts.recent);
  });

  it("aumenta la deuda cuando varias terminaciones recientes fueron de otros dispositivos", () => {
    const primary = candidate("primary", "Principal", "Media", 1, PRIMARY_DEVICE_ID);
    const secondary = candidate("secondary", "Secundario", "Media", 2, SECONDARY_DEVICE_ID);
    const data = withCandidates(primary, secondary);
    const missionTemplate = createBacklogFixture().missions[0];
    data.missions = [
      { ...missionTemplate, id: "mission-primary", activeDeviceId: PRIMARY_DEVICE_ID },
      { ...missionTemplate, id: "mission-secondary-1", activeDeviceId: SECONDARY_DEVICE_ID },
      { ...missionTemplate, id: "mission-secondary-2", activeDeviceId: SECONDARY_DEVICE_ID },
      { ...missionTemplate, id: "mission-secondary-3", activeDeviceId: SECONDARY_DEVICE_ID },
    ];
    data.activityLog = [
      {
        id: "event-4",
        type: MISSION_FINISHED,
        gameId: null,
        missionId: "mission-secondary-3",
        at: "2026-06-14T10:00:00.000Z",
        description: "",
      },
      {
        id: "event-3",
        type: MISSION_FINISHED,
        gameId: null,
        missionId: "mission-secondary-2",
        at: "2026-06-13T10:00:00.000Z",
        description: "",
      },
      {
        id: "event-2",
        type: MISSION_FINISHED,
        gameId: null,
        missionId: "mission-secondary-1",
        at: "2026-06-12T10:00:00.000Z",
        description: "",
      },
      {
        id: "event-1",
        type: MISSION_FINISHED,
        gameId: null,
        missionId: "mission-primary",
        at: "2026-06-11T10:00:00.000Z",
        description: "",
      },
    ];

    const plan = buildRotationPlan(data, { referenceDate: REFERENCE_DATE });
    const debts = Object.fromEntries(
      plan.candidates.map(entry => [entry.game.id, entry.breakdown.rotationDebt])
    );

    expect(debts.primary).toBeGreaterThan(debts.secondary);
  });

  it("penaliza moderadamente un dispositivo con misión activa sin excluirlo", () => {
    const occupied = candidate("occupied", "Ocupado", "Media", 1, PRIMARY_DEVICE_ID);
    const free = candidate("free", "Libre", "Media", 1, SECONDARY_DEVICE_ID);
    const data = withCandidates(occupied, free);
    data.missions = [createBacklogFixture().missions[0]];

    const plan = buildRotationPlan(data, { referenceDate: REFERENCE_DATE });
    const occupiedCandidate = plan.candidates.find(entry => entry.game.id === "occupied")!;

    expect(plan.candidates.map(entry => entry.game.id)).toEqual(["free", "occupied"]);
    expect(occupiedCandidate.breakdown.activeDevicePenalty).toBeGreaterThan(0);
  });

  it("funciona sin historial y asigna una deuda inicial moderada", () => {
    const entry = candidate("new-device", "Sin historial", "Media", 1);

    const result = buildRotationPlan(withCandidates(entry), { referenceDate: REFERENCE_DATE });

    expect(result.candidates[0].breakdown.rotationDebt).toBeGreaterThan(0);
    expect(result.candidates[0].breakdown.rotationDebt).toBeLessThan(50);
  });

  it("evita tres recomendaciones consecutivas del mismo dispositivo cuando hay alternativa", () => {
    const data = withCandidates(
      candidate("same-1", "Mismo 1", "Media", 1, PRIMARY_DEVICE_ID),
      candidate("same-2", "Mismo 2", "Media", 2, PRIMARY_DEVICE_ID),
      candidate("same-3", "Mismo 3", "Media", 3, PRIMARY_DEVICE_ID),
      candidate("alternative", "Alternativa", "Media", 4, SECONDARY_DEVICE_ID)
    );

    const plan = buildRotationPlan(data, { limit: 4, referenceDate: REFERENCE_DATE });

    expect(plan.candidates.slice(0, 3).map(entry => entry.deviceId)).toEqual([
      PRIMARY_DEVICE_ID,
      PRIMARY_DEVICE_ID,
      SECONDARY_DEVICE_ID,
    ]);
    expect(plan.candidates[2].game.id).toBe("alternative");
  });

  it("permite tres o más recomendaciones consecutivas si no existen alternativas", () => {
    const data = withCandidates(
      candidate("only-1", "Único 1", "Media", 1, PRIMARY_DEVICE_ID),
      candidate("only-2", "Único 2", "Media", 2, PRIMARY_DEVICE_ID),
      candidate("only-3", "Único 3", "Media", 3, PRIMARY_DEVICE_ID)
    );

    const plan = buildRotationPlan(data, { limit: 3, referenceDate: REFERENCE_DATE });

    expect(plan.candidates).toHaveLength(3);
    expect(plan.candidates.every(entry => entry.deviceId === PRIMARY_DEVICE_ID)).toBe(true);
  });

  it("no recomienda prematuramente un pinned futuro", () => {
    const pinned = candidate("future-pinned", "Fijo futuro", "S", 5);
    pinned.item.pinned = true;
    pinned.item.pinnedPosition = 5;
    pinned.item.availableFrom = "2026-10-06";

    expect(
      buildRotationPlan(withCandidates(pinned), { referenceDate: REFERENCE_DATE }).candidates
    ).toEqual([]);
  });

  it("otorga influencia fuerte a un pinned disponible sin cambiar su posición", () => {
    const normal = candidate("normal", "Normal", "Media", 1);
    const pinned = candidate("pinned", "Fijo disponible", "Baja", 5);
    pinned.item.pinned = true;
    pinned.item.pinnedPosition = 5;
    const data = withCandidates(normal, pinned);
    const originalPosition = pinned.item.position;

    const plan = buildRotationPlan(data, { referenceDate: REFERENCE_DATE });

    expect(plan.candidates[0].game.id).toBe("pinned");
    expect(data.queue.find(item => item.gameId === "pinned")?.position).toBe(originalPosition);
  });
});
