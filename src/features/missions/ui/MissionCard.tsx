import type { QuestData, Mission } from "../../../shared/kernel/quest";
import {
  copyDeviceLabel,
  crossCopyProgressLabel,
  deviceName,
  missionLinkState,
  statusClass,
} from "../../../shared/kernel/questSelectors";
import {
  Button,
  CardActions,
  CardTopline,
  ChipList,
  GameCard,
  PrioritySelectChip,
} from "../../../shared/ui";
import { TooltipChip } from "./TooltipChip";
import type { MissionActions } from "./MissionActions";
import { MissionActionMenu } from "./MissionActionMenu";
import { MissionLinkActions } from "./MissionLinkActions";
import { MissionsScope } from "./MissionsStyles";
import { activityStatusLabel, useVocabulary } from "../../../shared/vocabulary";

export function MissionCard({
  data,
  mission,
  ...actions
}: { data: QuestData; mission: Mission } & MissionActions) {
  const terms = useVocabulary();
  const game = data.games.find(item => item.id === mission.gameId);
  if (!game) return null;
  const activeCopy = game.copies.find(copy => copy.id === mission.copyId);
  const statusInfo = data.catalogs.statuses.find(item => item.label === game.status);
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
            {activityStatusLabel(game.status, terms)}
          </TooltipChip>
          <PrioritySelectChip
            value={game.priority}
            options={data.catalogs.priorities}
            onChange={priority => actions.onChangePriority(game.id, priority)}
          />
        </CardTopline>
        <div className="mission-content-line">
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
        <p>
          {game.progress.chapter
            ? `Punto actual: ${game.progress.chapter}`
            : mission.notes || game.notes || "Sin nota de progreso."}
        </p>
        <div className="active-version">
          <span>En uso</span>
          <strong>
            {activeCopy?.library ?? "Modalidad por confirmar"} ·{" "}
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
                tooltip={`${copy.ownership}. Progreso entre modalidades: ${crossCopyProgressLabel(copy.crossCopyProgress)}. ${copy.notes || ""}`}
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
            Editar actividad
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
