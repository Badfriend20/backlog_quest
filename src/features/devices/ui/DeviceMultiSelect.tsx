import type { BacklogData } from "../../../shared/kernel/backlog";
import { DevicesStyles } from "./DevicesStyles";

export function DeviceMultiSelect({
  data,
  selectedIds,
  onChange,
}: {
  data: BacklogData;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const platforms = data.platforms.filter(
    platform => platform.active || selectedIds.includes(platform.id)
  );
  return (
    <fieldset className="device-selector">
      <DevicesStyles />
      <legend className="visually-hidden">Dispositivos disponibles</legend>
      {platforms.map(platform => (
        <label
          className={selectedIds.includes(platform.id) ? "device-option selected" : "device-option"}
          key={platform.id}
        >
          <input
            type="checkbox"
            checked={selectedIds.includes(platform.id)}
            onChange={event =>
              onChange(
                event.target.checked
                  ? [...selectedIds, platform.id]
                  : selectedIds.filter(id => id !== platform.id)
              )
            }
          />
          <span>{platform.name}</span>
        </label>
      ))}
      {!platforms.length && <small>No hay dispositivos activos en Configuración.</small>}
    </fieldset>
  );
}
