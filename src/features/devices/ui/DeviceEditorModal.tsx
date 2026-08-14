import { useState } from "react";
import type { Channel, QuestData, Resource } from "../../../shared/kernel/quest";
import { addChannel } from "../../../shared/kernel/channelCatalog";
import {
  Button,
  CardActions,
  CheckRow,
  ConfirmationModal,
  FormGrid,
  InlineCreateField,
  Modal,
  ModalActions,
} from "../../../shared/ui";
import { deviceUsageCount, removeUnusedDevice, saveDevice } from "../domain/deviceCatalog";

interface DeviceEditorModalProps {
  data: QuestData;
  device: Resource;
  isNew: boolean;
  onChange(platforms: Resource[]): void;
  onCopyPlatformsChange(platforms: Channel[]): void;
  onClose(): void;
}

export function DeviceEditorModal({
  data,
  device,
  isNew,
  onChange,
  onCopyPlatformsChange,
  onClose,
}: DeviceEditorModalProps) {
  const [draft, setDraft] = useState<Resource>(() => structuredClone(device));
  const [confirmingRemoval, setConfirmingRemoval] = useState(false);
  const usageCount = isNew ? 0 : deviceUsageCount(data, device.id);
  const priorityOptions = data.catalogs.priorities.map(priority => priority.label);
  const visiblePriorities = priorityOptions.includes(draft.priority)
    ? priorityOptions
    : [draft.priority, ...priorityOptions];

  function update(patch: Partial<Resource>) {
    setDraft(current => ({ ...current, ...patch }));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    onChange(saveDevice(data.platforms, draft));
    onClose();
  }

  function remove() {
    const platforms = removeUnusedDevice(data, device.id);
    if (!platforms) return;
    onChange(platforms);
    onClose();
  }

  return (
    <>
      <Modal
        eyebrow="RECURSOS"
        title={isNew ? "Nuevo recurso" : `Editar ${device.name}`}
        onClose={onClose}
      >
        <form onSubmit={submit}>
          <FormGrid>
            <label>
              <span>Nombre</span>
              <input
                value={draft.name}
                maxLength={80}
                onChange={event => update({ name: event.target.value })}
              />
            </label>
            <label>
              <span>Tipo</span>
              <input
                value={draft.kind}
                maxLength={40}
                onChange={event => update({ kind: event.target.value })}
              />
            </label>
            <label>
              <span>Prioridad</span>
              <select
                value={draft.priority}
                onChange={event => update({ priority: event.target.value })}
              >
                {visiblePriorities.map(priority => (
                  <option key={priority}>{priority}</option>
                ))}
              </select>
            </label>
            <CheckRow>
              <input
                type="checkbox"
                checked={draft.active}
                onChange={event => update({ active: event.target.checked })}
              />
              <span>Disponible en selectores</span>
            </CheckRow>
            <label className="wide-field">
              <span>Notas</span>
              <textarea
                rows={3}
                value={draft.notes}
                maxLength={500}
                onChange={event => update({ notes: event.target.value })}
              />
            </label>
          </FormGrid>

          <div className="device-channel-tools">
            <div>
              <strong>Plataformas o canales</strong>
              <p>Agrégalos aquí para usarlos después en las modalidades de cualquier actividad.</p>
            </div>
            <InlineCreateField
              buttonLabel="+ Crear plataforma"
              inputLabel="Nombre de la plataforma"
              placeholder="Ej. Steam, Xbox, físico…"
              onCreate={name => {
                const result = addChannel(data.catalogs.platforms, name);
                onCopyPlatformsChange(result.channels);
              }}
            />
          </div>

          {!isNew && (
            <div className="device-reference-summary">
              <strong>{usageCount} referencias activas</strong>
              <span>
                {usageCount
                  ? "Reasigna sus modalidades, recorridos o misiones antes de eliminarlo."
                  : "Este recurso puede eliminarse sin romper relaciones."}
              </span>
            </div>
          )}

          <ModalActions $split>
            <div>
              {!isNew && (
                <Button
                  variant="danger"
                  disabled={usageCount > 0}
                  onClick={() => setConfirmingRemoval(true)}
                >
                  Eliminar
                </Button>
              )}
            </div>
            <CardActions>
              <Button onClick={onClose}>Cancelar</Button>
              <Button type="submit" variant="primary">
                {isNew ? "Agregar recurso" : "Guardar cambios"}
              </Button>
            </CardActions>
          </ModalActions>
        </form>
      </Modal>
      {confirmingRemoval && (
        <ConfirmationModal
          title="Eliminar recurso"
          message={`Se eliminará ${device.name} del catálogo de recursos.`}
          confirmLabel="Eliminar recurso"
          onConfirm={remove}
          onClose={() => setConfirmingRemoval(false)}
        />
      )}
    </>
  );
}
