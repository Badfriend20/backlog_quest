import { useState } from "react";
import type { Channel, QuestData, Resource } from "../../../shared/kernel/quest";
import { Button, Eyebrow } from "../../../shared/ui";
import { createDevice } from "../domain/deviceCatalog";
import { DeviceCard } from "./DeviceCard";
import { DeviceEditorModal } from "./DeviceEditorModal";
import { DevicesScope } from "./DevicesStyles";
import { capitalizeTerm, useVocabulary } from "../../../shared/vocabulary";

interface PlatformsViewProps {
  data: QuestData;
  onSelectGame(id: string): void;
  onEditMission(id: string): void;
  onPlatformsChange(platforms: Resource[]): void;
  onCopyPlatformsChange(platforms: Channel[]): void;
}

export function PlatformsView({
  data,
  onSelectGame,
  onEditMission,
  onPlatformsChange,
  onCopyPlatformsChange,
}: PlatformsViewProps) {
  const terms = useVocabulary();
  const [selectedDevice, setSelectedDevice] = useState<Resource>();
  const [isCreating, setIsCreating] = useState(false);

  function openEditor(device: Resource, creating = false) {
    setSelectedDevice(device);
    setIsCreating(creating);
  }

  return (
    <DevicesScope>
      <div className="device-view-heading">
        <div>
          <Eyebrow>CATÁLOGO DE {terms.resources.toUpperCase()}</Eyebrow>
          <p>Selecciona el título o el botón Editar para modificar un {terms.resource}.</p>
        </div>
        <Button variant="primary" onClick={() => openEditor(createDevice(data.platforms), true)}>
          + {capitalizeTerm(terms.resource)}
        </Button>
      </div>

      <div className="platform-grid">
        {data.platforms.map(platform => (
          <DeviceCard
            key={platform.id}
            data={data}
            device={platform}
            onEdit={() => openEditor(platform)}
            onSelectGame={onSelectGame}
            onEditMission={onEditMission}
          />
        ))}
      </div>

      {selectedDevice && (
        <DeviceEditorModal
          key={selectedDevice.id}
          data={data}
          device={selectedDevice}
          isNew={isCreating}
          onChange={onPlatformsChange}
          onCopyPlatformsChange={onCopyPlatformsChange}
          onClose={() => setSelectedDevice(undefined)}
        />
      )}
    </DevicesScope>
  );
}
