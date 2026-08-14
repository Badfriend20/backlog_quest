import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { createBacklogFixture } from "../../../shared/testing/backlogFixture";
import { GameContentCard } from "./GameContentCard";
import type { GameEditorController } from "./useGameEditor";

function createEditor(): GameEditorController {
  return {
    editingContentId: null,
    beginContentEdit: vi.fn(),
    saveContentEdit: vi.fn(),
    discardContentEdit: vi.fn(),
    updateContent: vi.fn(),
    removeContent: vi.fn(),
    moveContent: vi.fn(),
  } as unknown as GameEditorController;
}

describe("GameContentCard", () => {
  it("usa controles compactos y bloquea los límites del catálogo", () => {
    const content = createBacklogFixture().games[0].contents[0];
    const editor = createEditor();
    const firstMarkup = renderToStaticMarkup(
      <GameContentCard content={content} index={0} total={2} editor={editor} />
    );
    const lastMarkup = renderToStaticMarkup(
      <GameContentCard content={content} index={1} total={2} editor={editor} />
    );

    expect(firstMarkup).toMatch(/aria-label="Subir"[^>]*disabled/);
    expect(firstMarkup).not.toMatch(/aria-label="Bajar"[^>]*disabled/);
    expect(lastMarkup).not.toMatch(/aria-label="Subir"[^>]*disabled/);
    expect(lastMarkup).toMatch(/aria-label="Bajar"[^>]*disabled/);
  });
});
