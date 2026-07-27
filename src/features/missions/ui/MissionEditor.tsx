import { useState } from "react";
import type { BacklogData, Mission, MissionFormValue } from "../../../shared/kernel/backlog";
import {
  copyDeviceIds,
  copyDeviceLabel,
  deviceName,
  inferDeviceIds,
  getSlotLabel,
  sortedQueue,
  unresolvedDependencies,
} from "../../../shared/kernel/backlogSelectors";
import { DeviceSelect } from "../../devices";
import { Modal } from "../../../shared/ui";
import { MissionsStyles } from "./MissionsStyles";

export function MissionEditor({
  data,
  mission,
  initialGameId,
  onClose,
  onSave,
}: {
  data: BacklogData;
  mission: Mission | null;
  initialGameId: string | null;
  onClose: () => void;
  onSave: (form: MissionFormValue) => void;
}) {
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
  const [contentTitle, setContentTitle] = useState(
    mission?.contentTitle ??
      game.contents.find(content => content.status === "paused")?.title ??
      "Campaña principal"
  );
  const [contentType, setContentType] = useState<MissionFormValue["contentType"]>(
    mission?.contentType ?? "campaign"
  );
  const [slotId, setSlotId] = useState(
    mission?.slotId ??
      data.queue.find(item => item.gameId === game.id)?.preferredSlotId ??
      "flexible"
  );
  const existingRule = mission
    ? data.scheduleRules.find(rule => rule.missionId === mission.id)
    : null;
  const [weekdays, setWeekdays] = useState<number[]>(existingRule?.weekdays ?? []);
  const [durationMin, setDurationMin] = useState(existingRule?.durationMin ?? 30);
  const [durationMax, setDurationMax] = useState(existingRule?.durationMax ?? 60);
  const [notes, setNotes] = useState(mission?.notes ?? game.progress.chapter ?? "");
  const [replaceOccupied, setReplaceOccupied] = useState(false);
  const occupied = data.missions.find(
    item => item.status === "active" && item.slotId === slotId && item.id !== mission?.id
  );
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
    setContentTitle(
      nextGame.contents.find(content => content.status === "paused")?.title ?? "Campaña principal"
    );
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
  const days = [
    { id: 1, label: "L" },
    { id: 2, label: "M" },
    { id: 3, label: "X" },
    { id: 4, label: "J" },
    { id: 5, label: "V" },
    { id: 6, label: "S" },
    { id: 0, label: "D" },
  ];
  return (
    <Modal
      title={mission ? `Editar misión: ${game.title}` : "Activar nueva misión"}
      eyebrow={mission ? mission.id : "COPIA + DISPOSITIVO + FRANJA"}
      onClose={onClose}
    >
      <MissionsStyles />
      <div className="form-grid">
        <label className="wide-field">
          <span>Juego</span>
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
        <label>
          <span>Contenido</span>
          <input
            list="content-options"
            value={contentTitle}
            onChange={event => setContentTitle(event.target.value)}
          />
          <datalist id="content-options">
            {game.contents.map(content => (
              <option key={content.id} value={content.title} />
            ))}
          </datalist>
        </label>
        <label>
          <span>Tipo</span>
          <select
            value={contentType}
            onChange={event =>
              setContentType(event.target.value as MissionFormValue["contentType"])
            }
          >
            <option value="campaign">Campaña</option>
            <option value="dlc">DLC</option>
            <option value="replay">Rejugada</option>
            <option value="custom">Objetivo personalizado</option>
          </select>
        </label>
        <label className="wide-field">
          <span>Copia o versión</span>
          <select value={copyId} onChange={event => selectCopy(event.target.value)}>
            {game.copies.map(item => (
              <option key={item.id} value={item.id}>
                {item.library} · {copyDeviceLabel(data, item)} · {item.ownership}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="mission-device">
          <span>Dispositivo en uso</span>
          <DeviceSelect
            id="mission-device"
            data={data}
            selectedId={activeDeviceId}
            allowedIds={availableDeviceIds}
            onChange={setActiveDeviceId}
            allowUnknown={false}
          />
        </label>
        <label>
          <span>Franja</span>
          <select
            value={slotId}
            onChange={event => {
              setSlotId(event.target.value);
              setReplaceOccupied(false);
            }}
          >
            <option value="first">{getSlotLabel(data, "first")}</option>
            <option value="second">{getSlotLabel(data, "second")}</option>
            <option value="secondary">{getSlotLabel(data, "secondary")}</option>
            <option value="flexible">{getSlotLabel(data, "flexible")}</option>
          </select>
        </label>
        {occupied && (
          <div className="occupied-warning wide-field">
            <strong>
              Franja ocupada por {data.games.find(item => item.id === occupied.gameId)?.title}
            </strong>
            <label className="check-row">
              <input
                type="checkbox"
                checked={replaceOccupied}
                onChange={event => setReplaceOccupied(event.target.checked)}
              />
              <span>Aplazar esa misión a la posición {data.preferences.deferPosition}</span>
            </label>
          </div>
        )}
        <fieldset className="wide-field weekday-field">
          <legend>Días programados</legend>
          <div>
            {days.map(day => (
              <label key={day.id}>
                <input
                  type="checkbox"
                  checked={weekdays.includes(day.id)}
                  onChange={event =>
                    setWeekdays(current =>
                      event.target.checked
                        ? [...current, day.id]
                        : current.filter(item => item !== day.id)
                    )
                  }
                />
                <span>{day.label}</span>
              </label>
            ))}
          </div>
          <small>Sin días seleccionados: misión activa sin calendario fijo.</small>
        </fieldset>
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
      </div>
      <div className="modal-actions">
        <button type="button" className="ghost-button" onClick={onClose}>
          Cancelar
        </button>
        <button
          type="button"
          className="primary-button"
          disabled={
            !copyId ||
            !activeDeviceId ||
            !contentTitle.trim() ||
            Boolean(occupied && !replaceOccupied)
          }
          onClick={() =>
            onSave({
              gameId,
              contentTitle: contentTitle.trim(),
              contentType,
              copyId,
              activeDevice,
              activeDeviceId,
              slotId,
              weekdays,
              durationMin,
              durationMax: Math.max(durationMin, durationMax),
              notes,
              replaceOccupied,
            })
          }
        >
          {mission ? "Guardar misión" : "Activar misión"}
        </button>
      </div>
    </Modal>
  );
}
