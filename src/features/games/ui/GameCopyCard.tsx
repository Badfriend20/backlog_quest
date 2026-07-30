import type { QuestData, CrossCopyProgress, ActivityVariant } from "../../../shared/kernel/quest";
import {
  accessMethodOptions,
  copyDeviceIds,
  copyDeviceLabel,
  CROSS_COPY_PROGRESS_HELP,
  CROSS_COPY_PROGRESS_OPTIONS,
  crossCopyProgressLabel,
  getSlotLabel,
} from "../../../shared/kernel/questSelectors";
import { FormGrid, HelpTooltip, RelationSummaryGrid } from "../../../shared/ui";
import { DeviceMultiSelect } from "../../devices";
import { EditableRelationCard } from "./EditableRelationCard";
import type { GameEditorController } from "./useGameEditor";
import { capitalizeTerm, useVocabulary } from "../../../shared/vocabulary";

export function GameCopyCard({
  data,
  copy,
  editor,
}: {
  data: QuestData;
  copy: ActivityVariant;
  editor: GameEditorController;
}) {
  const terms = useVocabulary();
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
      title={copy.library || `${capitalizeTerm(terms.variant)} sin ${terms.channel}`}
      badges={
        <>
          {usedByMission && <span>EN MISIÓN</span>}
          {linked > 0 && (
            <span>
              {linked} {terms.journeys.toUpperCase()}
            </span>
          )}
        </>
      }
      itemLabel={terms.variant}
      deleteMessage={`Se eliminará la ${terms.variant} ${copy.library || copy.id}. Las ${terms.missions} y ${terms.journeys} vinculados se conservarán sin ${terms.variant}.`}
      onEdit={() => beginCopyEdit(copy.id)}
      onRemove={() => removeCopy(copy.id)}
      onSave={saveCopyEdit}
      onDiscard={discardCopyEdit}
      summary={
        <>
          <RelationSummaryGrid>
            <div>
              <dt>{capitalizeTerm(terms.accessMethod)}</dt>
              <dd>{copy.ownership}</dd>
            </div>
            <div>
              <dt>{capitalizeTerm(terms.resources)}</dt>
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
              <dt>Progreso entre {terms.variants}</dt>
              <dd>{crossCopyProgressLabel(copy.crossCopyProgress)}</dd>
            </div>
          </RelationSummaryGrid>
          {copy.notes && <p className="copy-summary-notes">{copy.notes}</p>}
        </>
      }
      editor={
        <FormGrid $compact>
          <label>
            <span>{capitalizeTerm(terms.channel)}</span>
            <select
              value={copy.platformId ?? ""}
              onChange={event => updateCopyPlatform(copy.id, event.target.value)}
            >
              <option value="">Selecciona un {terms.channel}</option>
              {copyPlatforms.map(platform => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))}
            </select>
          </label>
          <div className="field-block wide-field">
            <span>{capitalizeTerm(terms.resources)}</span>
            <DeviceMultiSelect
              data={data}
              selectedIds={selectedDeviceIds}
              onChange={ids => updateCopyDevices(copy.id, ids)}
            />
            <small>Las opciones provienen de la vista {capitalizeTerm(terms.resources)}.</small>
          </div>
          <label>
            <span>{capitalizeTerm(terms.accessMethod)}</span>
            <select
              value={copy.ownership}
              onChange={event => updateCopy(copy.id, { ownership: event.target.value })}
            >
              {accessMethodOptions(data.catalogs.ownership, copy.ownership).map(item => (
                <option key={item} value={item}>
                  {item}
                  {!data.catalogs.ownership.includes(item) && item === copy.ownership
                    ? " (histórico)"
                    : ""}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Estado de la {terms.variant}</span>
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
            <HelpTooltip
              label={`Progreso entre ${terms.variants}`}
              tooltip={CROSS_COPY_PROGRESS_HELP}
            />
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
