import { useState } from "react";
import type { QuestData } from "../../../shared/kernel/quest";
import {
  Button,
  Callout,
  CardTopline,
  DependencyWarning,
  Eyebrow,
  PriorityChip,
  PrioritySelectChip,
  ReorderControls,
  SectionHeading,
  Stack,
  StatusChip,
} from "../../../shared/ui";
import {
  formatDate,
  queueLabel,
  sortedQueue,
  statusClass,
  unresolvedDependencies,
} from "../../../shared/kernel/questSelectors";
import { QueueScope } from "./QueueStyles";
import { useVocabulary } from "../../../shared/vocabulary";
import { buildRotationPlan } from "../domain/rotation";
import type { RecommendationMoveTarget } from "../domain/recommendationMove";
import { RotationRecommendationItem } from "./RotationRecommendationItem";

export function QueueView({
  data,
  onActivate,
  onMove,
  onMoveRecommendation,
  onChangePriority,
}: {
  data: QuestData;
  onActivate: (gameId: string) => void;
  onMove: (gameId: string, direction: -1 | 1) => void;
  onMoveRecommendation: (gameId: string, target: RecommendationMoveTarget) => void;
  onChangePriority: (gameId: string, priority: string) => void;
}) {
  const [stateFilter, setStateFilter] = useState("Todos");
  const terms = useVocabulary();
  const items = sortedQueue(data).filter(
    item => stateFilter === "Todos" || item.state === stateFilter
  );
  const rotationPlan = buildRotationPlan(data, {
    limit: data.preferences.queueDisplayCount,
  });
  return (
    <QueueScope>
      <Stack>
        <Callout>
          <strong>La lista contiene todo el catálogo</strong>
          <p>
            La rotación sugerida orienta la siguiente elección sin cambiar tu orden manual. Aplazar
            manda a la posición {data.preferences.deferPosition}; terminar reorganiza según tu
            intención de repetición.
          </p>
        </Callout>
        <section aria-labelledby="rotation-heading">
          <SectionHeading>
            <div>
              <Eyebrow>RECOMENDACIÓN DINÁMICA</Eyebrow>
              <h2 id="rotation-heading">Rotación sugerida</h2>
            </div>
          </SectionHeading>
          <ol className="rotation-list">
            {rotationPlan.candidates.map((candidate, index) => (
              <RotationRecommendationItem
                key={candidate.game.id}
                data={data}
                candidate={candidate}
                suggestionPosition={index + 1}
                onActivate={onActivate}
                onMove={onMoveRecommendation}
              />
            ))}
          </ol>
          {!rotationPlan.candidates.length && (
            <p className="rotation-empty">No hay actividades elegibles para recomendar ahora.</p>
          )}
        </section>
        <SectionHeading>
          <div>
            <Eyebrow>INTENCIÓN PERSISTIDA</Eyebrow>
            <h2>Orden manual</h2>
          </div>
        </SectionHeading>
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
          <span>
            {items.length} {terms.activities}
          </span>
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
                  <ReorderControls
                    upDisabled={item.pinned || item.position === 1}
                    downDisabled={item.pinned || item.position === data.queue.length}
                    onMoveUp={() => onMove(game.id, -1)}
                    onMoveDown={() => onMove(game.id, 1)}
                  />
                </div>
                <div className="queue-main">
                  <CardTopline>
                    <StatusChip tone={statusClass(queueLabel(data, item.state))}>
                      {queueLabel(data, item.state)}
                    </StatusChip>
                    <div className="queue-topline-actions">
                      {item.pinned && <PriorityChip>FIJO · {item.pinnedPosition}</PriorityChip>}
                      <PrioritySelectChip
                        value={game.priority}
                        options={data.catalogs.priorities}
                        onChange={priority => onChangePriority(game.id, priority)}
                      />
                    </div>
                  </CardTopline>
                  <h3>{game.title}</h3>
                  <p>{item.reason || game.notes || "Sin motivo registrado."}</p>
                  <small>
                    {item.preferredDevice || `${terms.resource} por elegir`}
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
