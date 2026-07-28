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
  missionLinkState,
  statusClass,
} from "../../../shared/kernel/backlogSelectors";
import {
  Button,
  CardOpenButton,
  CardTopline,
  ChipList,
  EmptyState,
  LibraryCard,
  LibraryGrid,
  Modal,
  PriorityChip,
  ProgressRow,
  RelationActions,
  RelationBadges,
  RelationCard,
  RelationHeader,
  RelationId,
  RelationSummaryGrid,
  StatusChip,
} from "../../../shared/ui";

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
    <LibraryGrid className="device-library-grid">
      {games.map(({ game, copies }) => (
        <LibraryCard key={game.id}>
          <CardOpenButton type="button" onClick={() => selectGame(game.id)}>
            <CardTopline>
              <StatusChip tone={statusClass(game.status)}>{game.status}</StatusChip>
              <PriorityChip>{game.priority}</PriorityChip>
            </CardTopline>
            <h3>
              {game.private ? "🔒 " : ""}
              {game.title}
            </h3>
            <ProgressRow>
              <span>{game.progress.completions} terminaciones</span>
              <span>{game.progress.replays} rejugadas</span>
            </ProgressRow>
            <ChipList>
              {copies.map(copy => (
                <span key={copy.id}>
                  {copy.library || "Sin plataforma"} · {copy.ownership}
                </span>
              ))}
            </ChipList>
          </CardOpenButton>
        </LibraryCard>
      ))}
    </LibraryGrid>
  ) : (
    <EmptyState>Este dispositivo no está habilitado en ningún juego.</EmptyState>
  );

  const missionsContent = missions.length ? (
    <section className="device-mission-modal-list">
      {missions.map(mission => {
        const game = data.games.find(item => item.id === mission.gameId);
        const copy = game?.copies.find(item => item.id === mission.copyId);
        const links = missionLinkState(data, mission);
        return (
          <RelationCard $warning={!links.complete} key={mission.id}>
            <RelationHeader>
              <div>
                <RelationId>{mission.id}</RelationId>
                <strong>{game?.title ?? "Juego no disponible"}</strong>
              </div>
              <RelationBadges>
                <span>{mission.status}</span>
                <span>{getSlotLabel(data, mission.slotId)}</span>
              </RelationBadges>
            </RelationHeader>
            {!links.complete && (
              <div className="mission-link-warnings">
                {!links.hasContent && (
                  <span className="mission-link-warning">Sin contenido vinculado</span>
                )}
                {!links.hasCopy && (
                  <span className="mission-link-warning">Sin copia vinculada</span>
                )}
                {!links.hasPlaythrough && (
                  <span className="mission-link-warning">Sin partida vinculada</span>
                )}
              </div>
            )}
            <RelationSummaryGrid>
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
            </RelationSummaryGrid>
            <RelationActions>
              <Button variant="primary" size="compact" onClick={() => editMission(mission.id)}>
                Editar misión
              </Button>
            </RelationActions>
          </RelationCard>
        );
      })}
    </section>
  ) : (
    <EmptyState>Este dispositivo no tiene misiones activas.</EmptyState>
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
