export function HelpTooltip({ label, tooltip }: { label: string; tooltip: string }) {
  return (
    <span className="field-label-with-help">
      {label}
      <button
        type="button"
        className="help-tooltip tooltip-anchor"
        data-tooltip={tooltip}
        aria-label={`${label}: ${tooltip}`}
      >
        ?
      </button>
    </span>
  );
}
