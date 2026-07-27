import type { ReactNode } from "react";

export function TooltipChip({
  enabled,
  tooltip,
  className,
  children,
}: {
  enabled: boolean;
  tooltip: string;
  className: string;
  children: ReactNode;
}) {
  if (!enabled) return <span className={className}>{children}</span>;

  return (
    <button
      type="button"
      className={`${className} tooltip-anchor`}
      data-tooltip={tooltip}
      aria-label={`${String(children)}: ${tooltip}`}
    >
      {children}
    </button>
  );
}
