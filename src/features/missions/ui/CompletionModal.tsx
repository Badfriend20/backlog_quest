import { useState } from "react";
import type { QuestData, CompletionFormValue, Mission } from "../../../shared/kernel/quest";
import {
  copyDeviceIds,
  copyDeviceLabel,
  deviceName,
  inferDeviceIds,
} from "../../../shared/kernel/questSelectors";
import { DeviceSelect } from "../../devices";
import { Button, FormGrid, Modal, ModalActions, RelationSummary } from "../../../shared/ui";
import { MissionsScope } from "./MissionsStyles";
import { activityStatusLabel, capitalizeTerm, useVocabulary } from "../../../shared/vocabulary";

export function CompletionModal({
  data,
  mission,
  onClose,
  onComplete,
}: {
  data: QuestData;
  mission: Mission;
  onClose: () => void;
  onComplete: (form: CompletionFormValue) => void;
}) {
  const terms = useVocabulary();
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
    <MissionsScope>
      <Modal
        title={`Cerrar misión: ${game.title}`}
        eyebrow={mission.contentTitle}
        onClose={onClose}
      >
        <RelationSummary>
          <div>
            <span>{capitalizeTerm(terms.journey)} vinculado</span>
            <strong>
              {linkedPlaythrough
                ? `#${linkedPlaythrough.number} · ${activityStatusLabel(linkedPlaythrough.status, terms)}`
                : "Se creará al cerrar"}
            </strong>
          </div>
          <div>
            <span>{capitalizeTerm(terms.variant)} actual</span>
            <strong>
              {missionCopy ? `${missionCopy.library} · ${missionCopy.ownership}` : "Por confirmar"}
            </strong>
          </div>
          <div>
            <span>{capitalizeTerm(terms.resource)} actual</span>
            <strong>
              {mission.activeDeviceId
                ? deviceName(data, mission.activeDeviceId)
                : mission.activeDevice || "Por confirmar"}
            </strong>
          </div>
        </RelationSummary>
        <FormGrid>
          <label>
            <span>Resultado</span>
            <select
              value={result}
              onChange={event => setResult(event.target.value as CompletionFormValue["result"])}
            >
              <option value="Terminado">{terms.statusFinished}</option>
              <option value="Completado">{terms.statusCompleted}</option>
            </select>
            <small>
              {terms.statusFinished}: objetivo principal. {terms.statusCompleted}: hiciste todo lo
              que querías.
            </small>
          </label>
          <label>
            <span>Qué estás cerrando</span>
            <select
              value={scope}
              onChange={event => setScope(event.target.value as CompletionFormValue["scope"])}
            >
              <option value="content">Solo {mission.contentTitle}</option>
              <option value="game">Toda la {terms.activity}</option>
            </select>
          </label>
          <label>
            <span>¿Quieres repetir esta {terms.activity}?</span>
            <select
              value={replayIntent}
              onChange={event =>
                setReplayIntent(event.target.value as CompletionFormValue["replayIntent"])
              }
            >
              <option value="yes">Sí, conservar como {terms.repetition} futura</option>
              <option value="maybe">Quizá, dejar para más adelante</option>
              <option value="no">No, archivar al final</option>
            </select>
          </label>
          <label>
            <span>{capitalizeTerm(terms.variant)} utilizada</span>
            <select value={copyId} onChange={event => selectCopy(event.target.value)}>
              <option value="">Sin {terms.variant} vinculada</option>
              {game.copies.map(copy => (
                <option key={copy.id} value={copy.id}>
                  {copy.library} · {copyDeviceLabel(data, copy)} · {copy.ownership}
                </option>
              ))}
            </select>
            <small>
              Si eliges una {terms.variant}, quedará registrada en el {terms.journey} y en el
              historial.
            </small>
          </label>
          <label htmlFor="completion-device">
            <span>{capitalizeTerm(terms.resource)} final</span>
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
              placeholder="Resultado, dificultad, opinión…"
            />
          </label>
        </FormGrid>
        <ModalActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            variant="primary"
            onClick={() =>
              onComplete({ result, scope, replayIntent, copyId, device, deviceId, notes })
            }
          >
            Confirmar cierre
          </Button>
        </ModalActions>
      </Modal>
    </MissionsScope>
  );
}
