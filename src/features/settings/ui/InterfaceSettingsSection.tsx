import type { BacklogData } from "../../../shared/kernel/backlog";
import type { SettingsChangeHandler } from "./settingsTypes";

export function InterfaceSettingsSection({
  data,
  onChange,
}: {
  data: BacklogData;
  onChange: SettingsChangeHandler;
}) {
  return (
    <section className="settings-card">
      <p className="eyebrow">INTERFAZ</p>
      <h2>Presentación</h2>
      <div className="settings-form">
        <div className="setting-with-description">
          <label className="check-row">
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
            <span>Vista compacta de tarjetas y cola</span>
          </label>
          <small>
            Reduce el relleno y los espacios verticales en Inicio, Biblioteca y Cola; no oculta
            informaciÃ³n.
          </small>
        </div>
        <label className="check-row">
          <input
            type="checkbox"
            checked={data.preferences.showTooltips}
            onChange={event =>
              onChange({ showTooltips: event.target.checked }, "Tooltips actualizados.")
            }
          />
          <span>Mostrar explicaciones en chips</span>
        </label>
        <label className="check-row">
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
          <span>Ocultar juegos privados por defecto</span>
        </label>
        <label className="check-row">
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
        </label>
      </div>
    </section>
  );
}
