import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { createBacklogFixture } from "../../../shared/testing/backlogFixture";
import { QueueView } from "./QueueView";

describe("QueueView", () => {
  it("combina prioridad editable con movimiento manual y posición fijada", () => {
    const data = createBacklogFixture();
    const game = data.games[1];
    data.queue[1] = { ...data.queue[1], pinned: true, pinnedPosition: 2 };

    const markup = renderToStaticMarkup(
      <QueueView
        data={data}
        onActivate={vi.fn()}
        onMove={vi.fn()}
        onMoveRecommendation={vi.fn()}
        onChangePriority={vi.fn()}
      />
    );

    expect(markup).toContain(`aria-label="Cambiar prioridad. Actual: ${game.priority}"`);
    expect(markup).toContain('aria-label="Subir"');
    expect(markup).toContain('aria-label="Bajar"');
    expect(markup).toContain("FIJO · 2");
    expect(markup).toContain("Activar misión");
  });
});
