import type { QuestData } from "../../../shared/kernel/quest";

export function DeviceSelect({
  id,
  data,
  selectedId,
  allowedIds,
  onChange,
  allowUnknown = true,
}: {
  id?: string;
  data: QuestData;
  selectedId: string;
  allowedIds?: string[];
  onChange: (id: string) => void;
  allowUnknown?: boolean;
}) {
  const allowed = allowedIds?.length ? new Set(allowedIds) : null;
  const platforms = data.platforms.filter(
    platform =>
      (platform.active || platform.id === selectedId) && (!allowed || allowed.has(platform.id))
  );
  return (
    <select id={id} value={selectedId} onChange={event => onChange(event.target.value)}>
      {allowUnknown && <option value="">Por confirmar</option>}
      {platforms.map(platform => (
        <option key={platform.id} value={platform.id}>
          {platform.name}
        </option>
      ))}
    </select>
  );
}
