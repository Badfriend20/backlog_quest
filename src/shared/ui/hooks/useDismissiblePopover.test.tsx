// @vitest-environment happy-dom

import { act, useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDismissiblePopover } from "./useDismissiblePopover";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

function PopoverHarness({ onOpenChange }: { onOpenChange(open: boolean): void }) {
  const { open, rootRef, triggerRef, toggle } = useDismissiblePopover();

  useEffect(() => {
    onOpenChange(open);
  }, [onOpenChange, open]);

  return (
    <div ref={rootRef}>
      <button ref={triggerRef} type="button" onClick={toggle}>
        Alternar
      </button>
      {open && <div>Contenido</div>}
    </div>
  );
}

describe("useDismissiblePopover", () => {
  let container: HTMLDivElement;
  let root: Root;
  let mounted: boolean;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    mounted = true;
  });

  afterEach(() => {
    if (mounted) act(() => root.unmount());
    container.remove();
  });

  it("inicia cerrado", () => {
    const observed: boolean[] = [];

    act(() => root.render(<PopoverHarness onOpenChange={open => observed.push(open)} />));

    expect(observed.at(-1)).toBe(false);
    expect(container.textContent).not.toContain("Contenido");
  });

  it("toggle abre el popover", () => {
    act(() => root.render(<PopoverHarness onOpenChange={() => undefined} />));

    act(() => container.querySelector("button")?.click());

    expect(container.textContent).toContain("Contenido");
  });

  it("toggle vuelve a cerrar el popover", () => {
    act(() => root.render(<PopoverHarness onOpenChange={() => undefined} />));
    act(() => container.querySelector("button")?.click());

    act(() => container.querySelector("button")?.click());

    expect(container.textContent).not.toContain("Contenido");
  });

  it("pointerdown dentro no cierra el popover", () => {
    act(() => root.render(<PopoverHarness onOpenChange={() => undefined} />));
    const trigger = container.querySelector("button")!;
    act(() => trigger.click());

    act(() => trigger.dispatchEvent(new Event("pointerdown", { bubbles: true })));

    expect(container.textContent).toContain("Contenido");
  });

  it("pointerdown fuera cierra el popover", () => {
    act(() => root.render(<PopoverHarness onOpenChange={() => undefined} />));
    act(() => container.querySelector("button")?.click());

    act(() => document.body.dispatchEvent(new Event("pointerdown", { bubbles: true })));

    expect(container.textContent).not.toContain("Contenido");
  });

  it("Escape cierra el popover", () => {
    act(() => root.render(<PopoverHarness onOpenChange={() => undefined} />));
    act(() => container.querySelector("button")?.click());

    act(() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })));

    expect(container.textContent).not.toContain("Contenido");
  });

  it("Escape restaura el foco al trigger", () => {
    const outside = document.createElement("button");
    document.body.append(outside);
    act(() => root.render(<PopoverHarness onOpenChange={() => undefined} />));
    act(() => container.querySelector("button")?.click());
    outside.focus();

    act(() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })));

    expect(document.activeElement).toBe(container.querySelector("button"));
    outside.remove();
  });

  it("limpia los listeners al cerrar y al desmontar", () => {
    const removeListener = vi.spyOn(document, "removeEventListener");
    act(() => root.render(<PopoverHarness onOpenChange={() => undefined} />));
    act(() => container.querySelector("button")?.click());

    act(() => container.querySelector("button")?.click());
    expect(removeListener.mock.calls.some(([type]) => type === "pointerdown")).toBe(true);

    act(() => container.querySelector("button")?.click());
    act(() => root.unmount());
    mounted = false;

    expect(removeListener.mock.calls.some(([type]) => type === "keydown")).toBe(true);
    removeListener.mockRestore();
  });
});
