import type { QuestData } from "../../../shared/kernel/quest";
import { CheckRow, Eyebrow } from "../../../shared/ui";
import type { SettingsChangeHandler } from "./settingsTypes";
import { SettingsCard } from "./SettingsStyles";

export function InterfaceSettingsSection({
  data,
  onChange,
}: {
  data: QuestData;
  onChange: SettingsChangeHandler;
}) {
  return (
    <SettingsCard>
      <Eyebrow>INTERFAZ</Eyebrow>
      <h2>Presentación</h2>
      <div className="settings-form">
        <div className="setting-with-description">
          <CheckRow>
            <input
              type="checkbox"
              checked={data.preferences.compactCards}
              onChange={event =>
                onChange(
                  { compactCards: event.target.checked },
                  "Densidad de tarjetas actualizada."
                )
              }
            />
            <span>Vista compacta de tarjetas y lista</span>
          </CheckRow>
          <small>
            Reduce el relleno y los espacios verticales en Inicio, Colección y Lista; no oculta
            información.
          </small>
        </div>
        <CheckRow>
          <input
            type="checkbox"
            checked={data.preferences.showTooltips}
            onChange={event =>
              onChange({ showTooltips: event.target.checked }, "Tooltips actualizados.")
            }
          />
          <span>Mostrar explicaciones en chips</span>
        </CheckRow>
        <CheckRow>
          <input
            type="checkbox"
            checked={data.preferences.hidePrivateByDefault}
            onChange={event =>
              onChange(
                { hidePrivateByDefault: event.target.checked },
                "Privacidad predeterminada actualizada."
              )
            }
          />
          <span>Ocultar actividades privadas por defecto</span>
        </CheckRow>
        <CheckRow>
          <input
            type="checkbox"
            checked={data.preferences.confirmDestructiveActions}
            onChange={event =>
              onChange(
                { confirmDestructiveActions: event.target.checked },
                "Confirmaciones destructivas actualizadas."
              )
            }
          />
          <span>Confirmar abandonar o enviar al final</span>
        </CheckRow>
      </div>
    </SettingsCard>
  );
}
