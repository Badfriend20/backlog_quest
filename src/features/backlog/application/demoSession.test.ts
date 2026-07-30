import { describe, expect, it } from "vitest";
import { createBacklogFixture } from "../../../shared/testing/backlogFixture";
import { beginDemoSession, restoreDemoSession } from "./demoSession";

function dataWithActivity(id: string, title: string) {
  const data = createBacklogFixture();
  return { ...data, games: [{ ...data.games[0], id, title }] };
}

describe("sesión de demostración", () => {
  it("respalda los datos reales al iniciar la primera demostración", () => {
    const original = dataWithActivity("real", "Datos reales");
    const example = dataWithActivity("demo", "Ejemplo");

    const session = beginDemoSession(original, example, null);

    expect(session.data.games[0]?.id).toBe("demo");
    expect(session.snapshot.games[0]?.id).toBe("real");
    expect(session.snapshot).not.toBe(original);
  });

  it("conserva el respaldo original al cambiar de ejemplo", () => {
    const original = dataWithActivity("real", "Datos reales");
    const firstExample = dataWithActivity("demo-1", "Ejemplo uno");
    const secondExample = dataWithActivity("demo-2", "Ejemplo dos");
    const firstSession = beginDemoSession(original, firstExample, null);

    const secondSession = beginDemoSession(firstSession.data, secondExample, firstSession.snapshot);

    expect(secondSession.data.games[0]?.id).toBe("demo-2");
    expect(secondSession.snapshot.games[0]?.id).toBe("real");
  });

  it("restaura una copia independiente de los datos originales", () => {
    const snapshot = dataWithActivity("real", "Datos reales");

    const restored = restoreDemoSession(snapshot);

    expect(restored.games[0]?.id).toBe("real");
    expect(restored).not.toBe(snapshot);
  });
});
