import { useState } from "react";
import type { QuestData, VocabularyProfileId, VocabularyTerms } from "../../../shared/kernel/quest";
import { Button, Eyebrow, SelectableCardButton } from "../../../shared/ui";
import { VOCABULARY_PROFILES } from "../../../shared/vocabulary";
import type { SettingsChangeHandler } from "./settingsTypes";
import { SettingsCard, SettingsSectionHeading } from "./SettingsStyles";
import { VocabularyEditorModal } from "./VocabularyEditorModal";

export function VocabularySettingsSection({
  data,
  onChange,
}: Readonly<{ data: QuestData; onChange: SettingsChangeHandler }>) {
  const [editing, setEditing] = useState(false);
  const active = data.preferences.vocabularyProfile;

  function select(profile: VocabularyProfileId) {
    onChange({ vocabularyProfile: profile }, "Vocabulario de la aplicación actualizado.");
    if (profile === "custom") setEditing(true);
  }

  function updateCustom(customVocabulary: Partial<VocabularyTerms>) {
    onChange(
      { vocabularyProfile: "custom", customVocabulary },
      "Vocabulario personalizado actualizado."
    );
  }

  return (
    <SettingsCard $wide>
      <SettingsSectionHeading>
        <div>
          <Eyebrow>VOCABULARIO</Eyebrow>
          <h2>Tipo de actividad</h2>
          <p>Adapta los términos sin modificar IDs, relaciones ni historial.</p>
        </div>
        {active === "custom" && <Button onClick={() => setEditing(true)}>Editar términos</Button>}
      </SettingsSectionHeading>
      <div className="profile-grid">
        {VOCABULARY_PROFILES.map(profile => (
          <SelectableCardButton
            $selected={active === profile.id}
            key={profile.id}
            onClick={() => select(profile.id)}
          >
            <strong>{profile.label}</strong>
            <small>{profile.description}</small>
          </SelectableCardButton>
        ))}
        <SelectableCardButton $selected={active === "custom"} onClick={() => select("custom")}>
          <strong>Personalizado</strong>
          <small>Define cada término; los campos vacíos usan el valor genérico.</small>
        </SelectableCardButton>
      </div>
      {editing && (
        <VocabularyEditorModal
          value={data.preferences.customVocabulary}
          onChange={updateCustom}
          onClose={() => setEditing(false)}
        />
      )}
    </SettingsCard>
  );
}
