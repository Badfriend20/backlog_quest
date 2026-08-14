import { useCallback, useEffect, useRef, useState } from "react";

export interface DismissiblePopoverController<TRoot extends HTMLElement = HTMLDivElement> {
  open: boolean;
  rootRef: React.RefObject<TRoot | null>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  toggle(): void;
  close(options?: { restoreFocus?: boolean }): void;
}

export function useDismissiblePopover<
  TRoot extends HTMLElement = HTMLDivElement,
>(): DismissiblePopoverController<TRoot> {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<TRoot>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const toggle = useCallback(() => setOpen(current => !current), []);
  const close = useCallback(({ restoreFocus = false } = {}) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    function closeFromOutside(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) close();
    }

    function closeFromKeyboard(event: KeyboardEvent) {
      if (event.key === "Escape") close({ restoreFocus: true });
    }

    document.addEventListener("pointerdown", closeFromOutside);
    document.addEventListener("keydown", closeFromKeyboard);
    return () => {
      document.removeEventListener("pointerdown", closeFromOutside);
      document.removeEventListener("keydown", closeFromKeyboard);
    };
  }, [close, open]);

  return {
    open,
    rootRef,
    triggerRef,
    toggle,
    close,
  };
}
