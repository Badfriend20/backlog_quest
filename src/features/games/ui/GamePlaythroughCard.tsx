import type { BacklogData, Playthrough } from "../../../shared/kernel/backlog";
import {
  copyDeviceIds,
  copyDeviceLabel,
  deviceName,
  inferDeviceIds,
} from "../../../shared/kernel/backlogSelectors";
import { DeviceSelect } from "../../devices";
import { EditableRelationCard } from "./EditableRelationCard";
import type { GameEditorController } from "./useGameEditor";

export function GamePlaythroughCard({
  data,
  play,
  editor,
}: {
  data: BacklogData;
  play: Playthrough;
  editor: GameEditorController;
}) {
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
      title={`Partida #${play.number}`}
      badges={
        <>
          {linkedMission && <span>MISIÓN {linkedMission.status.toUpperCase()}</span>}
          <span>{play.status}</span>
        </>
      }
      itemLabel="partida"
      deleteMessage={`Se eliminará la partida #${play.number} y su historial editable.`}
      onEdit={() => beginPlaythroughEdit(play.id)}
      onRemove={() => removePlaythrough(play.id)}
      onSave={savePlaythroughEdit}
      onDiscard={discardPlaythroughEdit}
      summary={
        <>
          <dl className="relation-summary-grid">
            <div>
              <dt>Contenido</dt>
              <dd>{selectedContent?.title ?? "Campaña sin especificar"}</dd>
            </div>
            <div>
              <dt>Copia utilizada</dt>
              <dd>{copyLabel}</dd>
            </div>
            <div>
              <dt>Dispositivo</dt>
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
          </dl>
          {play.notes && <p className="copy-summary-notes">{play.notes}</p>}
        </>
      }
      editor={
        <>
          <div className="form-grid compact-form">
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
              <span>Contenido</span>
              <select
                value={play.contentId ?? ""}
                onChange={event =>
                  updatePlaythrough(play.id, {
                    contentId: event.target.value || undefined,
                  })
                }
              >
                <option value="">Campaña sin especificar</option>
                {draft.contents.map(content => (
                  <option key={content.id} value={content.id}>
                    {content.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="wide-field">
              <span>Copia utilizada</span>
              <select
                value={play.copyId ?? ""}
                onChange={event =>
                  updatePlaythrough(play.id, {
                    copyId: event.target.value || undefined,
                  })
                }
              >
                <option value="">Por confirmar</option>
                {draft.copies.map(copy => (
                  <option key={copy.id} value={copy.id}>
                    {copy.library || "Sin biblioteca"} · {copyDeviceLabel(data, copy)} ·{" "}
                    {copy.ownership}
                  </option>
                ))}
              </select>
              <small>
                {selectedCopy
                  ? `Se guardará como ${selectedCopy.library}.`
                  : "Selecciona una copia para vincular esta partida."}
              </small>
            </label>
            <label htmlFor={`playthrough-device-${play.id}`}>
              <span>Dispositivo usado</span>
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
                value={play.status}
                onChange={event => updatePlaythrough(play.id, { status: event.target.value })}
              >
                <option>Pendiente</option>
                <option>Jugando</option>
                <option>Pausado</option>
                <option>Terminado</option>
                <option>Completado</option>
                <option>Abandonado</option>
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
          </div>
          <div className="playthrough-link-summary">
            <span>
              Copia registrada: <strong>{copyLabel}</strong>
            </span>
            <span>
              Dispositivo:{" "}
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
