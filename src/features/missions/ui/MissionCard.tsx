import type { BacklogData, Mission } from "../../../shared/kernel/backlog";
import {
  copyDeviceLabel,
  crossCopyProgressLabel,
  deviceName,
  getSlotLabel,
  statusClass,
} from "../../../shared/kernel/backlogSelectors";
import { TooltipChip } from "./TooltipChip";
import type { MissionActions } from "./MissionActions";
import { MissionActionMenu } from "./MissionActionMenu";
import { MissionsStyles } from "./MissionsStyles";

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
  return (
    <article className="game-card featured">
      <MissionsStyles />
      <div className="card-topline">
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
      </div>
      <div className="mission-slot-line">
        <TooltipChip
          enabled={data.preferences.showTooltips}
          className="slot-chip"
          tooltip="Franja configurada para esta misión. Se puede cambiar desde Configuración."
        >
          {getSlotLabel(data, mission.slotId)}
        </TooltipChip>
        <span>{mission.contentTitle}</span>
      </div>
      <h3>{game.title}</h3>
      <p>{game.progress.chapter || mission.notes || game.notes || "Sin nota de progreso."}</p>
      <div className="active-version">
        <span>En uso</span>
        <strong>
          {activeCopy?.library ?? "Copia por confirmar"} ·{" "}
          {mission.activeDeviceId ? deviceName(data, mission.activeDeviceId) : mission.activeDevice}
        </strong>
      </div>
      <div className="copy-chips all-copies">
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
      </div>
      <div className="card-actions">
        <button
          type="button"
          className="ghost-button compact"
          onClick={() => actions.onEditGame(game.id)}
        >
          Editar juego
        </button>
        <button
          type="button"
          className="primary-button compact"
          onClick={() => actions.onFinish(mission.id)}
        >
          Terminar
        </button>
        <button
          type="button"
          className="ghost-button compact"
          onClick={() => actions.onDefer(mission.id)}
        >
          Aplazar
        </button>
        <MissionActionMenu missionId={mission.id} actions={actions} />
      </div>
    </article>
  );
}
