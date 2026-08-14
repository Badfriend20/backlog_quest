import type { AppView, QuestData } from "../../../shared/kernel/quest";
import { Button, Eyebrow, SectionHeading, Stack } from "../../../shared/ui";
import { activeMissions, formatDateTime, normalize } from "../../../shared/kernel/questSelectors";
import { MissionCard, type MissionActions } from "../../missions";
import {
  buildRotationPlan,
  RotationRecommendationItem,
  type RecommendationMoveTarget,
} from "../../queue";
import { EmptyCard } from "./EmptyCard";
import { Metric } from "./Metric";
import { DashboardScope } from "./DashboardStyles";
import { capitalizeTerm, useVocabulary } from "../../../shared/vocabulary";

export function DashboardView({
  data,
  onOpenView,
  onActivate,
  onMoveRecommendation,
  ...actions
}: {
  data: QuestData;
  onOpenView: (view: AppView) => void;
  onActivate: (gameId: string) => void;
  onMoveRecommendation: (gameId: string, target: RecommendationMoveTarget) => void;
} & MissionActions) {
  const terms = useVocabulary();
  const missions = activeMissions(data);
  const finished = data.games.filter(game =>
    ["Terminado", "Completado"].includes(game.status)
  ).length;
  const completionRate = Math.round((finished / Math.max(1, data.games.length)) * 100);
  const rotationPlan = buildRotationPlan(data, {
    limit: data.preferences.queueDisplayCount,
  });

  return (
    <DashboardScope>
      <Stack $space="xl">
        <section className="metric-grid" aria-label="Resumen">
          <Metric
            label={capitalizeTerm(terms.activities)}
            value={data.games.length}
            note={`${data.games.reduce((sum, game) => sum + game.copies.length, 0)} ${terms.variants}`}
          />
          <Metric
            label={capitalizeTerm(terms.missions)}
            value={missions.length}
            note="Objetivos activos en seguimiento"
          />
          <Metric label="Terminados" value={finished} note={`${completionRate}% del catálogo`} />
          <Metric
            label={capitalizeTerm(terms.repetitions)}
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
                title={`No hay ${terms.missions} activas`}
                text={`Activa una ${terms.activity} desde la lista y elige su ${terms.variant}, ${terms.resource} y franja.`}
                action="Abrir lista"
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
                Lista completa →
              </Button>
            </SectionHeading>
            <ol className="quest-list">
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
          </div>
          <Stack>
            <div>
              <SectionHeading>
                <div>
                  <Eyebrow>BALANCE</Eyebrow>
                  <h2>{capitalizeTerm(terms.resources)}</h2>
                </div>
                <Button variant="text" onClick={() => onOpenView("platforms")}>
                  Detalles →
                </Button>
              </SectionHeading>
              <div className="platform-stack">
                {data.platforms.map(platform => {
                  const platformMissions = missions.filter(
                    mission =>
                      mission.activeDeviceId === platform.id ||
                      (!mission.activeDeviceId &&
                        normalize(mission.activeDevice).includes(
                          normalize(platform.name.split(" / ")[0])
                        ))
                  );
                  const activeCount = platformMissions.length;
                  const activeTitle = data.games.find(
                    game => game.id === platformMissions[0]?.gameId
                  )?.title;
                  let summary = platform.notes || "Sin misión activa";
                  if (activeCount === 1) summary = activeTitle ?? "1 misión activa";
                  if (activeCount > 1) summary = `${activeCount} misiones activas`;
                  return (
                    <article className="platform-row" key={platform.id}>
                      <div>
                        <strong>{platform.name}</strong>
                        <small>{summary}</small>
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
