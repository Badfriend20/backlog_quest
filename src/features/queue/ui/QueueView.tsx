import { useState } from "react";
import type { BacklogData } from "../../../shared/kernel/backlog";
import {
  formatDate,
  queueLabel,
  sortedQueue,
  statusClass,
  unresolvedDependencies,
} from "../../../shared/kernel/backlogSelectors";
import { QueueStyles } from "./QueueStyles";

export function QueueView({
  data,
  onActivate,
  onMove,
}: {
  data: BacklogData;
  onActivate: (gameId: string) => void;
  onMove: (gameId: string, direction: -1 | 1) => void;
}) {
  const [stateFilter, setStateFilter] = useState("Todos");
  const items = sortedQueue(data).filter(
    item => stateFilter === "Todos" || item.state === stateFilter
  );
  return (
    <div className="stack-lg">
      <QueueStyles />
      <section className="callout">
        <strong>La cola contiene todo el catálogo</strong>
        <p>
          La portada solo muestra los primeros {data.preferences.queueDisplayCount}. Aplazar manda a
          la posición {data.preferences.deferPosition}; terminar reorganiza según tu intención de
          rejugada.
        </p>
      </section>
      <div className="queue-toolbar">
        <label>
          <span>Estado</span>
          <select value={stateFilter} onChange={event => setStateFilter(event.target.value)}>
            <option>Todos</option>
            {data.catalogs.queueStates.map(item => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <span>{items.length} juegos</span>
      </div>
      <section className="full-queue">
        {items.map(item => {
          const game = data.games.find(candidate => candidate.id === item.gameId);
          if (!game) return null;
          const blockers = unresolvedDependencies(data, game);
          const active = data.missions.some(
            mission => mission.gameId === game.id && mission.status === "active"
          );
          return (
            <article className="queue-row" key={game.id}>
              <div className="queue-position">
                <strong>{item.position}</strong>
                <div>
                  <button
                    type="button"
                    disabled={item.pinned || item.position === 1}
                    onClick={() => onMove(game.id, -1)}
                    aria-label="Subir"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={item.pinned || item.position === data.queue.length}
                    onClick={() => onMove(game.id, 1)}
                    aria-label="Bajar"
                  >
                    ↓
                  </button>
                </div>
              </div>
              <div className="queue-main">
                <div className="card-topline">
                  <span className={`status-pill ${statusClass(queueLabel(data, item.state))}`}>
                    {queueLabel(data, item.state)}
                  </span>
                  {item.pinned && (
                    <span className="priority-chip">FIJO · {item.pinnedPosition}</span>
                  )}
                </div>
                <h3>{game.title}</h3>
                <p>{item.reason || game.notes || "Sin motivo registrado."}</p>
                <small>
                  {item.preferredDevice || "Dispositivo por elegir"}
                  {item.availableFrom ? ` · Disponible ${formatDate(item.availableFrom)}` : ""}
                </small>
                {blockers.length > 0 && (
                  <div className="dependency-warning">
                    Antes conviene: {blockers.map(blocker => blocker.title).join(", ")}
                  </div>
                )}
              </div>
              <div className="queue-actions">
                {active ? (
                  <span className="active-label">Misión activa</span>
                ) : (
                  <button
                    type="button"
                    className="primary-button compact"
                    onClick={() => onActivate(game.id)}
                  >
                    Activar misión
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
