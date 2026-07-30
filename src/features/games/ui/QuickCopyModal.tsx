import { useState } from "react";
import type { QuestData, QuickVariantPreset } from "../../../shared/kernel/quest";
import {
  CROSS_COPY_PROGRESS_HELP,
  CROSS_COPY_PROGRESS_OPTIONS,
  accessMethodOptions,
  getSlotLabel,
  quickCopyKey,
  quickCopyLabel,
} from "../../../shared/kernel/questSelectors";
import {
  Button,
  EmptyState,
  Eyebrow,
  FormGrid,
  HelpTooltip,
  Modal,
  ModalActions,
} from "../../../shared/ui";
import { createQuickCopyPreset } from "../domain/quickCopy";

export function QuickCopyModal({
  data,
  presets,
  existingKeys,
  onUse,
  onClose,
}: {
  data: QuestData;
  presets: QuickVariantPreset[];
  existingKeys: Set<string>;
  onUse: (preset: QuickVariantPreset) => void;
  onClose: () => void;
}) {
  const platforms = data.catalogs.platforms.filter(platform => platform.active);
  const [platformId, setPlatformId] = useState(platforms[0]?.id ?? "");
  const library = platforms.find(platform => platform.id === platformId)?.name ?? "";
  const ownershipOptions = accessMethodOptions(data.catalogs.ownership);
  const [ownership, setOwnership] = useState(ownershipOptions[0]);
  const [priority, setPriority] = useState("Media");
  const [idealSession, setIdealSession] = useState(getSlotLabel(data, "flexible"));
  const [crossCopyProgress, setCrossCopyProgress] =
    useState<QuickVariantPreset["crossCopyProgress"]>("unknown");
  const [notes, setNotes] = useState("");
  function createCustom() {
    if (!library || existingKeys.has(quickCopyKey(library, ownership, platformId))) return;
    onUse(
      createQuickCopyPreset({
        platformId,
        library,
        ownership,
        deviceIds: [],
        priority,
        idealSession,
        crossCopyProgress,
        notes,
      })
    );
  }
  return (
    <Modal title="Opciones de agregado rápido" eyebrow="CANAL + FORMA DE ACCESO" onClose={onClose}>
      <div className="quick-option-list">
        {presets.map(preset => {
          const exists = existingKeys.has(preset.key);
          return (
            <button
              type="button"
              className="quick-add-button"
              key={preset.key}
              disabled={exists}
              onClick={() => onUse(preset)}
            >
              + {quickCopyLabel(preset, data.preferences.ownershipDisplayRules)}
              {exists && <small>Ya agregada</small>}
            </button>
          );
        })}
        {!presets.length && <EmptyState>Todavía no hay combinaciones guardadas.</EmptyState>}
      </div>
      <section className="quick-custom-form">
        <div>
          <Eyebrow>NUEVA COMBINACIÓN</Eyebrow>
          <h3>Configurar y agregar</h3>
          <p>
            Al guardar la actividad, esta combinación aparecerá primero en futuros agregados
            rápidos.
          </p>
        </div>
        <FormGrid $compact>
          <label>
            <span>Plataforma</span>
            <select value={platformId} onChange={event => setPlatformId(event.target.value)}>
              <option value="">Selecciona una plataforma</option>
              {platforms.map(platform => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Propiedad</span>
            <select value={ownership} onChange={event => setOwnership(event.target.value)}>
              {ownershipOptions.map(item => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Prioridad</span>
            <select value={priority} onChange={event => setPriority(event.target.value)}>
              {data.catalogs.priorities.map(item => (
                <option key={item.id}>{item.label}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Sesión ideal</span>
            <select value={idealSession} onChange={event => setIdealSession(event.target.value)}>
              <option>{getSlotLabel(data, "first")}</option>
              <option>{getSlotLabel(data, "second")}</option>
              <option>{getSlotLabel(data, "secondary")}</option>
              <option>{getSlotLabel(data, "flexible")}</option>
            </select>
          </label>
          <label>
            <HelpTooltip label="Progreso entre modalidades" tooltip={CROSS_COPY_PROGRESS_HELP} />
            <select
              value={crossCopyProgress}
              onChange={event =>
                setCrossCopyProgress(event.target.value as QuickVariantPreset["crossCopyProgress"])
              }
            >
              {CROSS_COPY_PROGRESS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="wide-field">
            <span>Notas predeterminadas</span>
            <textarea rows={2} value={notes} onChange={event => setNotes(event.target.value)} />
          </label>
        </FormGrid>
      </section>
      <ModalActions>
        <Button onClick={onClose}>Cerrar</Button>
        <Button
          variant="primary"
          disabled={!library || existingKeys.has(quickCopyKey(library, ownership, platformId))}
          onClick={createCustom}
        >
          Agregar esta modalidad
        </Button>
      </ModalActions>
    </Modal>
  );
}
