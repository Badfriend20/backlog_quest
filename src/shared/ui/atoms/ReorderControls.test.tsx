import { Children, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ReorderControls, type ReorderControlsProps } from "./ReorderControls";

type ReorderButton = ReactElement<{
  "aria-label": string;
  disabled?: boolean;
  onClick(): void;
}>;

function buttons(props: ReorderControlsProps): ReorderButton[] {
  const root = ReorderControls(props) as ReactElement<{ children: ReactNode }>;
  return Children.toArray(root.props.children) as ReorderButton[];
}

describe("ReorderControls", () => {
  it("expone movimientos accesibles y respeta sus límites", () => {
    const onMoveUp = vi.fn();
    const onMoveDown = vi.fn();
    const props = { onMoveUp, onMoveDown };
    const [up, down] = buttons(props);
    const disabledMarkup = renderToStaticMarkup(
      <ReorderControls {...props} upDisabled downDisabled />
    );

    expect(disabledMarkup).toContain('aria-label="Subir"');
    expect(disabledMarkup).toContain('aria-label="Bajar"');
    expect(disabledMarkup.match(/disabled=""/g)).toHaveLength(2);

    up.props.onClick();
    down.props.onClick();
    expect(onMoveUp).toHaveBeenCalledOnce();
    expect(onMoveDown).toHaveBeenCalledOnce();
  });
});
