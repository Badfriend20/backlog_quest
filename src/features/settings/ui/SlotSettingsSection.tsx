import { useState } from "react";
import type { QuestData, SlotProfile } from "../../../shared/kernel/quest";
import {
  Button,
  ConfirmationModal,
  Eyebrow,
  FormGrid,
  SelectableCardSurface,
} from "../../../shared/ui";
import type { SettingsChangeHandler } from "./settingsTypes";
import { SettingsCard } from "./SettingsStyles";

export function SlotSettingsSection({
  data,
  onChange,
}: {
  data: QuestData;
  onChange: SettingsChangeHandler;
}) {
  const [firstLabel, setFirstLabel] = useState("");
  const [secondLabel, setSecondLabel] = useState("");
  const [pendingRemoval, setPendingRemoval] = useState<SlotProfile>();
  function addProfile() {
    if (!firstLabel.trim() || !secondLabel.trim()) return;
    const id = `custom-${Date.now()}`;
    const profile: SlotProfile = {
      id,
      label: `${firstLabel.trim()} / ${secondLabel.trim()}`,
      custom: true,
      slots: [
        { id: "first", label: firstLabel.trim() },
        { id: "second", label: secondLabel.trim() },
      ],
    };
    onChange(
      { slotProfiles: [...data.preferences.slotProfiles, profile], activeSlotProfileId: id },
      "Nuevo par de franjas creado y aplicado."
    );
    setFirstLabel("");
    setSecondLabel("");
  }
  function deleteProfile(profileId: string) {
    const profiles = data.preferences.slotProfiles.filter(profile => profile.id !== profileId);
    onChange(
      {
        slotProfiles: profiles,
        activeSlotProfileId:
          data.preferences.activeSlotProfileId === profileId
            ? profiles[0].id
            : data.preferences.activeSlotProfileId,
      },
      "Par personalizado eliminado."
    );
    setPendingRemoval(undefined);
  }
  return (
    <SettingsCard $wide>
      <Eyebrow>FRANJAS</Eyebrow>
      <h2>Cómo divides tu día</h2>
      <p>
        Estos nombres se aplican inmediatamente en misiones, calendario, activación y edición. Los
        identificadores internos permanecen estables al cambiar los nombres.
      </p>
      <div className="profile-grid">
        {data.preferences.slotProfiles.map(profile => (
          <SelectableCardSurface
            className="profile-option"
            $selected={profile.id === data.preferences.activeSlotProfileId}
            key={profile.id}
          >
            <button
              type="button"
              onClick={() =>
                onChange(
                  { activeSlotProfileId: profile.id },
                  `Franjas cambiadas a ${profile.label}.`
                )
              }
            >
              <strong>{profile.label}</strong>
              <small>
                {profile.slots[0].label} · {profile.slots[1].label}
              </small>
            </button>
            {profile.custom && (
              <button
                type="button"
                className="delete-profile"
                onClick={() => setPendingRemoval(profile)}
                aria-label={`Eliminar ${profile.label}`}
              >
                ×
              </button>
            )}
          </SelectableCardSurface>
        ))}
      </div>
      <div className="custom-pair">
        <label>
          <span>Primera franja</span>
          <input
            value={firstLabel}
            onChange={event => setFirstLabel(event.target.value)}
            placeholder="Ej. Antes de comer"
          />
        </label>
        <label>
          <span>Segunda franja</span>
          <input
            value={secondLabel}
            onChange={event => setSecondLabel(event.target.value)}
            placeholder="Ej. Después de cenar"
          />
        </label>
        <Button variant="primary" onClick={addProfile}>
          Agregar y usar
        </Button>
      </div>
      <FormGrid className="setting-subgrid">
        <label>
          <span>Nombre de la franja secundaria</span>
          <input
            value={data.preferences.secondarySlotLabel}
            onChange={event =>
              onChange(
                { secondarySlotLabel: event.target.value },
                "Nombre de franja secundaria actualizado."
              )
            }
          />
        </label>
        <label>
          <span>Nombre de la franja flexible</span>
          <input
            value={data.preferences.flexibleSlotLabel}
            onChange={event =>
              onChange(
                { flexibleSlotLabel: event.target.value },
                "Nombre de franja flexible actualizado."
              )
            }
          />
        </label>
      </FormGrid>
      {pendingRemoval && (
        <ConfirmationModal
          title="Eliminar par de franjas"
          message={`Se eliminará ${pendingRemoval.label} de las configuraciones disponibles.`}
          confirmLabel="Eliminar franjas"
          onConfirm={() => deleteProfile(pendingRemoval.id)}
          onClose={() => setPendingRemoval(undefined)}
        />
      )}
    </SettingsCard>
  );
}
