import type { BacklogData, Mission } from "../../../shared/kernel/backlog";
import {
  copyDeviceLabel,
  crossCopyProgressLabel,
  deviceName,
  missionLinkState,
  statusClass,
} from "../../../shared/kernel/backlogSelectors";
import { missionScheduleLabel } from "../../../shared/kernel/schedule";
import { Button, CardActions, CardTopline, ChipList, GameCard } from "../../../shared/ui";
import { TooltipChip } from "./TooltipChip";
import type { MissionActions } from "./MissionActions";
import { MissionActionMenu } from "./MissionActionMenu";
import { MissionLinkActions } from "./MissionLinkActions";
import { MissionsScope } from "./MissionsStyles";

export function MissionCard({
  data,
  mission,
  ...actions
}: { data: BacklogData; mission: Mission } & MissionActions) {
  const game = data.games.find(item => item.id === mission.gameId);
  if (!game) return null;
  const activeCopy = game.copies.find(copy => copy.id === mission.copyId);
  const statusInfo = data.catalogs.statuses.find(item => item.label === game.status);
  const priorityInfo = data.catalogs.priorities.find(item => item.label === game.priority);
  const links = missionLinkState(data, mission);
  return (
    <MissionsScope>
      <GameCard $featured $warning={!links.complete}>
        <CardTopline>
          <TooltipChip
            enabled={data.preferences.showTooltips}
            className={`status-pill ${statusClass(game.status)}`}
            tooltip={statusInfo?.description ?? game.status}
          >
            {game.status}
          </TooltipChip>
          <TooltipChip
            enabled={data.preferences.showTooltips}
            className="priority-chip"
            tooltip={priorityInfo?.description ?? `Prioridad ${game.priority}`}
          >
            {game.priority}
          </TooltipChip>
        </CardTopline>
        <div className="mission-slot-line">
          <TooltipChip
            enabled={data.preferences.showTooltips}
            className="slot-chip"
            tooltip="Franja configurada para esta misión. Se puede cambiar desde Configuración."
          >
            {missionScheduleLabel(data, mission)}
          </TooltipChip>
          <span>{mission.contentTitle}</span>
        </div>
        <h3>{game.title}</h3>
        <MissionLinkActions
          hasContent={links.hasContent}
          hasCopy={links.hasCopy}
          hasPlaythrough={links.hasPlaythrough}
          canCreatePlaythrough={game.copies.length > 0 && game.contents.length > 0}
          onManageContents={() => actions.onManageContentsForMission(mission.id)}
          onAddCopy={() => actions.onAddCopyForMission(mission.id)}
          onAddPlaythrough={() => actions.onAddPlaythroughForMission(mission.id)}
        />
        <p>{game.progress.chapter || mission.notes || game.notes || "Sin nota de progreso."}</p>
        <div className="active-version">
          <span>En uso</span>
          <strong>
            {activeCopy?.library ?? "Copia por confirmar"} ·{" "}
            {mission.activeDeviceId
              ? deviceName(data, mission.activeDeviceId)
              : mission.activeDevice}
          </strong>
        </div>
        <ChipList className="all-copies">
          {game.copies.map(copy => {
            const isActive = copy.id === mission.copyId;
            return (
              <TooltipChip
                key={copy.id}
                enabled={data.preferences.showTooltips}
                className={isActive ? "copy-chip active-copy" : "copy-chip"}
                tooltip={`${copy.ownership}. Progreso entre copias: ${crossCopyProgressLabel(copy.crossCopyProgress)}. ${copy.notes || ""}`}
              >
                {copy.library} · {copyDeviceLabel(data, copy)}
                {isActive ? " · EN USO" : ""}
              </TooltipChip>
            );
          })}
        </ChipList>
        <CardActions>
          <Button size="compact" onClick={() => actions.onEditMission(mission.id)}>
            Editar misión
          </Button>
          <Button size="compact" onClick={() => actions.onEditGame(game.id)}>
            Editar juego
          </Button>
          <Button variant="primary" size="compact" onClick={() => actions.onFinish(mission.id)}>
            Terminar
          </Button>
          <Button size="compact" onClick={() => actions.onDefer(mission.id)}>
            Aplazar
          </Button>
          <MissionActionMenu missionId={mission.id} actions={actions} />
        </CardActions>
      </GameCard>
    </MissionsScope>
  );
}
