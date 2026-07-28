import type { AppView, BacklogData } from "../../../shared/kernel/backlog";
import { Button, Eyebrow, SectionHeading, Stack } from "../../../shared/ui";
import {
  activeMissions,
  formatDateTime,
  normalize,
  queueLabel,
  sortedQueue,
} from "../../../shared/kernel/backlogSelectors";
import { MissionCard, type MissionActions } from "../../missions";
import { EmptyCard } from "./EmptyCard";
import { Metric } from "./Metric";
import { DashboardScope } from "./DashboardStyles";

export function DashboardView({
  data,
  onOpenView,
  onActivate,
  ...actions
}: {
  data: BacklogData;
  onOpenView: (view: AppView) => void;
  onActivate: (gameId: string) => void;
} & MissionActions) {
  const missions = activeMissions(data);
  const finished = data.games.filter(game =>
    ["Terminado", "Completado"].includes(game.status)
  ).length;
  const completionRate = Math.round((finished / Math.max(1, data.games.length)) * 100);
  const nextItems = sortedQueue(data).slice(0, data.preferences.queueDisplayCount);

  return (
    <DashboardScope>
      <Stack $space="xl">
        <section className="metric-grid" aria-label="Resumen">
          <Metric
            label="Juegos"
            value={data.games.length}
            note={`${data.games.reduce((sum, game) => sum + game.copies.length, 0)} copias`}
          />
          <Metric
            label="Misiones"
            value={missions.length}
            note="Objetivos activos en seguimiento"
          />
          <Metric label="Terminados" value={finished} note={`${completionRate}% del catálogo`} />
          <Metric
            label="Rejugadas"
            value={data.games.reduce((sum, game) => sum + game.progress.replays, 0)}
            note="Total registrado"
          />
        </section>

        <section>
          <SectionHeading>
            <div>
              <Eyebrow>ROTACIÓN ACTUAL</Eyebrow>
              <h2>Misiones activas</h2>
            </div>
            <Button variant="text" onClick={() => onOpenView("schedule")}>
              Ver calendario →
            </Button>
          </SectionHeading>
          <div className="active-grid">
            {missions.map(mission => (
              <MissionCard key={mission.id} data={data} mission={mission} {...actions} />
            ))}
            {!missions.length && (
              <EmptyCard
                title="No hay misiones activas"
                text="Activa un juego desde la cola y elige su copia, dispositivo y franja."
                action="Abrir cola"
                onAction={() => onOpenView("queue")}
              />
            )}
          </div>
        </section>

        <section className="two-column">
          <div>
            <SectionHeading>
              <div>
                <Eyebrow>CAMINO SUGERIDO</Eyebrow>
                <h2>Próximos {data.preferences.queueDisplayCount}</h2>
              </div>
              <Button variant="text" onClick={() => onOpenView("queue")}>
                Cola completa →
              </Button>
            </SectionHeading>
            <ol className="quest-list">
              {nextItems.map(item => {
                const game = data.games.find(candidate => candidate.id === item.gameId);
                if (!game) return null;
                const active = data.missions.some(
                  mission => mission.gameId === game.id && mission.status === "active"
                );
                return (
                  <li key={item.gameId}>
                    <span className="quest-number">{item.position}</span>
                    <div className="quest-copy">
                      <strong>{game.title}</strong>
                      <small>
                        {item.preferredDevice || "Plataforma por elegir"} ·{" "}
                        {queueLabel(data, item.state)}
                      </small>
                    </div>
                    {!active && (
                      <Button size="compact" onClick={() => onActivate(game.id)}>
                        Activar
                      </Button>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
          <Stack>
            <div>
              <SectionHeading>
                <div>
                  <Eyebrow>BALANCE</Eyebrow>
                  <h2>Dispositivos</h2>
                </div>
                <Button variant="text" onClick={() => onOpenView("platforms")}>
                  Detalles →
                </Button>
              </SectionHeading>
              <div className="platform-stack">
                {data.platforms.map(platform => {
                  const activeCount = missions.filter(
                    mission =>
                      mission.activeDeviceId === platform.id ||
                      (!mission.activeDeviceId &&
                        normalize(mission.activeDevice).includes(
                          normalize(platform.name.split(" / ")[0])
                        ))
                  ).length;
                  return (
                    <article className="platform-row" key={platform.id}>
                      <div>
                        <strong>{platform.name}</strong>
                        <small>
                          {activeCount ? `${activeCount} misión activa` : platform.currentRole}
                        </small>
                      </div>
                      <span className="count-badge">{activeCount}</span>
                    </article>
                  );
                })}
              </div>
            </div>
            <div>
              <SectionHeading>
                <div>
                  <Eyebrow>BITÁCORA</Eyebrow>
                  <h2>Actividad reciente</h2>
                </div>
              </SectionHeading>
              <div className="activity-list">
                {data.activityLog.slice(0, 5).map(item => (
                  <article key={item.id}>
                    <span>{formatDateTime(item.at)}</span>
                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </Stack>
        </section>
      </Stack>
    </DashboardScope>
  );
}
