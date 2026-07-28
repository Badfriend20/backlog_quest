import type { BacklogData } from "../../../shared/kernel/backlog";
import { Eyebrow } from "../../../shared/ui";
import type { SettingsChangeHandler } from "./settingsTypes";
import { SettingsCard } from "./SettingsStyles";

export function CalendarSettingsSection({
  data,
  onChange,
}: {
  data: BacklogData;
  onChange: SettingsChangeHandler;
}) {
  return (
    <SettingsCard>
      <Eyebrow>CALENDARIO</Eyebrow>
      <h2>Horizonte y semana</h2>
      <div className="settings-form">
        <label>
          <span>Semanas visibles</span>
          <input
            type="number"
            min="1"
            max="12"
            value={data.preferences.scheduleWeeks}
            onChange={event =>
              onChange(
                { scheduleWeeks: Number(event.target.value) },
                "Horizonte del calendario actualizado."
              )
            }
          />
        </label>
        <label>
          <span>La semana comienza</span>
          <select
            value={data.preferences.weekStartsOn}
            onChange={event =>
              onChange(
                { weekStartsOn: Number(event.target.value) as 0 | 1 },
                "Inicio de semana actualizado."
              )
            }
          >
            <option value={1}>Lunes</option>
            <option value={0}>Domingo</option>
          </select>
        </label>
      </div>
    </SettingsCard>
  );
}
