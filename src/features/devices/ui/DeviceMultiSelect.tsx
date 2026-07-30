import type { QuestData } from "../../../shared/kernel/quest";
import { DevicesScope } from "./DevicesStyles";

export function DeviceMultiSelect({
  data,
  selectedIds,
  onChange,
}: {
  data: QuestData;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const platforms = data.platforms.filter(
    platform => platform.active || selectedIds.includes(platform.id)
  );
  return (
    <DevicesScope>
      <fieldset className="device-selector">
        <legend className="visually-hidden">Recursos disponibles</legend>
        {platforms.map(platform => (
          <label
            className={
              selectedIds.includes(platform.id) ? "device-option selected" : "device-option"
            }
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
        {!platforms.length && <small>No hay recursos activos en Configuración.</small>}
      </fieldset>
    </DevicesScope>
  );
}
