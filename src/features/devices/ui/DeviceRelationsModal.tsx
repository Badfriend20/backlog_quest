import type {
  QuestData,
  Activity,
  ActivityVariant,
  Mission,
  Resource,
} from "../../../shared/kernel/quest";
import {
  deviceName,
  formatDate,
  getSlotLabel,
  missionLinkState,
  statusClass,
} from "../../../shared/kernel/questSelectors";
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
import { activityStatusLabel, useVocabulary } from "../../../shared/vocabulary";

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
  data: QuestData;
  device: Resource;
  view: "games" | "missions";
  games: Array<{ game: Activity; copies: ActivityVariant[] }>;
  missions: Mission[];
  onClose(): void;
  onSelectGame(id: string): void;
  onEditMission(id: string): void;
}) {
  const terms = useVocabulary();
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
              <StatusChip tone={statusClass(game.status)}>
                {activityStatusLabel(game.status, terms)}
              </StatusChip>
              <PriorityChip>{game.priority}</PriorityChip>
            </CardTopline>
            <h3>
              {game.private ? "🔒 " : ""}
              {game.title}
            </h3>
            <ProgressRow>
              <span>{game.progress.completions} terminaciones</span>
              <span>{game.progress.replays} repeticiones</span>
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
    <EmptyState>Este recurso no está habilitado en ninguna actividad.</EmptyState>
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
                <strong>{game?.title ?? "Actividad no disponible"}</strong>
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
                  <span className="mission-link-warning">Sin modalidad vinculada</span>
                )}
                {!links.hasPlaythrough && (
                  <span className="mission-link-warning">Sin recorrido vinculado</span>
                )}
              </div>
            )}
            <RelationSummaryGrid>
              <div>
                <dt>Contenido</dt>
                <dd>{mission.contentTitle}</dd>
              </div>
              <div>
                <dt>Modalidad</dt>
                <dd>{copy?.library ?? "Por confirmar"}</dd>
              </div>
              <div>
                <dt>Recurso</dt>
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
    <EmptyState>Este recurso no tiene misiones activas.</EmptyState>
  );

  const isGamesView = view === "games";
  const count = isGamesView ? games.length : missions.length;
  const label = isGamesView ? "actividades" : "misiones";

  return (
    <Modal
      size={isGamesView ? "large" : "default"}
      eyebrow={isGamesView ? "ACTIVIDADES HABILITADAS" : "MISIONES ACTIVAS"}
      title={`${device.name} · ${count} ${label}`}
      onClose={onClose}
    >
      {isGamesView ? gamesContent : missionsContent}
    </Modal>
  );
}
