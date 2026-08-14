import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { createBacklogFixture } from "../../../shared/testing/backlogFixture";
import { MissionCard } from "./MissionCard";
import type { MissionActions } from "./MissionActions";

describe("MissionCard", () => {
  it("muestra prioridad editable sin retirar las acciones de misión", () => {
    const data = createBacklogFixture();
    const mission = data.missions[0];
    const game = data.games.find(item => item.id === mission.gameId)!;
    const actions: MissionActions = {
      onEditGame: vi.fn(),
      onFinish: vi.fn(),
      onDefer: vi.fn(),
      onPause: vi.fn(),
      onSendEnd: vi.fn(),
      onAbandon: vi.fn(),
      onEditMission: vi.fn(),
      onAddCopyForMission: vi.fn(),
      onAddPlaythroughForMission: vi.fn(),
      onManageContentsForMission: vi.fn(),
      onChangePriority: vi.fn(),
    };

    const markup = renderToStaticMarkup(<MissionCard data={data} mission={mission} {...actions} />);

    expect(markup).toContain(`aria-label="Cambiar prioridad. Actual: ${game.priority}"`);
    expect(markup).toContain("Editar misión");
    expect(markup).toContain("Terminar");
    expect(markup).toContain("Aplazar");
    expect(markup).toContain("Más acciones");
  });
});
