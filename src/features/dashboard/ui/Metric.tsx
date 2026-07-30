export function Metric({
  label,
  value,
  note,
}: {
  label: string;
  value: number | string;
  note: string;
}) {
  return (
    <CardSurface className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </CardSurface>
  );
}
import { CardSurface } from "../../../shared/ui";
