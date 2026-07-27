import { useState } from "react";
import type { BacklogData, Platform } from "../../../shared/kernel/backlog";
import { ConfirmationModal, Modal } from "../../../shared/ui";
import { deviceUsageCount, removeUnusedDevice, saveDevice } from "../domain/deviceCatalog";

interface DeviceEditorModalProps {
  data: BacklogData;
  device: Platform;
  isNew: boolean;
  onChange(platforms: Platform[]): void;
  onClose(): void;
}

export function DeviceEditorModal({
  data,
  device,
  isNew,
  onChange,
  onClose,
}: DeviceEditorModalProps) {
  const [draft, setDraft] = useState<Platform>(() => structuredClone(device));
  const [confirmingRemoval, setConfirmingRemoval] = useState(false);
  const usageCount = isNew ? 0 : deviceUsageCount(data, device.id);
  const priorityOptions = data.catalogs.priorities.map(priority => priority.label);
  const visiblePriorities = priorityOptions.includes(draft.priority)
    ? priorityOptions
    : [draft.priority, ...priorityOptions];

  function update(patch: Partial<Platform>) {
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
        eyebrow="DISPOSITIVOS"
        title={isNew ? "Nuevo dispositivo" : `Editar ${device.name}`}
        onClose={onClose}
      >
        <form onSubmit={submit}>
          <div className="form-grid">
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
            <label className="check-row">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={event => update({ active: event.target.checked })}
              />
              <span>Disponible en selectores</span>
            </label>
            <label className="wide-field">
              <span>Rol actual</span>
              <input
                value={draft.currentRole}
                maxLength={120}
                onChange={event => update({ currentRole: event.target.value })}
              />
            </label>
            <label className="wide-field">
              <span>Notas</span>
              <textarea
                rows={3}
                value={draft.notes}
                maxLength={500}
                onChange={event => update({ notes: event.target.value })}
              />
            </label>
          </div>

          {!isNew && (
            <div className="device-reference-summary">
              <strong>{usageCount} referencias activas</strong>
              <span>
                {usageCount
                  ? "Reasigna sus copias, partidas o misiones antes de eliminarlo."
                  : "Este dispositivo puede eliminarse sin romper relaciones."}
              </span>
            </div>
          )}

          <div className="modal-actions split-actions">
            <div>
              {!isNew && (
                <button
                  type="button"
                  className="danger-button"
                  disabled={usageCount > 0}
                  onClick={() => setConfirmingRemoval(true)}
                >
                  Eliminar
                </button>
              )}
            </div>
            <div className="card-actions">
              <button type="button" className="ghost-button" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="primary-button">
                {isNew ? "Agregar dispositivo" : "Guardar cambios"}
              </button>
            </div>
          </div>
        </form>
      </Modal>
      {confirmingRemoval && (
        <ConfirmationModal
          title="Eliminar dispositivo"
          message={`Se eliminará ${device.name} del catálogo de dispositivos.`}
          confirmLabel="Eliminar dispositivo"
          onConfirm={remove}
          onClose={() => setConfirmingRemoval(false)}
        />
      )}
    </>
  );
}
