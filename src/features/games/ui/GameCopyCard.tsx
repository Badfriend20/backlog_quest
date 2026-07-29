import type { BacklogData, CrossCopyProgress, GameCopy } from "../../../shared/kernel/backlog";
import {
  copyDeviceIds,
  copyDeviceLabel,
  CROSS_COPY_PROGRESS_HELP,
  CROSS_COPY_PROGRESS_OPTIONS,
  crossCopyProgressLabel,
  getSlotLabel,
} from "../../../shared/kernel/backlogSelectors";
import { FormGrid, HelpTooltip, RelationSummaryGrid } from "../../../shared/ui";
import { DeviceMultiSelect } from "../../devices";
import { EditableRelationCard } from "./EditableRelationCard";
import type { GameEditorController } from "./useGameEditor";

export function GameCopyCard({
  data,
  copy,
  editor,
}: {
  data: BacklogData;
  copy: GameCopy;
  editor: GameEditorController;
}) {
  const {
    draft,
    editingCopyId,
    beginCopyEdit,
    saveCopyEdit,
    discardCopyEdit,
    missionCopyIds,
    copyPlatforms,
    updateCopy,
    updateCopyPlatform,
    updateCopyDevices,
    removeCopy,
  } = editor;
  const editing = editingCopyId === copy.id;
  const usedByMission = missionCopyIds.has(copy.id);
  const linked = draft.playthroughs.filter(play => play.copyId === copy.id).length;
  const selectedDeviceIds = copyDeviceIds(data, copy);

  return (
    <EditableRelationCard
      editing={editing}
      identifier={copy.id}
      title={copy.library || "Copia sin plataforma"}
      badges={
        <>
          {usedByMission && <span>EN MISIÓN</span>}
          {linked > 0 && (
            <span>
              {linked} PARTIDA{linked === 1 ? "" : "S"}
            </span>
          )}
        </>
      }
      itemLabel="copia"
      deleteMessage={`Se eliminará la copia ${copy.library || copy.id}. Las misiones y partidas vinculadas se conservarán sin copia.`}
      onEdit={() => beginCopyEdit(copy.id)}
      onRemove={() => removeCopy(copy.id)}
      onSave={saveCopyEdit}
      onDiscard={discardCopyEdit}
      summary={
        <>
          <RelationSummaryGrid>
            <div>
              <dt>Propiedad</dt>
              <dd>{copy.ownership}</dd>
            </div>
            <div>
              <dt>Dispositivos</dt>
              <dd>{copyDeviceLabel(data, copy)}</dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>{copy.status}</dd>
            </div>
            <div>
              <dt>Prioridad</dt>
              <dd>{copy.priority}</dd>
            </div>
            <div>
              <dt>Sesión ideal</dt>
              <dd>{copy.idealSession}</dd>
            </div>
            <div>
              <dt>Progreso entre copias</dt>
              <dd>{crossCopyProgressLabel(copy.crossCopyProgress)}</dd>
            </div>
          </RelationSummaryGrid>
          {copy.notes && <p className="copy-summary-notes">{copy.notes}</p>}
        </>
      }
      editor={
          <FormGrid $compact>
            <label>
              <span>Plataforma</span>
              <select
                value={copy.platformId ?? ""}
                onChange={event => updateCopyPlatform(copy.id, event.target.value)}
              >
                <option value="">Selecciona una plataforma</option>
                {copyPlatforms.map(platform => (
                  <option key={platform.id} value={platform.id}>
                    {platform.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="field-block wide-field">
              <span>Dispositivo(s)</span>
              <DeviceMultiSelect
                data={data}
                selectedIds={selectedDeviceIds}
                onChange={ids => updateCopyDevices(copy.id, ids)}
              />
              <small>Las opciones provienen de la vista Dispositivos.</small>
            </div>
            <label>
              <span>Propiedad</span>
              <select
                value={copy.ownership}
                onChange={event => updateCopy(copy.id, { ownership: event.target.value })}
              >
                {data.catalogs.ownership.map(item => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Estado de la copia</span>
              <input
                value={copy.status}
                onChange={event => updateCopy(copy.id, { status: event.target.value })}
              />
            </label>
            <label>
              <span>Prioridad</span>
              <select
                value={copy.priority}
                onChange={event => updateCopy(copy.id, { priority: event.target.value })}
              >
                {data.catalogs.priorities.map(item => (
                  <option key={item.id}>{item.label}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Sesión ideal</span>
              <select
                value={copy.idealSession}
                onChange={event => updateCopy(copy.id, { idealSession: event.target.value })}
              >
                <option>{getSlotLabel(data, "first")}</option>
                <option>{getSlotLabel(data, "second")}</option>
                <option>{getSlotLabel(data, "secondary")}</option>
                <option>{getSlotLabel(data, "flexible")}</option>
              </select>
            </label>
            <label>
              <HelpTooltip label="Progreso entre copias" tooltip={CROSS_COPY_PROGRESS_HELP} />
              <select
                value={copy.crossCopyProgress}
                onChange={event =>
                  updateCopy(copy.id, {
                    crossCopyProgress: event.target.value as CrossCopyProgress,
                  })
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
              <span>Notas</span>
              <textarea
                rows={2}
                value={copy.notes}
                onChange={event => updateCopy(copy.id, { notes: event.target.value })}
              />
            </label>
          </FormGrid>
      }
    />
  );
}
