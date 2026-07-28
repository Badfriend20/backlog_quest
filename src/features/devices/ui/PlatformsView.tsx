import { useState } from "react";
import type { BacklogData, Platform } from "../../../shared/kernel/backlog";
import { Button, Eyebrow } from "../../../shared/ui";
import { createDevice } from "../domain/deviceCatalog";
import { DeviceCard } from "./DeviceCard";
import { DeviceEditorModal } from "./DeviceEditorModal";
import { DevicesScope } from "./DevicesStyles";

interface PlatformsViewProps {
  data: BacklogData;
  onSelectGame(id: string): void;
  onEditMission(id: string): void;
  onPlatformsChange(platforms: Platform[]): void;
}

export function PlatformsView({
  data,
  onSelectGame,
  onEditMission,
  onPlatformsChange,
}: PlatformsViewProps) {
  const [selectedDevice, setSelectedDevice] = useState<Platform>();
  const [isCreating, setIsCreating] = useState(false);

  function openEditor(device: Platform, creating = false) {
    setSelectedDevice(device);
    setIsCreating(creating);
  }

  return (
    <DevicesScope>
      <div className="device-view-heading">
        <div>
          <Eyebrow>CATÁLOGO DE DISPOSITIVOS</Eyebrow>
          <p>Selecciona el título o el botón Editar para modificar un dispositivo.</p>
        </div>
        <Button variant="primary" onClick={() => openEditor(createDevice(data.platforms), true)}>
          + Dispositivo
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
          onClose={() => setSelectedDevice(undefined)}
        />
      )}
    </DevicesScope>
  );
}
