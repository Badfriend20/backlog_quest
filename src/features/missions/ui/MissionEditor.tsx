import { useState } from "react";
import type { QuestData, Mission, MissionFormValue } from "../../../shared/kernel/quest";
import {
  copyDeviceIds,
  copyDeviceLabel,
  deviceName,
  inferDeviceIds,
  sortedQueue,
  unresolvedDependencies,
} from "../../../shared/kernel/questSelectors";
import { findScheduleConflicts } from "../../../shared/kernel/schedule";
import { DeviceSelect } from "../../devices";
import { Button, FormGrid, Modal, ModalActions } from "../../../shared/ui";
import { MissionScheduleField } from "./MissionScheduleField";
import { MissionsScope } from "./MissionsStyles";
import { capitalizeTerm, useVocabulary } from "../../../shared/vocabulary";

export function MissionEditor({
  data,
  mission,
  initialGameId,
  onClose,
  onSave,
  onManageContents,
}: {
  data: QuestData;
  mission: Mission | null;
  initialGameId: string | null;
  onClose: () => void;
  onSave: (form: MissionFormValue) => void;
  onManageContents: (gameId: string) => void;
}) {
  const terms = useVocabulary();
  const initialGame =
    data.games.find(game => game.id === (mission?.gameId ?? initialGameId)) ?? data.games[0];
  const [gameId, setGameId] = useState(initialGame.id);
  const game = data.games.find(item => item.id === gameId) ?? initialGame;
  const [copyId, setCopyId] = useState(
    mission?.copyId ??
      data.queue.find(item => item.gameId === game.id)?.preferredCopyId ??
      game.copies[0]?.id ??
      ""
  );
  const copy = game.copies.find(item => item.id === copyId) ?? game.copies[0];
  const availableDeviceIds = copyDeviceIds(data, copy);
  const preferredQueueItem = data.queue.find(item => item.gameId === game.id);
  const [activeDeviceId, setActiveDeviceId] = useState(
    mission?.activeDeviceId ??
      preferredQueueItem?.preferredDeviceId ??
      inferDeviceIds(data, mission?.activeDevice ?? preferredQueueItem?.preferredDevice ?? "")[0] ??
      availableDeviceIds[0] ??
      ""
  );
  const activeDevice = activeDeviceId ? deviceName(data, activeDeviceId) : "Por confirmar";
  const [contentId, setContentId] = useState(
    game.contents.some(content => content.id === mission?.contentId)
      ? (mission?.contentId ?? "")
      : (game.contents[0]?.id ?? "")
  );
  const initialSlotId =
    mission?.slotId ??
    data.queue.find(item => item.gameId === game.id)?.preferredSlotId ??
    "flexible";
  const existingRule = mission
    ? data.scheduleRules.find(rule => rule.missionId === mission.id)
    : null;
  const [sessions, setSessions] = useState(
    existingRule?.sessions ?? (mission ? [] : [{ weekday: 1, slotId: initialSlotId }])
  );
  const [durationMin, setDurationMin] = useState(existingRule?.durationMin ?? 30);
  const [durationMax, setDurationMax] = useState(existingRule?.durationMax ?? 60);
  const [notes, setNotes] = useState(mission?.notes ?? game.progress.chapter ?? "");
  const [replaceOccupied, setReplaceOccupied] = useState(false);
  const conflicts = findScheduleConflicts(data, sessions, mission?.id);
  const blockers = unresolvedDependencies(data, game);
  function selectGame(nextGameId: string) {
    const nextGame = data.games.find(item => item.id === nextGameId);
    if (!nextGame) return;
    setGameId(nextGameId);
    const preferred = data.queue.find(item => item.gameId === nextGameId);
    const nextCopy =
      nextGame.copies.find(item => item.id === preferred?.preferredCopyId) ?? nextGame.copies[0];
    setCopyId(nextCopy?.id ?? "");
    setActiveDeviceId(
      preferred?.preferredDeviceId ??
        inferDeviceIds(data, preferred?.preferredDevice ?? "")[0] ??
        copyDeviceIds(data, nextCopy)[0] ??
        ""
    );
    setContentId(nextGame.contents[0]?.id ?? "");
    setNotes(nextGame.progress.chapter || nextGame.notes || "");
  }
  function selectCopy(nextCopyId: string) {
    setCopyId(nextCopyId);
    const nextCopy = game.copies.find(item => item.id === nextCopyId);
    const nextDeviceIds = copyDeviceIds(data, nextCopy);
    setActiveDeviceId(current =>
      nextDeviceIds.includes(current) ? current : (nextDeviceIds[0] ?? "")
    );
  }
  return (
    <MissionsScope>
      <Modal
        title={
          mission ? `Editar ${terms.mission}: ${game.title}` : `Activar nueva ${terms.mission}`
        }
        eyebrow={
          mission
            ? mission.id
            : `${terms.variant.toUpperCase()} + ${terms.resource.toUpperCase()} + FRANJA`
        }
        onClose={onClose}
      >
        <FormGrid>
          <label className="wide-field">
            <span>{capitalizeTerm(terms.activity)}</span>
            <select
              value={gameId}
              disabled={Boolean(mission)}
              onChange={event => selectGame(event.target.value)}
            >
              {sortedQueue(data).map(item => {
                const candidate = data.games.find(current => current.id === item.gameId);
                return candidate ? (
                  <option key={candidate.id} value={candidate.id}>
                    {item.position}. {candidate.title}
                  </option>
                ) : null;
              })}
            </select>
          </label>
          {blockers.length > 0 && (
            <div className="dependency-warning wide-field">
              Orden recomendado: termina antes {blockers.map(item => item.title).join(", ")}. Puedes
              continuar si deseas, el software no llamará a la policía narrativa.
            </div>
          )}
          <label className="wide-field">
            <span>{capitalizeTerm(terms.content)}</span>
            <select value={contentId} onChange={event => setContentId(event.target.value)}>
              <option value="">Selecciona un {terms.content}</option>
              {game.contents.map(content => (
                <option key={content.id} value={content.id}>
                  {content.title}
                </option>
              ))}
            </select>
            <Button variant="text" onClick={() => onManageContents(game.id)}>
              Administrar {terms.contents} de la {terms.activity}
            </Button>
          </label>
          {!game.contents.length && (
            <div className="dependency-warning wide-field">
              Esta {terms.activity} aún no tiene {terms.contents}. Agrega al menos uno antes de
              activar la {terms.mission}.
            </div>
          )}
          <label className="wide-field">
            <span>{capitalizeTerm(terms.variant)} o versión</span>
            <select value={copyId} onChange={event => selectCopy(event.target.value)}>
              <option value="">Selecciona una {terms.variant}</option>
              {game.copies.map(item => (
                <option key={item.id} value={item.id}>
                  {item.library} · {copyDeviceLabel(data, item)} · {item.ownership}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="mission-device">
            <span>{capitalizeTerm(terms.resource)} en uso</span>
            <DeviceSelect
              id="mission-device"
              data={data}
              selectedId={activeDeviceId}
              allowedIds={availableDeviceIds}
              onChange={setActiveDeviceId}
              allowUnknown={false}
            />
          </label>
          <MissionScheduleField
            data={data}
            sessions={sessions}
            onChange={nextSessions => {
              setSessions(nextSessions);
              setReplaceOccupied(false);
            }}
          />
          {conflicts.length > 0 && (
            <div className="occupied-warning wide-field">
              <strong>
                Coincide en día y franja con{" "}
                {conflicts
                  .map(conflict => data.games.find(item => item.id === conflict.gameId)?.title)
                  .filter(Boolean)
                  .join(", ")}
              </strong>
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={replaceOccupied}
                  onChange={event => setReplaceOccupied(event.target.checked)}
                />
                <span>
                  Aplazar las misiones en conflicto a la posición {data.preferences.deferPosition}
                </span>
              </label>
            </div>
          )}
          <label>
            <span>Duración mínima</span>
            <input
              type="number"
              min="10"
              max="600"
              value={durationMin}
              onChange={event => setDurationMin(Number(event.target.value))}
            />
          </label>
          <label>
            <span>Duración máxima</span>
            <input
              type="number"
              min={durationMin}
              max="600"
              value={durationMax}
              onChange={event => setDurationMax(Number(event.target.value))}
            />
          </label>
          <label className="wide-field">
            <span>Objetivo o punto actual</span>
            <textarea rows={3} value={notes} onChange={event => setNotes(event.target.value)} />
          </label>
        </FormGrid>
        <ModalActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            variant="primary"
            disabled={
              !copyId ||
              !activeDeviceId ||
              !contentId ||
              Boolean(conflicts.length && !replaceOccupied)
            }
            onClick={() =>
              onSave({
                gameId,
                contentId,
                copyId,
                activeDevice,
                activeDeviceId,
                slotId: sessions[0]?.slotId ?? initialSlotId,
                sessions,
                durationMin,
                durationMax: Math.max(durationMin, durationMax),
                notes,
                replaceOccupied,
              })
            }
          >
            {mission ? "Guardar misión" : "Activar misión"}
          </Button>
        </ModalActions>
      </Modal>
    </MissionsScope>
  );
}
