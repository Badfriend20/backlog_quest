import type {
  BacklogData,
  Game,
  GameCopy,
  Mission,
  Platform,
} from "../../../shared/kernel/backlog";
import {
  deviceName,
  formatDate,
  getSlotLabel,
  statusClass,
} from "../../../shared/kernel/backlogSelectors";
import { Modal } from "../../../shared/ui";

export function DeviceRelationsModal({
  data,
  device,
  view,
  games,
  missions,
  onClose,
  onSelectGame,
  onEditMission,
}: {
  data: BacklogData;
  device: Platform;
  view: "games" | "missions";
  games: Array<{ game: Game; copies: GameCopy[] }>;
  missions: Mission[];
  onClose(): void;
  onSelectGame(id: string): void;
  onEditMission(id: string): void;
}) {
  function selectGame(gameId: string) {
    onClose();
    onSelectGame(gameId);
  }

  function editMission(missionId: string) {
    onClose();
    onEditMission(missionId);
  }

  const gamesContent = games.length ? (
    <section className="library-grid device-library-grid">
      {games.map(({ game, copies }) => (
        <article className="game-card library-card" key={game.id}>
          <button type="button" className="card-open" onClick={() => selectGame(game.id)}>
            <div className="card-topline">
              <span className={`status-pill ${statusClass(game.status)}`}>{game.status}</span>
              <span className="priority-chip">{game.priority}</span>
            </div>
            <h3>
              {game.private ? "🔒 " : ""}
              {game.title}
            </h3>
            <div className="progress-row">
              <span>{game.progress.completions} terminaciones</span>
              <span>{game.progress.replays} rejugadas</span>
            </div>
            <div className="copy-chips">
              {copies.map(copy => (
                <span key={copy.id}>
                  {copy.library || "Sin plataforma"} · {copy.ownership}
                </span>
              ))}
            </div>
          </button>
        </article>
      ))}
    </section>
  ) : (
    <div className="empty-relation">Este dispositivo no está habilitado en ningún juego.</div>
  );

  const missionsContent = missions.length ? (
    <section className="device-mission-modal-list">
      {missions.map(mission => {
        const game = data.games.find(item => item.id === mission.gameId);
        const copy = game?.copies.find(item => item.id === mission.copyId);
        return (
          <article className="relation-card" key={mission.id}>
            <div className="relation-card-header">
              <div>
                <span className="relation-id">{mission.id}</span>
                <strong>{game?.title ?? "Juego no disponible"}</strong>
              </div>
              <div className="relation-badges">
                <span>{mission.status}</span>
                <span>{getSlotLabel(data, mission.slotId)}</span>
              </div>
            </div>
            <dl className="relation-summary-grid">
              <div>
                <dt>Contenido</dt>
                <dd>{mission.contentTitle}</dd>
              </div>
              <div>
                <dt>Copia</dt>
                <dd>{copy?.library ?? "Por confirmar"}</dd>
              </div>
              <div>
                <dt>Dispositivo</dt>
                <dd>
                  {mission.activeDeviceId
                    ? deviceName(data, mission.activeDeviceId)
                    : mission.activeDevice}
                </dd>
              </div>
              <div>
                <dt>Inicio</dt>
                <dd>{formatDate(mission.startedAt)}</dd>
              </div>
            </dl>
            <div className="relation-actions">
              <button
                type="button"
                className="primary-button compact"
                onClick={() => editMission(mission.id)}
              >
                Editar misión
              </button>
            </div>
          </article>
        );
      })}
    </section>
  ) : (
    <div className="empty-relation">Este dispositivo no tiene misiones activas.</div>
  );

  const isGamesView = view === "games";
  const count = isGamesView ? games.length : missions.length;
  const label = isGamesView ? "juegos" : "misiones";

  return (
    <Modal
      size={isGamesView ? "large" : "default"}
      eyebrow={isGamesView ? "JUEGOS HABILITADOS" : "MISIONES ACTIVAS"}
      title={`${device.name} · ${count} ${label}`}
      onClose={onClose}
    >
      {isGamesView ? gamesContent : missionsContent}
    </Modal>
  );
}
