import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { createBacklogFixture } from "../../../shared/testing/backlogFixture";
import { LibraryView } from "./LibraryView";

describe("LibraryView", () => {
  it("separa prioridad, apertura de contenido y activación en controles independientes", () => {
    const data = createBacklogFixture();
    const game = data.games[1];
    const markup = renderToStaticMarkup(
      <LibraryView
        data={data}
        onSelectGame={vi.fn()}
        onCreateGame={vi.fn()}
        onActivate={vi.fn()}
        onChangePriority={vi.fn()}
      />
    );
    const openButton = markup.match(
      new RegExp(`<button[^>]*aria-label="Abrir ${game.title}"[^>]*>([\\s\\S]*?)</button>`)
    )?.[1];

    expect(markup).toContain(`aria-label="Cambiar prioridad. Actual: ${game.priority}"`);
    expect(openButton).toBeDefined();
    expect(openButton).not.toContain("Cambiar prioridad");
    expect(markup).toContain("Activar misión");
  });
});
