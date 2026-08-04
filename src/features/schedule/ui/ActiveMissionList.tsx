import type { QuestData } from "../../../shared/kernel/quest";
import {
  activeMissions,
  deviceName,
  missionLinkState,
} from "../../../shared/kernel/questSelectors";
import { missionScheduleLabel } from "../../../shared/kernel/schedule";
import { Button, EmptyState, Eyebrow, SectionHeading } from "../../../shared/ui";
import { MissionLinkActions } from "../../missions";

export function ActiveMissionList({
  data,
  onEditMission,
  onManageContentsForMission,
  onAddCopyForMission,
  onAddPlaythroughForMission,
  onFinish,
}: {
  data: QuestData;
  onEditMission(missionId: string): void;
  onManageContentsForMission(missionId: string): void;
  onAddCopyForMission(missionId: string): void;
  onAddPlaythroughForMission(missionId: string): void;
  onFinish(missionId: string): void;
}) {
  const missions = activeMissions(data);

  return (
    <section className="plan-mission-manager">
      <SectionHeading>
        <div>
          <Eyebrow>ACCESO PERMANENTE</Eyebrow>
          <h2>Misiones activas ({missions.length})</h2>
          <p>Edita una misión aunque todavía no tenga días programados en el calendario.</p>
        </div>
      </SectionHeading>
      <div className="plan-mission-list">
        {missions.map(mission => {
          const game = data.games.find(item => item.id === mission.gameId);
          const rule = data.scheduleRules.find(
            item => item.missionId === mission.id && item.enabled
          );
          const scheduleLabel = missionScheduleLabel(data, mission);
          const scheduled = Boolean(rule?.sessions.length);
          const links = missionLinkState(data, mission);

          return (
            <article
              className={links.complete ? "plan-mission-row" : "plan-mission-row mission-alert"}
              key={mission.id}
            >
              <div>
                <strong>{game?.title ?? "Actividad no disponible"}</strong>
                <span>{mission.contentTitle}</span>
                <MissionLinkActions
                  hasContent={links.hasContent}
                  hasCopy={links.hasCopy}
                  hasPlaythrough={links.hasPlaythrough}
                  canCreatePlaythrough={Boolean(game?.copies.length && game.contents.length)}
                  onManageContents={() => onManageContentsForMission(mission.id)}
                  onAddCopy={() => onAddCopyForMission(mission.id)}
                  onAddPlaythrough={() => onAddPlaythroughForMission(mission.id)}
                />
              </div>
              <div className="plan-mission-meta">
                <span>
                  {mission.activeDeviceId
                    ? deviceName(data, mission.activeDeviceId)
                    : mission.activeDevice}
                </span>
                <span className={scheduled ? "" : "unscheduled-label"}>{scheduleLabel}</span>
                {scheduled && (
                  <span>
                    {rule?.durationMin}–{rule?.durationMax} min
                  </span>
                )}
              </div>
              <div className="plan-mission-actions">
                <Button size="compact" onClick={() => onEditMission(mission.id)}>
                  Editar misión
                </Button>
                <Button variant="primary" size="compact" onClick={() => onFinish(mission.id)}>
                  Terminar
                </Button>
              </div>
            </article>
          );
        })}
        {!missions.length && <EmptyState>No hay misiones activas para administrar.</EmptyState>}
      </div>
    </section>
  );
}
