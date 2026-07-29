import type { BacklogData } from "../../../shared/kernel/backlog";
import { Eyebrow } from "../../../shared/ui";
import type { SettingsChangeHandler } from "./settingsTypes";
import { SettingsCard } from "./SettingsStyles";

export function QueueSettingsSection({
  data,
  onChange,
}: {
  data: BacklogData;
  onChange: SettingsChangeHandler;
}) {
  return (
    <SettingsCard>
      <Eyebrow>LISTA</Eyebrow>
      <h2>Comportamiento real</h2>
      <div className="settings-form">
        <label>
          <span>Elementos visibles en Inicio</span>
          <input
            type="number"
            min="3"
            max="30"
            value={data.preferences.queueDisplayCount}
            onChange={event =>
              onChange(
                { queueDisplayCount: Number(event.target.value) },
                "Cantidad visible de la lista actualizada."
              )
            }
          />
        </label>
        <label>
          <span>Posición al aplazar</span>
          <input
            type="number"
            min="2"
            max={data.queue.length}
            value={data.preferences.deferPosition}
            onChange={event =>
              onChange(
                { deferPosition: Number(event.target.value) },
                "Posición de aplazamiento actualizada."
              )
            }
          />
        </label>
        <label className="check-row">
          <input
            type="checkbox"
            checked={data.preferences.autoSuggestNext}
            onChange={event =>
              onChange(
                { autoSuggestNext: event.target.checked },
                "Sugerencia posterior a terminar actualizada."
              )
            }
          />
          <span>Abrir la lista después de terminar</span>
        </label>
      </div>
    </SettingsCard>
  );
}
