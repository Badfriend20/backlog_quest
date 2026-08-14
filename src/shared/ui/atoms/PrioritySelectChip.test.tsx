import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PrioritySelectChip } from "./PrioritySelectChip";

describe("PrioritySelectChip", () => {
  it("presenta la prioridad actual como un botón accesible con apariencia de chip", () => {
    const markup = renderToStaticMarkup(
      <PrioritySelectChip
        value="Alta"
        options={[
          { id: "high", label: "Alta", description: "Interés fuerte." },
          { id: "medium", label: "Media", description: "Interés normal." },
        ]}
        onChange={() => undefined}
      />
    );

    expect(markup).toContain("<button");
    expect(markup).toContain('aria-label="Cambiar prioridad. Actual: Alta"');
    expect(markup).toContain('aria-haspopup="menu"');
    expect(markup).toContain('aria-expanded="false"');
    expect(markup).toContain('title="Interés fuerte."');
    expect(markup).toContain("Alta");
  });
});
