// @vitest-environment happy-dom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { IconButton } from "./IconButton";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

describe("IconButton", () => {
  it("usa type button por defecto y renderiza sus children", () => {
    const markup = renderToStaticMarkup(<IconButton aria-label="Mover">icono</IconButton>);

    expect(markup).toContain('type="button"');
    expect(markup).toContain("icono");
  });

  it("transfiere disabled y atributos aria al boton", () => {
    const markup = renderToStaticMarkup(
      <IconButton disabled aria-label="Bajar" aria-expanded="false">
        icono
      </IconButton>
    );

    expect(markup).toContain('aria-label="Bajar"');
    expect(markup).toContain('aria-expanded="false"');
    expect(markup).toContain('disabled=""');
  });

  it("ejecuta el callback de click", () => {
    const onClick = vi.fn();
    const container = document.createElement("div");
    const root = createRoot(container);
    act(() => root.render(<IconButton onClick={onClick}>icono</IconButton>));

    act(() => container.querySelector("button")?.click());

    expect(onClick).toHaveBeenCalledOnce();
    act(() => root.unmount());
  });
});
