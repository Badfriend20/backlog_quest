import type { QuestData } from "../../../shared/kernel/quest";
import { CheckRow, Eyebrow } from "../../../shared/ui";
import type { SettingsChangeHandler } from "./settingsTypes";
import { SettingsCard } from "./SettingsStyles";

export function QueueSettingsSection({
  data,
  onChange,
}: {
  data: QuestData;
  onChange: SettingsChangeHandler;
}) {
  return (
    <SettingsCard>
      <Eyebrow>LISTA</Eyebrow>
      <h2>Comportamiento real</h2>
      <div className="settings-form">
        <label>
          <span>Recomendaciones visibles</span>
          <input
            type="number"
            min="3"
            max="30"
            value={data.preferences.queueDisplayCount}
            onChange={event =>
              onChange(
                { queueDisplayCount: Number(event.target.value) },
                "Cantidad visible de recomendaciones actualizada."
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
        <CheckRow>
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
        </CheckRow>
      </div>
    </SettingsCard>
  );
}
