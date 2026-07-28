import { useState } from "react";
import type { BacklogData } from "../../../shared/kernel/backlog";
import {
  Button,
  Callout,
  CardTopline,
  DependencyWarning,
  PriorityChip,
  Stack,
  StatusChip,
} from "../../../shared/ui";
import {
  formatDate,
  queueLabel,
  sortedQueue,
  statusClass,
  unresolvedDependencies,
} from "../../../shared/kernel/backlogSelectors";
import { QueueScope } from "./QueueStyles";

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
    <QueueScope>
      <Stack>
        <Callout>
          <strong>La cola contiene todo el catálogo</strong>
          <p>
            La portada solo muestra los primeros {data.preferences.queueDisplayCount}. Aplazar manda
            a la posición {data.preferences.deferPosition}; terminar reorganiza según tu intención
            de rejugada.
          </p>
        </Callout>
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
                  <CardTopline>
                    <StatusChip tone={statusClass(queueLabel(data, item.state))}>
                      {queueLabel(data, item.state)}
                    </StatusChip>
                    {item.pinned && <PriorityChip>FIJO · {item.pinnedPosition}</PriorityChip>}
                  </CardTopline>
                  <h3>{game.title}</h3>
                  <p>{item.reason || game.notes || "Sin motivo registrado."}</p>
                  <small>
                    {item.preferredDevice || "Dispositivo por elegir"}
                    {item.availableFrom ? ` · Disponible ${formatDate(item.availableFrom)}` : ""}
                  </small>
                  {blockers.length > 0 && (
                    <DependencyWarning className="queue-dependency">
                      Antes conviene: {blockers.map(blocker => blocker.title).join(", ")}
                    </DependencyWarning>
                  )}
                </div>
                <div className="queue-actions">
                  {active ? (
                    <span className="active-label">Misión activa</span>
                  ) : (
                    <Button variant="primary" size="compact" onClick={() => onActivate(game.id)}>
                      Activar misión
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      </Stack>
    </QueueScope>
  );
}
