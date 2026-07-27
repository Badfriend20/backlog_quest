import { useState } from "react";
import type { BacklogData, CopyPlatform } from "../../../shared/kernel/backlog";
import {
  normalize,
  normalizeCopyPlatforms,
  resolveCopyPlatform,
} from "../../../shared/kernel/backlogSelectors";
import { ConfirmationModal } from "../../../shared/ui";

const PLATFORM_NAME_MAX_LENGTH = 40;

export function PlatformSettingsSection({
  data,
  onChange,
}: {
  data: BacklogData;
  onChange: (platforms: CopyPlatform[]) => void;
}) {
  const [draft, setDraft] = useState<CopyPlatform[]>(() =>
    structuredClone(data.catalogs.platforms)
  );
  const [pendingRemoval, setPendingRemoval] = useState<CopyPlatform>();

  function update(id: string, patch: Partial<CopyPlatform>) {
    setDraft(current => current.map(item => (item.id === id ? { ...item, ...patch } : item)));
  }

  function add() {
    setDraft(current => [
      ...current,
      { id: `platform-${Date.now()}`, name: "Nueva plataforma", active: true },
    ]);
  }

  function usage(platform: CopyPlatform): number {
    const copies = data.games
      .flatMap(game => game.copies)
      .filter(
        copy =>
          resolveCopyPlatform(data.catalogs.platforms, copy.platformId, copy.library)?.id ===
          platform.id
      ).length;
    const presets = data.preferences.quickCopyPresets.filter(
      preset =>
        resolveCopyPlatform(data.catalogs.platforms, preset.platformId, preset.library)?.id ===
        platform.id
    ).length;
    return copies + presets;
  }

  function remove(platform: CopyPlatform) {
    if (usage(platform) > 0) {
      window.alert(
        "Esta plataforma está vinculada a copias o agregados rápidos. Renómbrala con el nombre de otra plataforma y guarda para fusionarlas."
      );
      return;
    }
    setPendingRemoval(platform);
  }

  function confirmRemoval() {
    if (!pendingRemoval) return;
    setDraft(current => current.filter(item => item.id !== pendingRemoval.id));
    setPendingRemoval(undefined);
  }

  const duplicateNames = new Set(
    draft
      .map(item => normalize(item.name.trim()))
      .filter((name, index, all) => name && all.indexOf(name) !== index)
  );

  return (
    <section className="settings-card wide">
      <div className="settings-section-heading">
        <div>
          <p className="eyebrow">PLATAFORMAS</p>
          <h2>Bibliotecas y ecosistemas de las copias</h2>
          <p>
            Una plataforma se combina con una propiedad. Si dos entradas representan la misma,
            asígnales el mismo nombre y al guardar se fusionarán sin perder sus copias.
          </p>
        </div>
        <button type="button" className="ghost-button" onClick={add}>
          + Plataforma
        </button>
      </div>
      <div className="device-settings-list">
        {draft.map(platform => {
          const nameKey = normalize(platform.name.trim());
          return (
            <article className="device-settings-card" key={platform.id}>
              <div className="form-grid compact-form">
                <label>
                  <span>Nombre</span>
                  <input
                    maxLength={PLATFORM_NAME_MAX_LENGTH}
                    value={platform.name}
                    onChange={event => update(platform.id, { name: event.target.value })}
                  />
                  <small>
                    {platform.name.length}/{PLATFORM_NAME_MAX_LENGTH}
                  </small>
                </label>
                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={platform.active}
                    onChange={event => update(platform.id, { active: event.target.checked })}
                  />
                  <span>Disponible en nuevas copias</span>
                </label>
              </div>
              {duplicateNames.has(nameKey) && (
                <p className="callout mini">
                  Se fusionará con la otra plataforma del mismo nombre.
                </p>
              )}
              <div className="relation-actions">
                <small>{usage(platform)} referencias</small>
                <button
                  type="button"
                  className="danger-button compact"
                  onClick={() => remove(platform)}
                >
                  Eliminar
                </button>
              </div>
            </article>
          );
        })}
      </div>
      <div className="modal-actions inline-actions">
        <button
          type="button"
          className="ghost-button"
          onClick={() => setDraft(structuredClone(data.catalogs.platforms))}
        >
          Descartar
        </button>
        <button
          type="button"
          className="primary-button"
          disabled={draft.some(item => !item.name.trim())}
          onClick={() => {
            onChange(draft);
            setDraft(normalizeCopyPlatforms(draft));
          }}
        >
          Guardar plataformas
        </button>
      </div>
      {pendingRemoval && (
        <ConfirmationModal
          title="Eliminar plataforma"
          message={`Se eliminará ${pendingRemoval.name} de las opciones disponibles.`}
          confirmLabel="Eliminar plataforma"
          onConfirm={confirmRemoval}
          onClose={() => setPendingRemoval(undefined)}
        />
      )}
    </section>
  );
}
