import { useState } from "react";
import type { BacklogData, Platform } from "../../../shared/kernel/backlog";
import { createDevice } from "../domain/deviceCatalog";
import { DeviceCard } from "./DeviceCard";
import { DeviceEditorModal } from "./DeviceEditorModal";
import { DevicesStyles } from "./DevicesStyles";

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
    <>
      <DevicesStyles />
      <div className="device-view-heading">
        <div>
          <p className="eyebrow">CATÁLOGO DE DISPOSITIVOS</p>
          <p>Selecciona el título o el botón Editar para modificar un dispositivo.</p>
        </div>
        <button
          type="button"
          className="primary-button"
          onClick={() => openEditor(createDevice(data.platforms), true)}
        >
          + Dispositivo
        </button>
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
    </>
  );
}
