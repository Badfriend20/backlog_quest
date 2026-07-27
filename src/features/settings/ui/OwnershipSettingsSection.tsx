import { useState } from "react";
import type { BacklogData, OwnershipDisplayRules } from "../../../shared/kernel/backlog";
import {
  normalizeOwnershipDisplayRules,
  OWNERSHIP_LABEL_MAX_LENGTH,
  ownershipDisplayKey,
} from "../../../shared/kernel/backlogSelectors";
import type { SettingsChangeHandler } from "./settingsTypes";

export function OwnershipSettingsSection({
  data,
  onChange,
}: {
  data: BacklogData;
  onChange: SettingsChangeHandler;
}) {
  const [rules, setRules] = useState<OwnershipDisplayRules>(() =>
    normalizeOwnershipDisplayRules(data.catalogs.ownership, data.preferences.ownershipDisplayRules)
  );

  function updateRule(ownership: string, patch: Partial<OwnershipDisplayRules[string]>) {
    const key = ownershipDisplayKey(ownership);
    setRules(current => ({ ...current, [key]: { ...current[key], ...patch } }));
  }

  function save() {
    onChange(
      { ownershipDisplayRules: normalizeOwnershipDisplayRules(data.catalogs.ownership, rules) },
      "Presentación de propiedades actualizada."
    );
  }

  return (
    <section className="settings-card">
      <p className="eyebrow">PROPIEDADES</p>
      <h2>Presentación en agregado rápido</h2>
      <p className="settings-help">
        La propiedad real no cambia. Decide si se oculta o qué término breve se muestra en cada
        botón.
      </p>
      <div className="ownership-rule-list">
        {data.catalogs.ownership.map(ownership => {
          const key = ownershipDisplayKey(ownership);
          const rule = rules[key];
          return (
            <div className="ownership-rule-row" key={key}>
              <strong>{ownership}</strong>
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={rule.hidden}
                  onChange={event => updateRule(ownership, { hidden: event.target.checked })}
                />
                <span>Ocultar propiedad</span>
              </label>
              <label>
                <span>Texto a mostrar</span>
                <input
                  value={rule.label}
                  maxLength={OWNERSHIP_LABEL_MAX_LENGTH}
                  disabled={rule.hidden}
                  onChange={event => updateRule(ownership, { label: event.target.value })}
                />
                <small>
                  {rule.label.length}/{OWNERSHIP_LABEL_MAX_LENGTH}
                </small>
              </label>
            </div>
          );
        })}
      </div>
      <button type="button" className="primary-button compact" onClick={save}>
        Guardar presentación
      </button>
    </section>
  );
}
