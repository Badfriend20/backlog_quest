import { useState } from "react";
import type { QuestData, Resource } from "../../../shared/kernel/quest";
import { activeMissions, copyDeviceIds, normalize } from "../../../shared/kernel/questSelectors";
import {
  Button,
  Callout,
  CardSurface,
  CardTopline,
  PriorityChip,
  StatusChip,
} from "../../../shared/ui";
import { DeviceRelationsModal } from "./DeviceRelationsModal";
import { useVocabulary } from "../../../shared/vocabulary";

type RelationView = "games" | "missions" | null;

export function DeviceCard({
  data,
  device,
  onEdit,
  onSelectGame,
  onEditMission,
}: {
  data: QuestData;
  device: Resource;
  onEdit(): void;
  onSelectGame(id: string): void;
  onEditMission(id: string): void;
}) {
  const terms = useVocabulary();
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
      <CardSurface className="platform-card">
        <CardTopline>
          <StatusChip tone="status-purple">{device.kind}</StatusChip>
          <PriorityChip>{device.priority}</PriorityChip>
        </CardTopline>

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
            <strong>{games.length}</strong> {terms.activities}
          </button>
          <button type="button" aria-haspopup="dialog" onClick={() => setRelationView("missions")}>
            <strong>{missions.length}</strong> {terms.missions}
          </button>
        </div>

        <Callout $compact className="platform-card-role">
          <strong>Rol actual:</strong>{" "}
          {missions.length
            ? missions
                .map(mission => data.games.find(game => game.id === mission.gameId)?.title)
                .filter(Boolean)
                .join(", ")
            : device.currentRole}
        </Callout>

        <div className="platform-card-actions">
          <Button onClick={onEdit}>Editar</Button>
        </div>
      </CardSurface>

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
