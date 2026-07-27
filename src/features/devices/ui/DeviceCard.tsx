import { useState } from "react";
import type { BacklogData, Platform } from "../../../shared/kernel/backlog";
import { activeMissions, copyDeviceIds, normalize } from "../../../shared/kernel/backlogSelectors";
import { DeviceRelationsModal } from "./DeviceRelationsModal";

type RelationView = "games" | "missions" | null;

export function DeviceCard({
  data,
  device,
  onEdit,
  onSelectGame,
  onEditMission,
}: {
  data: BacklogData;
  device: Platform;
  onEdit(): void;
  onSelectGame(id: string): void;
  onEditMission(id: string): void;
}) {
  const [relationView, setRelationView] = useState<RelationView>(null);
  const games = data.games
    .map(game => ({
      game,
      copies: game.copies.filter(copy => copyDeviceIds(data, copy).includes(device.id)),
    }))
    .filter(item => item.copies.length > 0);
  const missions = activeMissions(data).filter(
    mission =>
      mission.activeDeviceId === device.id ||
      (!mission.activeDeviceId &&
        normalize(mission.activeDevice).includes(normalize(device.name.split(" / ")[0])))
  );

  return (
    <>
      <article className="platform-card">
        <div className="card-topline">
          <span className="status-pill status-purple">{device.kind}</span>
          <span className="priority-chip">{device.priority}</span>
        </div>

        <button
          type="button"
          className="platform-card-title"
          aria-label={`Editar ${device.name}`}
          onClick={onEdit}
        >
          {device.name}
        </button>
        <p className="platform-card-notes">{device.notes}</p>

        <div className="platform-metrics">
          <button type="button" aria-haspopup="dialog" onClick={() => setRelationView("games")}>
            <strong>{games.length}</strong> juegos
          </button>
          <button type="button" aria-haspopup="dialog" onClick={() => setRelationView("missions")}>
            <strong>{missions.length}</strong> misiones
          </button>
        </div>

        <div className="callout mini platform-card-role">
          <strong>Rol actual:</strong>{" "}
          {missions.length
            ? missions
                .map(mission => data.games.find(game => game.id === mission.gameId)?.title)
                .filter(Boolean)
                .join(", ")
            : device.currentRole}
        </div>

        <div className="platform-card-actions">
          <button type="button" className="ghost-button" onClick={onEdit}>
            Editar
          </button>
        </div>
      </article>

      {relationView && (
        <DeviceRelationsModal
          data={data}
          device={device}
          view={relationView}
          games={games}
          missions={missions}
          onClose={() => setRelationView(null)}
          onSelectGame={onSelectGame}
          onEditMission={onEditMission}
        />
      )}
    </>
  );
}
