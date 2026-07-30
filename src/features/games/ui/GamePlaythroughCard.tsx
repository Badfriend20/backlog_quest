import type { QuestData, Journey } from "../../../shared/kernel/quest";
import {
  copyDeviceIds,
  copyDeviceLabel,
  deviceName,
  inferDeviceIds,
} from "../../../shared/kernel/questSelectors";
import { FormGrid, RelationSummaryGrid } from "../../../shared/ui";
import { DeviceSelect } from "../../devices";
import { EditableRelationCard } from "./EditableRelationCard";
import type { GameEditorController } from "./useGameEditor";
import {
  activityStatusLabel,
  activityStatusOptions,
  canonicalActivityStatus,
  capitalizeTerm,
  useVocabulary,
} from "../../../shared/vocabulary";

export function GamePlaythroughCard({
  data,
  play,
  editor,
}: {
  data: QuestData;
  play: Journey;
  editor: GameEditorController;
}) {
  const terms = useVocabulary();
  const {
    draft,
    editingPlaythroughId,
    beginPlaythroughEdit,
    savePlaythroughEdit,
    discardPlaythroughEdit,
    updatePlaythrough,
    removePlaythrough,
  } = editor;
  const editing = editingPlaythroughId === play.id;
  const selectedCopy = draft.copies.find(copy => copy.id === play.copyId);
  const selectedContent = draft.contents.find(content => content.id === play.contentId);
  const allowedDeviceIds = selectedCopy
    ? copyDeviceIds(data, selectedCopy)
    : data.platforms.filter(platform => platform.active).map(platform => platform.id);
  const selectedDeviceId = play.deviceId ?? inferDeviceIds(data, play.device)[0] ?? "";
  const linkedMission = data.missions.find(mission => mission.playthroughId === play.id);
  const copyLabel = selectedCopy
    ? `${selectedCopy.library} · ${selectedCopy.ownership}`
    : play.platform || "Por confirmar";

  return (
    <EditableRelationCard
      editing={editing}
      identifier={play.id}
      title={`${capitalizeTerm(terms.journey)} #${play.number}`}
      badges={
        <>
          {linkedMission && <span>MISIÓN {linkedMission.status.toUpperCase()}</span>}
          <span>{activityStatusLabel(play.status, terms)}</span>
        </>
      }
      itemLabel={terms.journey}
      deleteMessage={
        linkedMission
          ? `Se eliminará el ${terms.journey} #${play.number} y su historial editable. La ${terms.mission} ${linkedMission.id} permanecerá sin ${terms.journey} hasta que la edites y guardes nuevamente.`
          : `Se eliminará el ${terms.journey} #${play.number} y su historial editable.`
      }
      onEdit={() => beginPlaythroughEdit(play.id)}
      onRemove={() => removePlaythrough(play.id)}
      onSave={savePlaythroughEdit}
      onDiscard={discardPlaythroughEdit}
      summary={
        <>
          <RelationSummaryGrid>
            <div>
              <dt>{capitalizeTerm(terms.content)}</dt>
              <dd>{selectedContent?.title ?? play.contentTitle ?? "Contenido no disponible"}</dd>
            </div>
            <div>
              <dt>{capitalizeTerm(terms.variant)} utilizada</dt>
              <dd>{copyLabel}</dd>
            </div>
            <div>
              <dt>{capitalizeTerm(terms.resource)}</dt>
              <dd>{selectedDeviceId ? deviceName(data, selectedDeviceId) : "Por confirmar"}</dd>
            </div>
            <div>
              <dt>Fecha de inicio</dt>
              <dd>{play.startedAt || "Sin registrar"}</dd>
            </div>
            <div>
              <dt>Fecha final</dt>
              <dd>{play.finishedAt || "Sin registrar"}</dd>
            </div>
          </RelationSummaryGrid>
          {play.notes && <p className="copy-summary-notes">{play.notes}</p>}
        </>
      }
      editor={
        <>
          <FormGrid $compact>
            <label>
              <span>Número</span>
              <input
                type="number"
                min="1"
                value={play.number}
                onChange={event =>
                  updatePlaythrough(play.id, { number: Number(event.target.value) })
                }
              />
            </label>
            <label>
              <span>{capitalizeTerm(terms.content)}</span>
              <select
                value={play.contentId ?? ""}
                onChange={event => {
                  const content = draft.contents.find(item => item.id === event.target.value);
                  updatePlaythrough(play.id, {
                    contentId: content?.id,
                    contentTitle: content?.title,
                    contentType: content?.type,
                  });
                }}
              >
                <option value="" disabled>
                  {play.contentTitle ?? "Selecciona un contenido"}
                </option>
                {draft.contents.map(content => (
                  <option key={content.id} value={content.id}>
                    {content.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="wide-field">
              <span>{capitalizeTerm(terms.variant)} utilizada</span>
              <select
                value={play.copyId ?? ""}
                onChange={event =>
                  updatePlaythrough(play.id, {
                    copyId: event.target.value || undefined,
                  })
                }
              >
                <option value="" disabled>
                  Selecciona una {terms.variant}
                </option>
                {draft.copies.map(copy => (
                  <option key={copy.id} value={copy.id}>
                    {copy.library || `Sin ${terms.collection}`} · {copyDeviceLabel(data, copy)} ·{" "}
                    {copy.ownership}
                  </option>
                ))}
              </select>
              <small>
                {selectedCopy
                  ? `Se guardará como ${selectedCopy.library}.`
                  : `Selecciona una ${terms.variant} para vincular este ${terms.journey}.`}
              </small>
            </label>
            <label htmlFor={`playthrough-device-${play.id}`}>
              <span>{capitalizeTerm(terms.resource)} usado</span>
              <DeviceSelect
                id={`playthrough-device-${play.id}`}
                data={data}
                selectedId={selectedDeviceId}
                allowedIds={allowedDeviceIds}
                onChange={id => updatePlaythrough(play.id, { deviceId: id || undefined })}
              />
            </label>
            <label>
              <span>Estado</span>
              <select
                value={canonicalActivityStatus(play.status)}
                onChange={event => updatePlaythrough(play.id, { status: event.target.value })}
              >
                {activityStatusOptions(terms).map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Fecha de inicio</span>
              <input
                type="date"
                value={play.startedAt ?? ""}
                onChange={event =>
                  updatePlaythrough(play.id, {
                    startedAt: event.target.value || null,
                  })
                }
              />
            </label>
            <label>
              <span>Fecha final</span>
              <input
                type="date"
                value={play.finishedAt ?? ""}
                onChange={event =>
                  updatePlaythrough(play.id, {
                    finishedAt: event.target.value || null,
                  })
                }
              />
            </label>
            <label className="wide-field">
              <span>Notas</span>
              <textarea
                rows={2}
                value={play.notes}
                onChange={event => updatePlaythrough(play.id, { notes: event.target.value })}
              />
            </label>
          </FormGrid>
          <div className="playthrough-link-summary">
            <span>
              {capitalizeTerm(terms.variant)} registrada: <strong>{copyLabel}</strong>
            </span>
            <span>
              {capitalizeTerm(terms.resource)}:{" "}
              <strong>
                {selectedDeviceId ? deviceName(data, selectedDeviceId) : "Por confirmar"}
              </strong>
            </span>
          </div>
        </>
      }
    />
  );
}
