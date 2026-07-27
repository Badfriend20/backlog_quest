import { useState } from "react";
import type { BacklogData, CompletionFormValue, Mission } from "../../../shared/kernel/backlog";
import {
  copyDeviceIds,
  copyDeviceLabel,
  deviceName,
  inferDeviceIds,
} from "../../../shared/kernel/backlogSelectors";
import { DeviceSelect } from "../../devices";
import { Modal } from "../../../shared/ui";
import { MissionsStyles } from "./MissionsStyles";

export function CompletionModal({
  data,
  mission,
  onClose,
  onComplete,
}: {
  data: BacklogData;
  mission: Mission;
  onClose: () => void;
  onComplete: (form: CompletionFormValue) => void;
}) {
  const game = data.games.find(item => item.id === mission.gameId)!;
  const linkedPlaythrough = game.playthroughs.find(play => play.id === mission.playthroughId);
  const missionCopy = game.copies.find(copy => copy.id === mission.copyId);
  const [result, setResult] = useState<CompletionFormValue["result"]>("Terminado");
  const [scope, setScope] = useState<CompletionFormValue["scope"]>(
    mission.contentType === "dlc" ? "content" : "game"
  );
  const [replayIntent, setReplayIntent] = useState<CompletionFormValue["replayIntent"]>("maybe");
  const [copyId, setCopyId] = useState(mission.copyId);
  const selectedCopy = game.copies.find(copy => copy.id === copyId) ?? game.copies[0];
  const allowedDeviceIds = copyDeviceIds(data, selectedCopy);
  const [deviceId, setDeviceId] = useState(
    mission.activeDeviceId ??
      inferDeviceIds(data, mission.activeDevice)[0] ??
      allowedDeviceIds[0] ??
      ""
  );
  const device = deviceId ? deviceName(data, deviceId) : "Por confirmar";
  const [notes, setNotes] = useState("");
  function selectCopy(nextCopyId: string) {
    setCopyId(nextCopyId);
    const nextCopy = game.copies.find(copy => copy.id === nextCopyId);
    const nextDeviceIds = copyDeviceIds(data, nextCopy);
    setDeviceId(current => (nextDeviceIds.includes(current) ? current : (nextDeviceIds[0] ?? "")));
  }
  return (
    <Modal title={`Cerrar misión: ${game.title}`} eyebrow={mission.contentTitle} onClose={onClose}>
      <MissionsStyles />
      <div className="relation-summary">
        <div>
          <span>Partida vinculada</span>
          <strong>
            {linkedPlaythrough
              ? `#${linkedPlaythrough.number} · ${linkedPlaythrough.status}`
              : "Se creará al cerrar"}
          </strong>
        </div>
        <div>
          <span>Copia actual</span>
          <strong>
            {missionCopy ? `${missionCopy.library} · ${missionCopy.ownership}` : "Por confirmar"}
          </strong>
        </div>
        <div>
          <span>Dispositivo actual</span>
          <strong>
            {mission.activeDeviceId
              ? deviceName(data, mission.activeDeviceId)
              : mission.activeDevice || "Por confirmar"}
          </strong>
        </div>
      </div>
      <div className="form-grid">
        <label>
          <span>Resultado</span>
          <select
            value={result}
            onChange={event => setResult(event.target.value as CompletionFormValue["result"])}
          >
            <option>Terminado</option>
            <option>Completado</option>
          </select>
          <small>Terminado: objetivo principal. Completado: hiciste todo lo que querías.</small>
        </label>
        <label>
          <span>Qué estás cerrando</span>
          <select
            value={scope}
            onChange={event => setScope(event.target.value as CompletionFormValue["scope"])}
          >
            <option value="content">Solo {mission.contentTitle}</option>
            <option value="game">Todo el juego</option>
          </select>
        </label>
        <label>
          <span>¿Lo rejugarías?</span>
          <select
            value={replayIntent}
            onChange={event =>
              setReplayIntent(event.target.value as CompletionFormValue["replayIntent"])
            }
          >
            <option value="yes">Sí, mandarlo a la mitad</option>
            <option value="maybe">Quizá, último tercio</option>
            <option value="no">No, mandarlo al final</option>
          </select>
        </label>
        <label>
          <span>Copia utilizada</span>
          <select value={copyId} onChange={event => selectCopy(event.target.value)}>
            {game.copies.map(copy => (
              <option key={copy.id} value={copy.id}>
                {copy.library} · {copyDeviceLabel(data, copy)} · {copy.ownership}
              </option>
            ))}
          </select>
          <small>Esta copia quedará registrada en la partida y en el historial.</small>
        </label>
        <label htmlFor="completion-device">
          <span>Dispositivo final</span>
          <DeviceSelect
            id="completion-device"
            data={data}
            selectedId={deviceId}
            allowedIds={allowedDeviceIds}
            onChange={setDeviceId}
          />
        </label>
        <label className="wide-field">
          <span>Notas finales</span>
          <textarea
            rows={3}
            value={notes}
            onChange={event => setNotes(event.target.value)}
            placeholder="Jefe final, dificultad, opinión…"
          />
        </label>
      </div>
      <div className="modal-actions">
        <button type="button" className="ghost-button" onClick={onClose}>
          Cancelar
        </button>
        <button
          type="button"
          className="primary-button"
          onClick={() =>
            onComplete({ result, scope, replayIntent, copyId, device, deviceId, notes })
          }
        >
          Confirmar cierre
        </button>
      </div>
    </Modal>
  );
}
